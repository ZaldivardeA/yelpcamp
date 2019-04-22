var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err || !campground){
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    }else{
      res.render("comments/new", {campground: campground});
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err || !campground){
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    }else{
      //Create new comment
      Comment.create(req.body.comment, (err, comment)=>{
        if(err){
          console.log(err);
          req.flash("error", "Something went wrong");
          res.redirect("/campgrounds/" + req.params.id);
        }else{
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Succesfully added comment");
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findById(req.params.comment_id, (err, foundComment)=>{
    if(err || !foundComment){
      req.flash("error", "Comment not found");
      res.redirect("back");
    }else{
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

// Update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, modComment)=>{
    if(err || !modComment){
      req.flash("error", "Comment not found");
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

// Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
    if(err){
      req.flash("error", "Error deleting comment");
      res.redirect("back");
    }else{
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;