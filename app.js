
//If we have multiple variables being declared in a row, we don't have to say VAR each time.
// and can just separate them with ,'s
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//connecting CSS
app.use(express.static(__dirname + "/public"))
seedDB();



// Passport configuration
app.use(require("express-session")({
    secret: "BuT hEr EmAiLs!",
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//this line works because we're using passportLocalMongoose, without it, we'd write the method ourselves
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//our own middleware. makes it so req.user is involved in every route
//NEED to have next() to determine what happens next.
app.use(function(req, res, next){
   res.locals.currentUser = req.user; 
   next();
});


app.get("/", function(req, res){
    res.render("landing")
});
//=====================================================
//INDEX - show all campgrounds
//=====================================================

app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
});
//=====================================================
//CREATE - add new campground to DB
//=====================================================

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});
//=====================================================
//NEW - show form to create new Pitch site
//=====================================================

app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one Pitch site
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID, populate comments on that campground, execute following query
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})
    
//=====================================================
// COMMENTS ROUTE - comments and ratings for each Pitch site
//=====================================================

//we want to make it so you have to be logged in to comment, so we just add
//isLoggedIn, right here ---------------v
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    //find Pitch site by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

// requiring the user to be logging in ---v to make post requests
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
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
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//=====================================================
//        AUTH ROUTES
//=====================================================


//get request to show register form
app.get("/register", function(req, res){
    res.render("register");
});

//Post request to handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
});

//=====================================================
//LOGIN ROUTE (handling login logic)
//MIDDLEWARE
//=====================================================

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){

});

//=====================================================
//LOGOUT ROUTE (get request)
//=====================================================

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

//If we wanted to require being logged in for any page, we'd just include the isLoggedIn function
//on any route we want

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Pitch Server Has Started!")
});