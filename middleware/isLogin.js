const lists=require("../model/listing.js");
const review=require("../model/review.js");
module.exports.isLoggedin=async(req,res,next)=>{
      if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
         req.flash("error","log in to add/edit");
         return  res.redirect("/login");// why used return res.redirect immediately sends a response to the client
                                        // but since there was  no return execution continued express also ran next()
                                        // that means your route handler also tried to send a response 
                                        // at a single time two response can't be send
                                }
    next();// next will  execute next middleware
};


module.exports.savedRedirectUrl=async(req,res,next)=>{
      if(req.session.redirectUrl) { 
      res.locals.redirectUrl=req.session.redirectUrl;
                                   }
      
      next()
};
module.exports.isOwner=async(req,res,next)=>{
        let{id}=req.params;
        const currentuser=res.locals.currentUser;
        let data= await lists.findOne({_id:id});
        
        if(currentuser&&!currentuser._id.equals(data.owner._id)){
        req.flash("error","Not your item")
        return res.redirect(`/listings/${id}`);
                                                              }
     next()
                                                            }
module.exports.isReviewOwner=async(req,res,next)=>{
        let{listId,reviewId}=req.params;
        let reviewData=await review.findOne({_id:reviewId}).populate("author");
        const currentuser=res.locals.currentUser;
       
        if(currentuser&&!reviewData.author._id.equals(currentuser._id)){
            req.flash("error","Not your review")
            return res.redirect(`/listings/${listId}`);
        }
      next()
}