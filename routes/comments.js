var express = require("express");
//this ---------------------------V will merge the params from campground and comments together.
//so that inside the comment route, we can access :id
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//New Comments
//we want to make it so you have to be logged in to comment, so we just add
//isLoggedIn, right here -v
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find Pitch site by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});


// Create Comment
// requiring the user to be logging in ---v to make post requests
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup a campground using ID
   Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
     //create new comment
      } else { 
          Comment.create(req.body.comment, function(err, comment){
             if(err){
                 console.log(err);
             } else {
//connect new comment to campground
//redirect back to show page of the campground we're on
//add username and ID to comment "How do we get the current user, username?"
//because we have middleware that requires the user to log in before they see this page,
//we only need req.user
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});
//EDIT COMMENTS ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id );
       }
   }); 
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;