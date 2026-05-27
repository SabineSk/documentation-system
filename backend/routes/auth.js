//Login User
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const { generateToken } = require("../services/jwtService");
const authMiddleware = require("../middlewares/authMiddleware");
const UserToken = require("../models/user.token");


//LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
//the login route waits for User.findOne(...) and returns a response only once, inside the try/catch
  try {
    //Find user by email
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "User not found", status: "error" });
    }
    //Compare provided password with hashed password in database using bcrypt.
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ message: "Invalid password", status: "error" });
    }

    //If user exists and password matches, generate JWT using jwtService
    if (user && passwordMatch) {
        //If user already has a token, delete it and generate new on
        
    await UserToken.deleteMany({ user: user._id });

    const token = await generateToken({ id: user._id, username: user.username, role: user.role });
    const dbToken = new UserToken({ user: user._id, token });
    await dbToken.save();

      console.log(username, password);
      console.log(req.body.username);
       
      //Name, tas, kas middleware var jāizpilda pirms galvenā route handler, šajā gadījumā tas ir authMiddleware, kas pārbauda JWT derīgumu un pievieno lietotāja informāciju pieprasījuma objektam (req.user). Ja token nav derīgs, middleware atbild ar 401 statusu un neļauj piekļūt aizsargātajām maršrutēm.
      //httpOnly: true nodrošina, ka token nevar piekļūt no JavaScript, kas palielina drošību pret uzbrukumiem.
      res.cookie("token", token, { httpOnly: true });


      return res.json({ message: "Login successful", status: "success", username: user.username, role: user.role});
  }
    
  } catch (error) {
    console.error(error);
    return res.json({ message: "Error occurred while logging in" });
  }
});

//routeris lai izlogotos
router.post('/logout', async(req,res) => {
  res.clearCookie('token');
  res.json({
    message: "Logout successful",
    status: "success"
  })
});


// izveidot jaunu route .get(/check)
router.get('/check', authMiddleware, async(req, res) => {
  try{
    res.send({user: req.user, status: 'success' }); 
  }catch(error){
    console.error(error);
  }
});

module.exports = router;

