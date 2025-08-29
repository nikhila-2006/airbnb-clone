const express = require("express");
let app=express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wonderlust')
.then(() => console.log('Connected!'))
.catch((err)=>{
    console.log(err);
});



app.get("/",(req,res)=>{
    res.send("hi i am root");
})

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
