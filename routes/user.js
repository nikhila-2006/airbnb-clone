// Import Express
const express = require("express");

// Import the Express Router object (a mini version of the app just for routes)
const router=express.Router();

// Import User model (MongoDB with Mongoose) for authenticating users against DB
const User=require("../models/user.js");

// Import utility to handle async errors
const wrapAsync = require("../utils/wrapAsync");

// Route to render the signup form (GET request)
router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
})

// Signup route to register a new user
router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({email,username});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

// Export router so it can be used in app.js
module.exports = router;