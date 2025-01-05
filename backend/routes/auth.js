const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../keys");
const requirelLogin = require("../middlewares/requirelLogin");

router.get("/", (req, res) => {
  res.send("hello");
});


router.get("/createPost",requirelLogin, (req, res) => {
   return res.json({message: "Post created successfully"});
    
});


// ==========signup==================

router.post("/signup", (req, res) => {
  const { name, userName, email, password } = req.body;
  if (!name || !userName || !email || !password) {
    res.status(422).json({ error: "please add all the fields" });
  }
  USER.findOne({$or: [{email: email}, {userName: userName}]}).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "user already exists with that email or userName" });
    }

    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new USER({
        name,
        userName,
        email,
        password: hashedPassword,
      });
      user
        .save()
        .then(() => {
          res.json({ message: "Registered successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
// ==========signin==================

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  USER.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email " });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {

        if (match) {
            // return res.json({ message: "Signin successfully" });
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            res.json(token);
            console.log(token);
        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      })
        .catch((err) => {
            console.log(err);
        });
  });
});


module.exports = router;
