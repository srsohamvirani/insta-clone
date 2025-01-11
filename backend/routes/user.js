const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");

// Fetch current user's profile, posts, followers, and following details
router.get('/myprofile', requireLogin, async (req, res) => {
    try {
        const user = await USER.findOne({ _id: req.user._id })
            .populate('followers', '_id name pic')
            .populate('following', '_id name pic');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await POST.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name userName email")
            .populate({
                path: "comments.postedBy",
                select: "_id name userName",
            });

        return res.status(200).json({ user, posts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred" });
    }
});

// to get user profile
router.get("/user/:id", async (req, res) => {
    try {
        // Find the user by ID
        const user = await USER.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the posts by the user
        const posts = await POST.find({ postedBy: req.params.id })
            .populate("postedBy", "_id name userName email") // Populate the postedBy field
            .populate({
                path: "comments.postedBy",
                select: "_id name userName", // Optionally populate comments' postedBy
            });

        // Return the user and posts
        return res.status(200).json({ user, posts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred" });
    }
});

// Fetch user details along with followers and following details
router.get('/user/:id', requireLogin, (req, res) => {
    USER.findOne({ _id: req.params.id })
        .populate('followers', '_id name pic')
        .populate('following', '_id name pic')
        .then(user => {
            POST.find({ postedBy: req.params.id })
                .populate('postedBy', '_id name')
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err });
                    }
                    res.json({ user, posts });
                });
        })
        .catch(err => {
            return res.status(404).json({ error: "User not found" });
        });
});

// to follow a user
router.put("/follow", requireLogin, (req, res) => {
    USER.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.user._id } },
        { new: true }
    )
    .populate('followers', '_id name pic')
    .populate('following', '_id name pic')
    .then(result => {
        USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        )
        .populate('followers', '_id name pic')
        .populate('following', '_id name pic')
        .then(result => res.json(result))
        .catch(err => res.status(422).json({ error: err }));
    })
    .catch(err => res.status(422).json({ error: err }));
});

// to unfollow a user
router.put("/unfollow", requireLogin, (req, res) => {
    USER.findByIdAndUpdate(
        req.body.followId,
        { $pull: { followers: req.user._id } },
        { new: true }
    )
    .populate('followers', '_id name pic')
    .populate('following', '_id name pic')
    .then(result => {
        USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        )
        .populate('followers', '_id name pic')
        .populate('following', '_id name pic')
        .then(result => res.json(result))
        .catch(err => res.status(422).json({ error: err }));
    })
    .catch(err => res.status(422).json({ error: err }));
});

// to upload profile picture
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        console.log("Updating profile picture for:", req.user._id);
        console.log("New picture URL:", req.body.pic);

        const user = await USER.findByIdAndUpdate(
            req.user._id,
            { $set: { Photo: req.body.pic } },
            { new: true, runValidators: true }
        )
        .populate("followers", "_id name pic")
        .populate("following", "_id name pic");

        if (!user) {
            console.log("No user found for the given ID:", req.user._id);
            return res.status(404).json({ error: "User not found" });
        }

        console.log("User updated successfully:", user);
        res.json(user);
    } catch (err) {
        console.error("Error in /uploadProfilePic:", err);
        res.status(422).json({ error: err.message });
    }
});

// to remove profile picture
router.put("/removeProfilePic", requireLogin, async (req, res) => {
    try {
        console.log("Removing profile picture for:", req.user._id);

        const user = await USER.findByIdAndUpdate(
            req.user._id,
            { $unset: { Photo: "" } }, // Use $unset to remove the Photo field
            { new: true, runValidators: true }
        )
        .populate("followers", "_id name pic")
        .populate("following", "_id name pic");

        if (!user) {
            console.log("No user found for the given ID:", req.user._id);
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Profile picture removed successfully:", user);
        res.json(user);
    } catch (err) {
        console.error("Error in /removeProfilePic:", err);
        res.status(422).json({ error: err.message });
    }
});



module.exports = router;