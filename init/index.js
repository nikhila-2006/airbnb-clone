const mongoose = require('mongoose');
const initData=require("./data.js");
const Listing=require("../models/listing.js");
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
.then(() => console.log('Connected!'))
.catch((err)=>{
    console.log(err);
});

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:'68c9948517389dbf376e1171'}))
    await Listing.insertMany(initData.data);
    console.log("initialized data");
}
initDB();