// Import Express
const express = require("express");
let app=express();

// Import EJS and ejs-mate (for layouts/partials support)
const ejs = require("ejs");
const engine = require('ejs-mate');
const path = require("path");

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

// index route
app.get("/listings",async (req,res)=>{
    let allListings=await Listings.find({});
    res.render("./listings/index.ejs",{allListings});
})

// New route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs")
})

// Create route
app.post("/listings",async (req,res)=>{
    let listing=new Listings(req.body.listing);
    await listing.save();
    res.redirect("/listings");
})

// show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let listing= await Listings.findById(id);
    res.render("./listings/show.ejs",{listing});
})

// Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing= await Listings.findById(id);
    res.render("listings/edit.ejs",{listing})
})

// Update Route
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedList=await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
})

// root route
app.get("/",(req,res)=>{
    res.send("hi i am root");
})

//checking server listening or not
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
