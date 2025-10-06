const mongoose =require("mongoose")
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");

 const listingSchema=new mongoose.Schema({
      title:{
        type:String,
        requires:true,
      } ,
      description:{
        type:String,
      },
      image:{
            url:String,
            file:String
      },
      price:{
          type:Number,
          
      },
      location:{
          type:String,
          requied:true,
      },
      country:{
        type:String,
        required:true,
      },
      reviews:[{
         type:  Schema.Types.ObjectId,
         ref:"Review"
              } ],
      owner:{
        type:Schema.Types.ObjectId,
        ref:"user",

            },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      
    },
    coordinates: {
      type: [Number],
     
    }
                  },
    category:{//category
      type:String,
      enum:['Mountain','Farms','Camp','Iconic cities','Pool','castles','Beach hotel','Iconic cities','pool','mountain']
      
    }
  });
  // listingSchema.post("findOneAndDelete",async(listing)=>{
  //      if(listing){
  //        await Review.deleteMany({_id:{$in:listing.reviews}});
  //      }
  // });

  
 
 const listing=mongoose.model("listing",listingSchema);
 module.exports=listing;