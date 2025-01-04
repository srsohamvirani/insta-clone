const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("hello");
});

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


router.post("/signin", (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    res.status(422).json({ error: "please add email or password" });
  }
  USER.findOne({ userName: userName }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid userName or password" });
    }
    bcrypt.compare(password, savedUser.password).then((doMatch) => {
      if (doMatch) {
        res.json({ message: "Successfully signed in" });
      } else {
        res.status(422).json({ error: "Invalid userName or password" });
      }
    });
  });
});


module.exports = router;
