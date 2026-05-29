//Function to find all users in database
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require('../models/user.model');
const UserImg = require('../models/userImg');
const UserImages = require('../models/userImg');




// /api/users/list
router.get('/list', authMiddleware, async (req, res) => {//the login route waits for User.findOne(...) and returns a response only once, inside the try/catch
  try {
    const users = await User.find({}).select("-password");
    res.send({
        data: users,
        status: 'success',
        message: "Data retrieved"
    });
  } catch (error) {
    res.send({
        data: null,
        status: 'error',
        message: "Data error"
    });
  }
   
});

// get. Uses.id data vietā imag. Izmantojo find one
router.get('/profileImage', authMiddleware, async(req,res) => {
  const { id } = req.user;

  try{
    const userImage = await UserImages.findOne({user: id});

    if(userImage){
      res.send({
        data: userImage.image,
        status: 'success',
        message: "Data retrieved"
      });

    }else{
      res.send({
        data: null,
        status: 'error',
        message: "Data could not be retrieved"
      });
    }
    
  }catch(error){
    console.log(error);
  };
});



router.post('/addImg', authMiddleware, async (req, res) => {
  const { image } = req.body;
  const { id } = req.user;
  

  //Ja ir bilde -> izdzēš -> saglabā jaunu. | Ja nav bilde -> sagalabā . 


  try{
    
    // await UserImages.deleteMany({user: id});
    await UserImages.updateOne({ user: id }, { $set: { image: image}}, { upsert: true })
    //   const userImage = new UserImages(
    //   {
    //     user: id,
    //     image: image
    //   }
    // )
    
    // await userImage.save();

     res.send({
        data: null,
        status: 'success',
        message: "Data retrieved"
    });
  
  }catch(error){
    console.log(error);
    res.send({
      data:null,
      status: 'error',
      message: "Data error"
    });
  }
})


module.exports = router;













// router.post('/addImg', authMiddleware, async (req, res) => {
//   const { image } = req.body;
//   const { id } = req.user;
//   console.log(image);
//   try{


//     const userImage = new UserImages(
//       {
//         user: id,
//         image: image
//       }
//     )
    
//     await userImage.save();

//      res.send({
//         data: null,
//         status: 'success',
//         message: "Data retrieved"
//     });
//   }catch(error){
//     console.log(error);
//     res.send({
//       data:null,
//       status: 'error',
//       message: "Data error"
//     });
//   }
// })


// module.exports = router;
