const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");

router.post("/createPost", requireLogin, (req, res) => {
  const { body, pic } = req.body;
  if (!body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
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
    const result = await POST.findByIdAndUpdate(
      { _id: req.body.postId },
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );

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
    const result = await POST.findByIdAndUpdate(
      req.body.postId, // Find post by ID
      {
        $pull: { likes: req.user._id }, // Remove user ID from likes array
      },
      {
        new: true, // Return the updated document
      }
    );

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
});

// =================== Comment ===================

router.put("/comment", requireLogin, async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id, // Attach the user's ID
  };

  try {
    const updatedPost = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment }, // Add the new comment to the post's comment array
      },
      { new: true }
    ).populate("comments.postedBy", "name pic _id"); // Populate the postedBy field with user info

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost); // Send back the updated post with populated comments
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

module.exports = router;
