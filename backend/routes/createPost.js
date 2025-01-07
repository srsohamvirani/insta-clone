const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");

router.post("/createPost", requireLogin, (req, res) => {
  const { body, pic } = req.body;
  console.log(pic);
  if (!body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  console.log(req.user);
  const post = new POST({
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      return res.json({ post: result });
    })
    .catch((err) => console.log(err));
});
// Route
router.get("/allPosts", requireLogin, (req, res) => {
  POST.find()
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Route to get the user's posts
router.get("/myposts", requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to load user's posts" });
    });
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    console.log("🚀 ~ router.put ~ req.body.postId:", req.body.postId);

    const result = await POST.findByIdAndUpdate(
      { _id: req.body.postId },
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );

    console.log("🚀 ~ router.put ~ result:", result)
    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
    try {
      console.log("🚀 ~ router.put ~ req.body.postId:", req.body.postId);
      console.log("🚀 ~ router.put ~ req.user._id:", req.user._id);
  
      const result = await POST.findByIdAndUpdate(
        req.body.postId, // Find post by ID
        {
          $pull: { likes: req.user._id }, // Remove user ID from likes array
        },
        {
          new: true, // Return the updated document
        }
      );
  
      console.log("🚀 ~ router.put ~ result:", result)
      if (!result) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(422).json({ error: err.message });
    }
  });
  
module.exports = router;
