var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor amet fanny pack viral af lo-fi drinking vinegar, sartorial dreamcatcher messenger bag post-ironic seitan helvetica retro humblebrag chillwave. Etsy edison bulb iceland helvetica. Vape readymade stumptown, small batch meh ennui humblebrag. Semiotics gluten-free fingerstache craft beer kinfolk scenester aesthetic actually flexitarian."
    },
    {
        name: "Desert Mesa", 
        image: "https://d2iaf7xwaf71rg.cloudfront.net/1279/Camping_Kalahari__large.jpg",
        description: "Lorem ipsum dolor amet fanny pack viral af lo-fi drinking vinegar, sartorial dreamcatcher messenger bag post-ironic seitan helvetica retro humblebrag chillwave. Etsy edison bulb iceland helvetica. Vape readymade stumptown, small batch meh ennui humblebrag. Semiotics gluten-free fingerstache craft beer kinfolk scenester aesthetic actually flexitarian."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor amet fanny pack viral af lo-fi drinking vinegar, sartorial dreamcatcher messenger bag post-ironic seitan helvetica retro humblebrag chillwave. Etsy edison bulb iceland helvetica. Vape readymade stumptown, small batch meh ennui humblebrag. Semiotics gluten-free fingerstache craft beer kinfolk scenester aesthetic actually flexitarian."
    }
]

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
