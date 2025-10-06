const express=require("express");
const router=express.Router();
const User=require("../model/user.js")
const wrapAsync=require("../util/wrapAsync.js");
const passport=require("passport")
const {savedRedirectUrl}=require("../middleware/isLogin.js")
router.get("/signup",(req,res)=>{
     res.render("user/signup.ejs")
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newUser=new User({username,email})
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","welcome to wanderlust");
        res.redirect("listings")
    });
    
    }
    catch(e){
        req.flash("Signup","username is already registered")
        res.redirect("/signup");
    }
}));
router.get("/login",async(req,res)=>{
       res.render("user/login.ejs");
});
router.post("/login",
     savedRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",// atomatically generate an error messgae with key error
        failureFlash:true
    }),
    async(req,res)=>{
        let redirectUrl=res.locals.redirectUrl||"/listings";
        console.log("logged in")
        req.flash("success","welcome to wanderlust!");
        
        res.redirect(`${redirectUrl}`)
    }
)
router.get("/logout",(req,res)=>{
    
    req.logout((err)=>{
        if(err){
            next(err);
        }
       
        req.flash("logout","logged you out");
        res.redirect("/listings");
    })
    
})
module.exports=router;