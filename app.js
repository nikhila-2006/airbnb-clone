// Import Express
const express = require("express");
let app=express();

// Import EJS and ejs-mate (for layouts/partials support)
const ejs = require("ejs");
const engine = require('ejs-mate');
const path = require("path");

// Import utility to handle async errors
const wrapAsync = require("./utils/wrapAsync.js");

// Import custom error class for handling HTTP errors
const ExpressError = require("./utils/ExpressError.js");

// Validates listing data and throws an error if invalid.  
const {listingSchema}=require("./schema.js");
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Validates reviews data and throws an error if invalid.
const {reviewSchema}=require("./schema.js");
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Set EJS as view engine and use ejs-mate for layouts
app.engine('ejs', engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// Serve static files (CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, "public")));

// Import and use method-override (to support PUT/DELETE in forms)
const methodOverride=require('method-override');
app.use(methodOverride('_method'));

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
.then(() => console.log('Connected!'))
.catch((err)=>{
    console.log(err);
});

// Import Listing model
const Listings=require("./models/listing.js");

// Import Reviews model
const Reviews=require("./models/review.js");

// index route
app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings=await Listings.find({});
    res.render("./listings/index.ejs",{allListings});
}))

// New route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs")
})

// Create route
app.post("/listings",validateListing,wrapAsync( async(req,res)=>{
    let listing=new Listings(req.body.listing);
    await listing.save();
    res.redirect("/listings");
}))

// show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing= await Listings.findById(id);
    res.render("./listings/show.ejs",{listing});
}))

// Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing= await Listings.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

// Update Route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

// Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedList=await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
}))

// Review route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listings.findById(req.params.id);
    let newReview= new Reviews(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("done");
    res.redirect(`/listings/${listing._id}`);
}))

// root route
app.get("/",(req,res)=>{
    res.send("hi i am root");
})

// Catch-all for undefined routes
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

//  Error Handling Middleware
app.use((err,req,res,next)=>{
    const {statusCode=500,message="Something Went Wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
}) 

//checking server listening or not
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
