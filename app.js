
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
    ratingRoutes     = require("./routes/ratings"),
    indexRoutes      = require("./routes/index")

//local host mongoose.connect("mongodb://localhost/yelp_camp");
//mlab host
mongoose.connect("mongodb://cole:lbew3451@ds255767.mlab.com:55767/pitch", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
//require moment
app.locals.moment = require('moment');


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

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/ratings", ratingRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Pitch Server Has Started!");
});