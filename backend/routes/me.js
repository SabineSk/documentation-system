//Login User
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const { generateToken } = require("../services/jwtService");
const authMiddleware = require("../middlewares/authMiddleware");
const UserToken = require("../models/user.token");


//LOGIN ROUTE
router.get('/me', authMiddleware, async (req, res) => {//the login route waits for User.findOne(...) and returns a response only once, inside the try/catch
  try {
    res.send({ message: "User info retrieved successfully", user: req.user, status: 'success' });
  } catch (error) {

  }
   
});


module.exports = router;

