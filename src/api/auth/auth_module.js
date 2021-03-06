const debug = global.debug;
const config = require("../../config/config");
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
      password: hash,
      isAdmin: false,
      isActive: false,
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: `User with username=${result.username} id=${result._id} created!`
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
  var origin = req.headers.origin;
  if (debug) console.log(
    "Login request from " + origin + " with username: " + req.body.username
  );
  User.findOne({ username: req.body.username })
    .then(user => {
        if (!user || !user.isActive) {
            return res.status(401).json({
                message: "Auth failed"
            });
        } else if (!bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).json({
                message: "Auth failed"
            });
        } else {
            fetchedUser = user;
            const token = jwt.sign(
                {
                    username: fetchedUser.username,
                    email: fetchedUser.email,
                    userId: fetchedUser._id,
                    isAdmin: fetchedUser.isAdmin
                },
                config.jwtSecret,
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userData: {
                    id: fetchedUser._id,
                    username: fetchedUser.username,
                    email: fetchedUser.email
                }
            });
        }
    })
    .catch(err => {
		if (debug) console.log("Authentication failed: other error.");
		console.log(err);
      return res.status(500).json({
        message: "Auth failed: server error."
      });
    });
});

module.exports = router;