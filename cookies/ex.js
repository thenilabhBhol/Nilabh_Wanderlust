const express=require("express")
const app=express()
var session = require('express-session')
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
var flash = require('connect-flash');
app.listen(3000,()=>{
    console.log("app is listing on port 3000")
})

app.use(session({
    secret:"mysupersecretestring",
    resave: false,
    saveUninitialized:true,
})); 
app.use(flash());
app.get("/",(req,res)=>{
    res.send("you are on root")
})
app.get("/reqCount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
  res.send(`you send a request${req.session.count} times`);
});
app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.flash("success","user registered successfully");
    req.session.name=name;
    res.redirect("/hello")
})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name: req.session.name,msg:req.flash("success")});
})