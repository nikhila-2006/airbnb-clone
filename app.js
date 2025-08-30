// require express
const express = require("express");
let app=express();

// require ejs
const ejs = require("ejs");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// require and use method-override
const methodOverride=require('method-override');
app.use(methodOverride('_method'));

// parse the url
app.use(express.urlencoded({ extended: true }));

// require mongoose and connecting with mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
.then(() => console.log('Connected!'))
.catch((err)=>{
    console.log(err);
});
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
