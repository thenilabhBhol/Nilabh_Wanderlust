   if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
   }


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsync=require("./util/wrapAsync.js")
const ExpressError=require("./util/ExpressError.js");
//const listingSchema=require("./schema.js");
app.engine('ejs',ejsMate);
app.use(methodOverride("_method"));
//const lists=require("./model/listing.js"); 
const Review=require("./model/review.js");
app.set("view engine" ,'ejs');
app.set("views",path.join(__dirname,"/view"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
const listings=require("./router/listings.js")
const reviews=require("./router/review.js")
const userRouter=require("./router/user.js")
var session = require('express-session');
const MongoStore = require('connect-mongo');
var flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./model/user.js");
const dburl=process.env.ATLASDB_URL;
console.log(dburl);
main()
   .then((data)=>{
    console.log("connection successful");
   })
   .catch((err)=>{
    console.log("throw error");
   })
   async function main(){
      return mongoose.connect(dburl);
   }
//let port=process.env.PORT||10000;
app.listen(8080,()=>{
    console.log("app is listening");
})
const store= MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
 store.on("error",()=>{
    console.log("Error is Mongo Session",err);
 })
const sessionOption={
         store,
         secret:process.env.SECRET,
         resave:false,
         saveUninitialized:false,
         cookie:{
            expires:Date.now()+7*24*60*1000,
            maxAge:7*24*60*1000,
            httpOnly:true
         }
}


app.use(session(sessionOption));
app.use(flash())


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("listing");
    res.locals.deleteInfo=req.flash("delete");
    res.locals.editInfo=req.flash("edited");
    res.locals.reviewInfo=req.flash("review");
    res.locals.listExitOrNot=req.flash("listNotExit")
    res.locals.signup=req.flash("Signup")
    res.locals.loginError=req.flash("error")
    res.locals.logout=req.flash("logout");
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success");
    next()
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new user({
//           email:"student@gmail.com",
//          // username:"delta-student"
//     });
//    const regUser=await user.register(fakeUser,"helloworld");
//    res.send(regUser);
// })
app.use("/listings",listings);
app.use("/listings/:listId/reviews",reviews);
app.use("/",userRouter);

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
   res.render("Error/error.ejs",{err})
});
