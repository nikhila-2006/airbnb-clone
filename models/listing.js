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
            default:"https://www.shutterstock.com/image-illustration/random-pictures-cute-funny-2286554497?dd_referrer=https%3A%2F%2Fwww.google.com%2F",
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