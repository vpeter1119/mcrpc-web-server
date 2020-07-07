const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./user_model");

const router = express.Router();

router.post("/register", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  let isAdmin = false;
  var origin = req.headers.origin;
  console.log(
    "Login request from " + origin + " with username: " + req.body.username
  );
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
		console.log("Authentication failed: no user found.");
        return res.status(404).json({
          message: ("No user with username " + req.body.username + " found.")
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
		console.log("Authentication failed: incorrect password.");
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (fetchedUser._id == process.env.ADMIN_ID) {
        isAdmin = true;
        console.log("isAdmin status: " + isAdmin);
      } else {
        console.log(fetchedUser._id);
        console.log(process.env.ADMIN_ID);
        console.log("isAdmin status: " + isAdmin);
      }
      const token = jwt.sign(
        {
          username: fetchedUser.username,
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
		userData: fetchedUser,
        userId: fetchedUser._id,
        isAdmin: isAdmin
      });
    })
    .catch(err => {
		console.log("Authentication failed: other error.");
		console.log(err);
      return res.status(500).json({
        message: "Auth failed: server error."
      });
    });
});

module.exports = router;