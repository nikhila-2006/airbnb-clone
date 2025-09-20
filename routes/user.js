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

// Import user controllers
const userControllers=require("../controllers/user.js");

// Route to render the signup form (GET request)
router.get("/signup",userControllers.renderSignupForm)

// Signup route to register a new user
router.post("/signup",wrapAsync(userControllers.signup))

// Show login form
router.get("/login",userControllers.renderLoginForm)

// Handle login authentication
router.post("/login",saveRedirectUrl, passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: true 
    }),
    userControllers.login)

router.get("/logout",userControllers.logout)

// Export router so it can be used in app.js
module.exports = router;