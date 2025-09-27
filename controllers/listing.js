const Listings=require("../models/listing.js");

// Fetch all listings and render index page
module.exports.index=async (req,res)=>{
    let allListings=await Listings.find({});
    res.render("./listings/index.ejs",{allListings});
}

// Render form for creating a new listing
module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);
    res.render("./listings/new.ejs")
}

// Create new listing and save to DB
module.exports.createlisting= async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let listing=new Listings(req.body.listing);
    listing.owner=req.user._id;
    listing.image.url=url;
    listing.image.filename=filename;
    await listing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
}

// Fetch and render a specific listing by ID
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing= await Listings.findById(id).populate( {path:"reviews",
        populate:{
            path:"author"
        }}
    ).populate("owner");
    if(!listing){
        req.flash("error","The listing you are trying to access no longer exists.")
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}

// Render edit form for an existing listing
module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing= await Listings.findById(id);
    if(!listing){
        req.flash("error","The listing you are trying to access no longer exists.")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

// Update listing details by ID
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}

// Delete listing by ID
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedList=await Listings.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}