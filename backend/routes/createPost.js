const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");



// Route
router.get("/allPosts",requireLogin, (req, res) => {
    POST.find()
        .populate("postedBy","_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
});

// Route to get the user's posts
router.get("/myposts", requireLogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(myposts => {
            res.json({ myposts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Failed to load user's posts" });
        });
});

module.exports = router