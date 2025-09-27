if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

// Import Express
const express = require("express");
let app=express();

// Import and configure express-session
const session=require("express-session");

// Define session options
const sessionOptions=session({
    secret:"mysupersecretsession",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true 
    }
});

// Import connect-flash (for storing temporary flash messages in session)
const flash = require('connect-flash');

// Import listings route file
const listingRouter=require("./routes/listing.js");

// Import review route file
const reviewRouter=require("./routes/review.js");

// Import user route file
const userRouter=require("./routes/user.js");

// Import EJS and ejs-mate (for layouts/partials support)
const ejs = require("ejs");
const engine = require('ejs-mate');
const path = require("path");

// Import custom error class for handling HTTP errors
const ExpressError = require("./utils/ExpressError.js");

// Import Passport.js core library for authentication
const passport=require("passport");

// Import Passport's LocalStrategy for username/password authentication
const LocalStrategy=require("passport-local");

// Import User model (MongoDB with Mongoose) for authenticating users against DB
const User=require("./models/user.js");

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

// Enable sessions in the app using the configured session options
app.use(sessionOptions);

// Enable flash messages (stored in session, shown once, then cleared)
app.use(flash());

// Initialize Passport middleware
app.use(passport.initialize());

// Allow persistent login sessions 
app.use(passport.session());

// Use the LocalStrategy provided by passport-local-mongoose for authentication
passport.use(new LocalStrategy(User.authenticate()));

// Serialize user data into the session (stores user ID in the session cookie)
passport.serializeUser(User.serializeUser());

// Deserialize user data from the session (retrieves full user object using ID)
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages available in all views (EJS templates)
app.use((req,res,next)=>{
    res.locals.success=req.flash("success") || [];
    res.locals.error=req.flash("error") || [];
    res.locals.currUser=req.user;
    next();
})

// root route
app.get("/",(req,res)=>{
    res.send("hi i am root");
})

// Use the listings router for all routes starting with "/listings"
app.use("/listings",listingRouter);

// Use the review router for all routes starting with "/listings/:id/reviews"
app.use("/listings/:id/reviews",reviewRouter)

// Use the user router for all routes for sign-up and login
app.use("/",userRouter);

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
