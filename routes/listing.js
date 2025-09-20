// Import Express
const express = require("express");

// Import the Express Router object (a mini version of the app just for routes)
const router=express.Router();

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

// Index route
router.get("/",wrapAsync(listingsControllers.index))

// New route
router.get("/new",isLoggedIn,listingsControllers.renderNewForm)

// Create route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingsControllers.createlisting))

// show route
router.get("/:id",wrapAsync(listingsControllers.showListing))

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingsControllers.renderEditForm))

// Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingsControllers.updateListing))

// Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingsControllers.destroyListing))

// Export router so it can be used in app.js
module.exports = router;