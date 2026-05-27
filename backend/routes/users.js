//Function to find all users in database
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require('../models/user.model')


// /api/users/list
router.get('/list', authMiddleware, async (req, res) => {//the login route waits for User.findOne(...) and returns a response only once, inside the try/catch
  try {
    const users = await User.find({}).select("-password");
    res.send({
        data: users,
        status: 'success',
        message: "Data retrieved"
    })
  } catch (error) {
    res.send({
        data: null,
        status: 'error',
        message: "Data error"
    })
  }
   
});
// async function getAllUsers(){
//     try{
//         const users = await User.find({}).select("-password");
//         console.log("Found users", users)
//         return users;
         
//         }catch(error){
//         console.error("Error finding users: ", error);
//     }

// }


module.exports = router;
