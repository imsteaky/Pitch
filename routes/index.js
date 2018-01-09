var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/", function(req, res){
    res.render("landing")
});

//register form route
router.get("/register", function(req, res){
    res.render("register");
});

//Sign up logic route
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //If there is an error, that error from passport will 
            //be placed here. We don't have to write that message ourselves
            //If we just type "error", err);, it will display [object: Object]
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Pitch " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//login form route
router.get("/login", function(req, res){
    res.render("login");
});

//LOGIN ROUTE (handling login logic) (MIDDLEWARE)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){

});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

module.exports = router;