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

// Route
router.post("/createPost",requireLogin, (req, res) => {
    const { body, pic } = req.body;
    if (!body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    console.log(req.user);
    
    const post = new POST({
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.status(200).json({ post: result,message:"Post Created Successfully" })
    }).catch(err => {
        console.log(err)
    })
});
   

module.exports = router