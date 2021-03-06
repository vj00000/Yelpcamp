 var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register",(req,res)=>{
	res.render("register");
});
//handle sign up logic
router.post("/register",(req,res)=>{
	var newUser = new User({username: req.body.username})
	User.register(newUser,req.body.password,(err,user)=>{
		if(err)
		{	console.log(err);
		 	return res.render("register");
	     }
		passport.authenticate("local")(req,res,()=>{
		res.redirect("/campgrounds");	
		})	;
	});	
});
//login form
router.get("/login",(req,res)=>{
	res.render("login");
})
//handle login form
router.post("/login",passport.authenticate("local",
	{
	 successRedirect : "/campgrounds",
	 failureRedirect : "/login"
	
	}),(req,res)=>{
		// console.log("login");
})
router.get("/logout",(req,res)=>{
	req.logout();
	console.log("thik");
	res.redirect("/campgrounds");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router;
