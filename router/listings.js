const express=require("express");
const router=express.Router();
const wrapAsync=require("../util/wrapAsync.js");

const ExpressError=require("../util/ExpressError.js");
const listingSchema=require("../schema.js");
const lists=require("../model/listing.js"); 
const {isLoggedin,isOwner}=require("../middleware/isLogin.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({storage })
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//for map use
const mapToken=process.env.MAP_TOKEN;// for map use
const geocodingClient = mbxGeocoding({ accessToken: mapToken });// for map use
//validation listing
const validateSchema=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
    next();
         }
                                   }
router.get("/search",async(req,res)=>{
  let place=  req.query.location;//location
    let data= await lists.find({location:place})
    res.render("listings/index.ejs",{data});
})
router.get("/search/:place",async(req,res)=>{
        let{place}=req.params;
        const data= await lists.find({category:place});
       
         res.render("listings/index.ejs",{data})
});
//Show all listing
router.get("/",wrapAsync(async(req,res)=>{
    
    
   
    let data=await lists.find();
    res.render("listings/index.ejs",{data})
}));

// Edit listing
router.put("/:id", upload.single('listings[image]'),wrapAsync(async(req,res)=>{
   let{id}=req.params;
   let editedListing=await lists.findByIdAndUpdate(id,req.body.listings);
   editedListing.image.url=req.file.path;
   editedListing.image.file=req.file.filename;
   await editedListing.save();
   req.flash("edited","listing edited");
   res.redirect(`/listings/${id}`);
                                                             
}));
//Edit request
router.get("/edit/:id",
    isLoggedin,
    isOwner,
    wrapAsync(async(req,res)=>{
     let{id}=req.params;//currentUser
     let data= await lists.findOne({_id:id});
   
  
   res.render("listings/edit.ejs",{data});
      
}))
//rendering to add list template
router.get("/new"
    ,isLoggedin
    ,wrapAsync(async(req,res)=>{
    
    res.render("listings/new.ejs");
}));
//New listing
router.post("/new/create",
    
    validateSchema,
    upload.single('listings[image]'),
  
  
    wrapAsync(async(req,res,next)=>{
    let response= await geocodingClient.forwardGeocode({// for map use
    query: req.body.listings.location,// for map use
    limit: 1// for map use
                                          })
    .send();// for map use
  
    const newListing=new lists(req.body.listings);
    newListing.owner=req.user._id;
    // newListing.image.url=req.file.path;
    // newListing.image.file=req.file.filename;
    newListing.image={
        url:req.file.path,
        filename:req.file.filename,
    }
    newListing.geometry=response.body.features[0].geometry// Adding map coordinate
    let data=await newListing.save();
   
    req.flash("listing","listing added ")
    res.redirect("/listings");
     
//      console.log(req.file.path);
}));
//show listing details
router.get("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let data=await lists.findOne({_id:id}).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
       }).populate("owner");
    
    if(!data){
        
        req.flash("listNotExit","listing does't exit");
        res.redirect("/listings");
    }
    else{
       
        res.render("listings/show.ejs",{data});
        }
}));
//Delete Listing
router.delete("/delete/:id",
    isOwner,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await lists. findByIdAndDelete(`${id}`);
    req.flash("delete","listing deleted")
    res.redirect("/listings");
}));

module.exports=router;