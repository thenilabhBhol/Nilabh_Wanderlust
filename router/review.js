const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const lists=require("../model/listing.js"); 
const Review=require("../model/review.js");
const {isLoggedin,isOwner,isReviewOwner}=require("../middleware/isLogin.js");
// DELETE REVIEW
router.delete("/:reviewId",isReviewOwner,//:listId not defined because it is already include in app.js find out there
          async(req,res,next)=>{
          let{listId,reviewId}=req.params;
          await lists.findByIdAndUpdate(listId,{$pull:{reviews:reviewId}})
          await Review.findByIdAndDelete(reviewId);
          res.redirect(`/listings/${listId}`)
});
// ADD REVIEW
router.post("/",
     
     async(req,res,next)=>{
      
     let{listId}=req.params;
     const listingData= await lists.findOne({_id:listId})
     const addReview=  new Review( req.body.review);
     addReview.author=req.user._id;
     await addReview.save();
    
    
     listingData.reviews.push(addReview);
     await  listingData.save();
     const listWithReview= await lists.findOne({_id:listId})
     
     req.flash("review","your review added");
     
     res.redirect(`/listings/${listId}`);
});
module.exports=router;