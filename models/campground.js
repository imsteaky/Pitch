var mongoose = require("mongoose");
mongoose.Promise = global.Promise; 

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name:  String,
   image: String,
   description: String,
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
   ]
});

module.exports = mongoose.model("campground", campgroundSchema);