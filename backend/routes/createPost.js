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
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
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
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
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
    ).populate("comments.postedBy", "_id name pic"); // Populate the postedBy field with user info
    

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost); // Send back the updated post with populated comments
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

// ===================Api to Delete Post ===================
router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
  try {
    console.log("🚀 ~ router.delete ~  req.params.postId:",  req.params.postId)
    const post = await POST.findOne({ _id: req.params.postId }).populate("postedBy", "_id");
    console.log("🚀 ~ router.delete ~ post:", post)

    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }
    console.log("🚀 ~ router.delete ~ post.postedBy._id.toString() === req.user._id.toString():", post.postedBy._id.toString() === req.user._id.toString())

    console.log("🚀 ~ router.delete ~ req.user._id.toString():", req.user._id.toString())
    if (post.postedBy._id.toString() === req.user._id.toString()) {
      console.log("🚀 ~ router.delete ~ post.postedBy._id.toString():", post.postedBy._id.toString())
      await POST.deleteOne({ _id: req.params.postId });
      return res.json({ message: "Post deleted successfully" });
    } else {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;