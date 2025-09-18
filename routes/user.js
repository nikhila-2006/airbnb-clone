// Import Express
const express = require("express");

// Import the Express Router object
const router=express.Router();

// Import passport
const passport=require("passport");

// Import User model (MongoDB with Mongoose) for authenticating users against DB
const User=require("../models/user.js");

// Import utility to handle async errors
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");

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
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

// Show login form
router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
})

// Handle login authentication
router.post("/login",saveRedirectUrl, passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: true 
    }),
    async(req,res)=>{
        const redirectUrl=res.locals.redirectUrl || "/listings";
        req.flash("success","Welcome Back to Wanderlust");
        res.redirect(redirectUrl);
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
})

// Export router so it can be used in app.js
module.exports = router;