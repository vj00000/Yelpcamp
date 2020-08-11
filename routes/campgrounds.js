var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

 router.get("/",(req, res)=>{
    // console.log(req.user);
    Campground.find({},(err, allCampgrounds)=>{
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
       }
    });
});

 router.post("/",isLoggedIn,(req, res)=>{
    // get data from form and add to campgrounds array
    var name  = req.body.name;
    var image = req.body.image;
	var desc  = req.body.description;
	 var price  = req.body.price;
	 var author = {
		 id: req.user._id,
		 username: req.user.username 
	 }
    var newCampground = {name: name,price:price, image: image, description: desc, author:author}
	console.log(req.user);
    // Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated)=>{
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    
});

 router.get("/new",isLoggedIn,(req, res)=>{
   res.render("campgrounds/new"); 
});

 router.get("/:id",(req, res)=>{ 
	Campground.findById(req.params.id).populate("comments").exec((err,foundcampgrounds)=>{
		if(err){console.log(err);}
		else 
		{
			console.log(foundcampgrounds);
			res.render("campgrounds/show",{campground:foundcampgrounds}); 
		}
	});

});

// edit campgrounds
router.get("/:id/edit",checkCampgroundOwnership,(req,res)=>{	
		Campground.findById(req.params.id,(err,foundcampgrounds)=>{
			res.render("campgrounds/edit",{campground: foundcampgrounds});
		})		
})
	
// update campgrounds
router.put("/:id",checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedcampground)=>{
		if(err) {res.redirect("/campgrounds")}
		else {res.redirect("/campgrounds/"+ req.params.id);}
		
	})
})
// destroy camp
router.delete("/:id",checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err) {res.redirect("/campgrounds");}
		else {res.redirect("/campgrounds");}
	})
	// res.send("deleter na mujhko");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
function checkCampgroundOwnership(req,res,next)
{
	if(req.isAuthenticated())
	{
		
		Campground.findById(req.params.id,(err,foundcampgrounds)=>{
		if(err) {console.log(err);}
		else 
			{
				if(foundcampgrounds.author.id.equals(req.user._id))
				{
				next();
				}
				else {res.redirect("back");}
			}
		});
	}
	else {res.redirect("back"); }
}

module.exports = router;