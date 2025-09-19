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

// Review route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listings.findById(req.params.id);
    let newReview= new Reviews(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review added!")
    res.redirect(`/listings/${listing._id}`);
}))

// Delete Route-for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!")
    res.redirect(`/listings/${id}`);
}))

// Export router so it can be used in app.js
module.exports=router;
