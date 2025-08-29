const express = require("express");
let app=express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
.then(() => console.log('Connected!'))
.catch((err)=>{
    console.log(err);
});



app.get("/",(req,res)=>{
    res.send("hi i am root");
})
app.get("/allListing",async (req,res)=>{
    let listing=new Listing({
        title:"Agni Studio with Pool across Talpona River",
        description:"2 guests1 bedroom1 bed1 bathroom",
        price:1200,
        location:"Entire rental unit in Canacona",
        country:"India"
    })
    await listing.save();
    res.send("succcesful");
})
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
