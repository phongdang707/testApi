const express = require("express");
const { User } = require("../../../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();

// host: localhost:5000/ xedike/ xedike.heroku.com/
// route:   GET   {host}/api/users
// desc:    get list of users
// access:  PUBLIC
module.exports.getUser = (req, res, next) => {
  console.log("get routers");
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.json(err));
};

// route:   POST  {host}/api/users
// desc:    create new user
// access:  PUBLIC
module.exports.createUser = (req, res, next) => {
  const { email, password, DOB, userType, phone } = req.body;
  // validation
  // hash password

  const newUser = new User({
    email,
    password,
    DOB,
    userType,
    phone
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.json(err);
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return res.json(err);
      newUser.password = hash;

      newUser
        .save()
        .then(user => {
          res.status(200).json(user);
        })
        .catch(err => res.json(err));
    });
  });
};
module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "id invalid" });
  User.findById(id)
    .then(user => {
      if (!user)
        return Promise.reject({ status: 404, message: "User not found" });
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(err.status).json({ message: err.message });
    });
};
module.exports.updateUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      if (!user)
        return Promise.reject({ status: 404, message: "User not found" });
      const { email, password, DOB, userType, phone } = req.body;
      user.email = email;
      user.password = password;
      user.DOB = DOB;
      user.userType = userType;
      user.phone = phone;

      return user.save();
    })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      if (!err.status) return res.json(err);
      res.status(err.status).json(err.message);
    });
};
module.exports.deleteUserById = (req, res, next) => {
  const { id } = req.params;
  User.deleteOne({ _id: id })
    .then(result => res.status(200).json(result))
    .catch(err => err.json(err));
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user)
        return Promise.reject({ status: 404, message: "User Not found" });
      bcrypt.compare(password, user.password, (err, isMath) => {
        if (!isMath) return res.status(400).json({ message: "Wrong password" });
        const payload = {
          email: user.email,
          userType: user.userType
        };
        jwt.sign(payload, "XEDIKE", { expiresIn: 3600 }, (err, token) => {
          if (err) res.json(err);
          res.status(200).json({
            success: true,
            token
          });
        });
      });
    })
    .catch(err => {
      if (err.status) return res.json(err);
      res.status(err.status);
    });
};
// export default router
