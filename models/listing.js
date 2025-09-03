const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        filename: {
            type: String,
            default: "listingimage"
        },
        
            url:{
                type:String,
            default:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            set:(v)=> v==="" ? "https://www.shutterstock.com/image-illustration/random-pictures-cute-funny-2286554497?dd_referrer=https%3A%2F%2Fwww.google.com%2F" : v,
            }
    },
    price:{
        type:String
    },
    location:{
        type:String
    },
    country:{
        type:String
    }
    
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;