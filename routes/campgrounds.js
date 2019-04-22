var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", (req, res)=>{
  // Get all campgrounds from db
  Campground.find({}, (err, campgrounds)=>{
    if(err){
      console.log(err);
      res.redirect("back");
    }else{
      res.render("campgrounds/index", {campgrounds:campgrounds});
    }
  });
});

//CREATE
router.post("/", middleware.isLoggedIn, (req, res)=>{
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, price:price, image: image, description:desc, author:author};
  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated)=>{
    if(err){
      console.log(err);
      res.redirect("back");
    }else{
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//NEW
router.get("/new", middleware.isLoggedIn, (req, res)=>{
  res.render("campgrounds/new");
});

//SHOW
router.get("/:id", (req, res)=>{
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec((err, foundCamp)=>{
    if(err || !foundCamp){
      req.flash("error", "Campground not found");
      res.redirect("back");
    }else{
      //render show template with that campground
      res.render("campgrounds/show", {campground: foundCamp});
    }
  });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCamp)=>{
      res.render("campgrounds/edit", {campground: foundCamp});
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwner, (req, res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updated)=>{
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwner, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      campground.remove();
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;