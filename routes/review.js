// Import Express
const express = require("express");

// Import the Express Router object (a mini version of the app just for routes)
const router=express.Router({mergeParams : true});

// Import utility to handle async errors
const wrapAsync = require("../utils/wrapAsync.js");

// Import custom error class for handling HTTP errors
const ExpressError = require("../utils/ExpressError.js");

// Import review schema
const {reviewSchema}=require("../schema.js");

// Import middleware's to validate,check login status and to check author of the review
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

// Import Listing model
const Listings=require("../models/listing.js");

// Import Reviews model
const Reviews=require("../models/review.js");

// Import review controller
const reviewController=require("../controllers/review.js");

// Review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// Delete Route-for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

// Export router so it can be used in app.js
module.exports=router;
