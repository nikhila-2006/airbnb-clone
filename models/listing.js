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
            set:(v)=> v==="" ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" : v,
            }
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: 'Review' 
        }
    ]
    
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;