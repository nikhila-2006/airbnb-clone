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

// Validates listing data and throws an error if invalid.  
const {listingSchema}=require("../schema.js");

// Import Listing model
const Listings=require("../models/listing.js");

// index route
router.get("/",wrapAsync(async (req,res)=>{
    let allListings=await Listings.find({});
    res.render("./listings/index.ejs",{allListings});
}))

// New route
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);
    res.render("./listings/new.ejs")
})

// Create route
router.post("/",isLoggedIn,validateListing,wrapAsync( async(req,res)=>{
    let listing=new Listings(req.body.listing);
    listing.owner=req.user._id;
    await listing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
}))

// show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing= await Listings.findById(id).populate( {path:"reviews",
        populate:{
            path:"author"
        }}
    ).populate("owner");
    if(!listing){
        req.flash("error","The listing you are trying to access no longer exists.")
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}))

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing= await Listings.findById(id);
    if(!listing){
        req.flash("error","The listing you are trying to access no longer exists.")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))

// Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}))

// Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedList=await Listings.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}))

// Export router so it can be used in app.js
module.exports = router;