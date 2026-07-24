const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require('../models/user.model');
const UserFilter = require('../models/filters');

//Vajg authMiddleware, lai varētu nolasīt req.user
router.delete("/removeFilter/:filterId", authMiddleware, async(req, res) => {
  const { filterId } = req.params;
  const { id: userId } = req.user;

  try{
    //lietotāja id, lai lietotājs var dzēsttikai savus filtrus
    
    const deleteFilter = await UserFilter.deleteOne({
        _id: filterId,
        user: userId
      });
    return res.send({
      data:null,
      status: "success",
      message: "Filter deleted"
    })

    }catch(err){
      console.log(err);
      return res.send({
        data:null,
        status: "error",
        message: "Filter can't be deleted"
    });
  }
})

module.exports = router;