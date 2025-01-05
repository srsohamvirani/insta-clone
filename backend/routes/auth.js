const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("hello");
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
            return res.json({ message: "Signin successfully" });
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
