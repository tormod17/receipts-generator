const express = require('express');
const fs = require('fs');
const router = express.Router();
const User = require('../models/user');
const ReceiptDB = require('../models/receipts');

const jwt = require('jsonwebtoken');

const XLSX = require('xlsx');
const multer = require('multer'); // used for writing file before saving.
const uuidv1 = require('uuid/v1');
const path =require('path');

const JWT_SECRET = 'JWT Rocks!';

const expTime = 1 * 60 * 60 * 24 * 150;

function extractToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
}


exports.signUpHandler = (req,res) => {
  const { username, email, password, confirmPassword } = req.body;
  // confirm that user typed same password twice
  if (password !== confirmPassword) {
      const err = new Error('Passwords do not match.');
      err.status = 400;
      res.send('passwords dont match');
      return next(err);
  }
  const userData = {
      email,
      username,
      password
  };
  User.addUser(userData, function(err, newUser) {
      if (err) {
          return next(err);
      }
      if (!newUser) {
          const err = new Error('You have an account');
          err.status = 400;
          return next(err);
      }
      userData.id = newUser._id;
      const jwtToken = jwt.sign(userData, JWT_SECRET, { expiresIn: expTime  });
      return res.status(200).json({
          id_token: jwtToken
      });
  });
}


exports.loginHandler = (req,res) => {
  const credentials = req.body;
  const { email, password } = credentials;
  if (!email || !password) {
      return res.status(422).send({ error: 'You must provide email and password.' });
  }

  User.authenticate(email, password, function(err, user) {
      if (err || !user) {
          return res.status(401).send({ message: 'User Not Found' });
      }
      const profile = {
          username: user.username,
          email: user.email,
          id: user._id
      };
      const jwtToken = jwt.sign(profile, JWT_SECRET, { expiresIn: expTime  });
      return res.status(200).json({
          id_token: jwtToken
      });
  });
  
}

exports.logoutHandler = (req,res, next) => {
  const jwtToken = extractToken(req);
  if (!jwtToken) {
      return res.status(200).json({ message: `logged out` });
  } else {
      const { username } = jwt.verify(jwtToken, JWT_SECRET);
      return res.status(200).json({ message: `User ${username} logged out` });
  }
  console.log("jwt verify error", err);
  return res.status(500).json({ message: "Invalid jwt token" });  
}


exports.profile =(req, res) => {
  User.findById(req.query.userId)
      .exec(function(error, user) {
          if (error) {
              return next(error);
          } else {
              if (user === null) {
                  const err = new Error('Not authorized! Go back!');
                  err.status = 400;
                  return next(err);
              } else {
                  const profile = {
                      username: user.username,
                      email: user.email,
                      id: user._id
                  };
                  const jwtToken = jwt.sign(profile, JWT_SECRET, { expiresIn: expTime });
                  return res.status(200).json({
                      id_token: jwtToken
                  });
              }
          }
      });

}
