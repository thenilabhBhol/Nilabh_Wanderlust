const mongoose =require("mongoose");
const listing=require("../model/listing.js");
const data=require("./data.js");
main()
 .then((data)=>{
    console.log("connected sucessfuly");
 })
 .catch((data)=>{
    console.log("failed to connect")
 })
 async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/listings");
    
 }
 const intDB=async()=>{
   await listing.deleteMany({});
   data.initdata= data.initdata.map((obj)=>({...obj,owner:"68dd074e2994c45c2a5f92b2"}))
     await listing.insertMany(data.initdata);
     
 }
 intDB();