var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// comments new
router.get("/new",isLoggedIn, (req,res)=>{
	// find campground by id
	Campground.findById(req.params.id,(err,campground)=>{
		if(err) {console.log(err);}
		else {res.render("comments/new", {campground:campground}); }
	})
	
});

// comments create
router.post("/",isLoggedIn,(req,res)=>{
	 // get data from form and add to campgrounds array
	Campground.findById(req.params.id,(err,campground)=>
	{	if(err){console.log(err);
		res.redirect("/campgrounds");
	} 
	else {
			Comment.create(req.body.comment, (err, comment)=>{
			if(err)
			{
				console.log(err);
			} else 
				{
					//add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
            //  save comment
					comment.save();
				//  console.log("my namw is something who has commented on these post hahahah "+ req.user.username );	
				campground.comments.push(comment);
				campground.save();
			    console.log(comment);
				res.redirect("/campgrounds/"+ campground._id);  
				}
			});
	     }
	})  
});
//Edit comment
router.get("/:comment_id/edit",checkCommentOwnership, (req,res)=>{
	// find campground by id
	Comment.findById(req.params.comment_id,(err,foundcomment)=>{
		 if(err) {
			 res.redirect("back");
		 }else
					 {
			 res.render("comments/edit",{campground_id:req.params.id, comment:foundcomment}); }
	})
});
//Update comment
router.put("/:comment_id",checkCommentOwnership, (req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
		if(err){res.redirect("back");}
		else {res.redirect("/campgrounds/" + req.params.id);}
		
	})
})

//Destroy Router
router.delete("/:comment_id",checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCommentOwnership(req,res,next)
{
	if(req.isAuthenticated())
	{
		
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err) {console.log(err);}
		else 
			{
				if(foundComment.author.id.equals(req.user._id))
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