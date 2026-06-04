//Function to find all users in database
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require('../models/user.model');
const UserImg = require('../models/userImg');
const UserImages = require('../models/userImg');
const bcrypt = require('bcrypt');
// const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' })


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

//Create new user
router.post('/addUser', authMiddleware, async (req, res) => {
  const {newUsername, newPassword, newPasswordConfirm, newRole} = req.body;
  if (newPassword !== newPasswordConfirm) {
    return res.send({
      data:null,
      status: 'error',
      message: "Passwords don't match"
    });
  }
  
  // if (req.user.role !== "admin") {
  //   return res.status(403).send({
  //       data: null,
  //       status: "error",
  //       message: "Access denied"
  //   });}


  try{
    const existingUser = await User.findOne({username: newUsername});
    if (existingUser){
      console.log("JAU EKSISTĒ USERIS AR TĀDU USERNAME")
      return res.send({
        data:null,
        status: 'error',
        message: "Username already taken"
      });
    }
     
    const user = new User({
      username: newUsername,
      password: newPassword,
      role: newRole,
    });

    let hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save()
    console.log("User created");
    return res.send({
      data:null,
      status: 'success',
      message: "User created"
    })
  }catch (err) {
    console.log(err);
  }
});

  


// express.json() neprot nolasīt failus. Faili nāk kā multipart/form-data, 
// tāpēc backendā parasti izmanto multer. 
// Multer ir Express middleware priekš multipart/form-data failu uploadiem.
// upload.single('file') paņem vienu failu no formas lauka, kura nosaukums ir file


// router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
//   res.send("Uploaded succesfully");

// });
//     try{
      


//     }catch(error){
//         console.log(error);
//         res.send({
//         data: null,
//         status: 'error',
//         message: "Data error"
//         });
//     };
// });

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
