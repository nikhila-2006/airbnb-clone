const Listings=require("../models/listing.js");
const Reviews=require("../models/review.js");

module.exports.createReview=async(req,res)=>{
    let listing=await Listings.findById(req.params.id);
    let newReview= new Reviews(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review added!")
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!")
    res.redirect(`/listings/${id}`);
}