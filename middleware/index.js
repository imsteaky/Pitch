var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back")
                } else {
                    //does the user own the campground
                    // foundCampground.author.id === req.user._id WILL NOT WORK because req.user._id is a string
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
    } else {
        //take the user back to where they came from
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
                } else {
                    //does the user own the comment?
                    // foundComment.author.id === req.user._id WILL NOT WORK because req.user._id is a string
                    if(foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
    } else {
        //take the user back to where they came from
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = middlewareObj