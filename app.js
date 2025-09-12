// Import Express
const express = require("express");
let app=express();

// Import listings route file
const listings=require("./routes/listing.js");

// Import review route file
const reviews=require("./routes/review.js");

// Import EJS and ejs-mate (for layouts/partials support)
const ejs = require("ejs");
const engine = require('ejs-mate');
const path = require("path");

// Import custom error class for handling HTTP errors
const ExpressError = require("./utils/ExpressError.js");

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

// Use the listings router for all routes starting with "/listings"
app.use("/listings",listings);

// Use the review router for all routes starting with "/listings/:id/reviews"
app.use("/listings/:id/reviews",reviews)

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
