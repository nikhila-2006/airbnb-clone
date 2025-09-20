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

// Signup route with GET for form and POST to handle user registration
router.route("/signup")
.get(userControllers.renderSignupForm)
.post(wrapAsync(userControllers.signup))

// Login route with GET for form, POST for authentication
router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: true 
    }),userControllers.login)

// Logout route
router.get("/logout",userControllers.logout)

// Export router so it can be used in app.js
module.exports = router;