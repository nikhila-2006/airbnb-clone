// require express
const express = require("express");
let app=express();

// require ejs
const ejs = require("ejs");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

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

// root route
app.get("/",(req,res)=>{
    res.send("hi i am root");
})

//checking server listening or not
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
