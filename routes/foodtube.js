var express = require("express");
var router  = express.Router();
var Blog = require("../models/foodtube");
var middleware = require("../middleware");




router.get("/",function(req,res){
		   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("foodtube/index", {blogs: blogs}); 
       }
   });
});

// router.get("/blogs", function(req, res){
//    Blog.find({}, function(err, blogs){
//        if(err){
//            console.log("ERROR!");
//        } else {
//           res.render("foodtube/index", {blogs: blogs}); 
//        }
//    });
// });  /*  stop here */

router.get("/new",middleware.isLoggedIn, function(req,res){
		res.render("foodtube/new");
});



router.post("/", function(req, res){
    // create blog
    console.log(req.body);
    console.log("===========")
    console.log(req.body);
    var name = req.body.title;
    var image = req.body.image;
    var desc = req.body.body;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBlogPost = {title: name, image: image, body: desc, author:author}
    Blog.create(newBlogPost, function(err, newBlog){
        if(err){
            res.render("foodtube/new");
        } else {
            //then, redirect to the index
            res.redirect("/foodtube");
        }
    });
});


// SHOW ROUTE
router.get("/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/foodtube");
       } else {
           res.render("foodtube/show", {blog: foundBlog});
       }
   })
});

// EDIT ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/foodtube");
        } else {
            res.render("foodtube/edit", {blog: foundBlog});
        }
    });
});

router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/foodtube");
      }  else {
          res.redirect("/foodtube/" + req.params.id);
      }
   });
});

router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/foodtube");
       } else {
           res.redirect("/foodtube");
       }
   })
   //redirect somewhere
});

module.exports = router;