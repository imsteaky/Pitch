var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back")
                } else {
                    //does the user own the campground
                    // foundCampground.author.id === req.user._id WILL NOT WORK because req.user._id is a string
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
    } else {
        //take the user back to where they came from
        req.flash("error", "You need to be logged in to do that");
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
                        req.flash("error", "You don't have permission to edit this comment");
                        res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("error", "You need to be logged in to do that");
        //take the user back to where they came from
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}
module.exports = middlewareObj