// Import Express
const express = require("express");

// Import the Express Router object (a mini version of the app just for routes)
const router=express.Router();

// Import multer(middleware) to upload image files
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// Import middleware to check login status
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const {saveRedirectUrl}=require("../middleware.js");

// Import utility to handle async errors
const wrapAsync = require("../utils/wrapAsync.js");

// Import custom error class for handling HTTP errors
const ExpressError = require("../utils/ExpressError.js");

// Import listing schema  
const {listingSchema}=require("../schema.js");

// Import Listing model
const Listings=require("../models/listing.js");

// Import listing controllers
const listingsControllers=require("../controllers/listing.js");

// Root listings route: GET fetches all listings asynchronously, POST creates a new listing with validation and authentication
router.route("/")
.get(wrapAsync(listingsControllers.index))
// .post(isLoggedIn,validateListing,wrapAsync(listingsControllers.createlisting))
.post(upload.single('listing[image][url]'),(req,res)=>{
    res.send(req.file);
})

// New route
router.get("/new",isLoggedIn,listingsControllers.renderNewForm)

// Routes for listing by ID: GET shows, PUT updates, DELETE removes with necessary auth and validations
router.route("/:id")
.get(wrapAsync(listingsControllers.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingsControllers.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingsControllers.destroyListing))

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingsControllers.renderEditForm))

// Export router so it can be used in app.js
module.exports = router;