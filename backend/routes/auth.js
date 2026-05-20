//Login User
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const { generateToken } = require("../services/jwtService");
const authMiddleware = require("../middlewares/authMiddleware");

//LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
//the login route waits for User.findOne(...) and returns a response only once, inside the try/catch
  try {
    //Find user by email
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "User not found" });
    }
    //Compare provided password with hashed password in database using bcrypt.
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ message: "Invalid password" });
    }

    //If user exists and password matches, generate JWT using jwtService
    if (user && passwordMatch) {

      const token = generateToken({ id: user._id, username: user.username, role: user.role });
      
      console.log(username, password);
      console.log(req.body.username);
  
      return res.json({ message: "Login successful", username: user.username, role: user.role, token: token });
  }
    
  } catch (error) {
    console.error(error);
    return res.json({ message: "Error occurred while logging in" });
  }
});

// Protected profile route??????????????????????????????????????????????????????
// exports.profile = (req, res) => {
//   // req.user is set by auth middleware after token verification
//   res.json({
//     message: "Welcome to your profile!",
//     user: req.user,
//   });
// };



module.exports = router;

