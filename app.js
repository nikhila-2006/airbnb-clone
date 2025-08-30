// require express
const express = require("express");
let app=express();

// require ejs
const ejs = require("ejs");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// require mongoose and connecting with mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
.then(() => console.log('Connected!'))
.catch((err)=>{
    console.log(err);
});
const Listing=require("./models/listing.js");

// index route
app.get("/listings",async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

// root route
app.get("/",(req,res)=>{
    res.send("hi i am root");
})

//checking server listening or not
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
