
//If we have multiple variables being declared in a row, we don't have to say VAR each time.
// and can just separate them with ,'s
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    //put flash before passport! 
    flash       = require("connect-flash"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    //dynamic timing since last post on campgrounds
    app.locals.moment = require('moment'),
    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
//require moment
app.locals.moment = require('moment');

//seedDB(); // This seeds the DB, filling campgrounds with dummy sites. No longer needed.


// Passport configuration
app.use(require("express-session")({
    secret: "BuT hEr EmAiLs!",
    resave: false, 
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//this line works because we're using passportLocalMongoose, without it, we'd write the method ourselves
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//our own middleware. makes it so req.user is involved in every route
//NEED to have next() to determine what happens next.
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
//this provides access to flash in every template
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//use the three route files required earlier
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Pitch Server Has Started!");
});