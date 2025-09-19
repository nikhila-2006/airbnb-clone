const Listings=require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const Reviews=require("./models/review.js");
const {reviewSchema}=require("./schema.js");

// middleware to check login status
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("error","You mush be logged in to create listing!");
        return res.redirect('/login');
    }
    next();
}

// middleware to save redirect url after login
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// middleware to check the owner of the listing(authorization)
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listings.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Only the owner can edit or delete this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// middleware to validate listing schema
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// middleware to validate review schema
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// middleware to check the author of the review (authorization)
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Reviews.findById(reviewId);
    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","Only the author can delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}