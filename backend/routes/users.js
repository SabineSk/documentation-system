//Function to find all users in database
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require('../models/user.model');
const UserImg = require('../models/userImg');
const UserImages = require('../models/userImg');
const UserFilter = require('../models/filters');
const bcrypt = require('bcrypt');

// /api/users/list
router.get('/list', authMiddleware, async (req, res) => {//the login route waits for User.findOne(...) and returns a response only once, inside the try/catch
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;


    //Saņem filtlters '[{"field":"username","search":"sabine"}]', tāpēc parese pārveido par masīva objektu
    const username = req.query.username || "";
    const role = req.query.role || "";



    let query = {};

    if (username) {
      query.username = {
        $regex: username,
        $options: "i"
      };
    }

    if (role) {
      query.role = {
        $regex: role,
        $options: "i"
      };
    }


    // filters.forEach((filter) => {
    //   if (filter.field && filter.search) { //jābūt abām vērtībām, lai veidotu query
    //     query[filter.field] = { //meklēt pēc fitltra
    //       $regex: filter.search, //a sequence of characters that forms a search pattern
    //       $options: 'i'  // I : ignore case sensitivity
    //     };
    //   }
    // });

    
    console.log("MongoDB query:", query);
    
    const totalCount= await User.countDocuments(query); 

    // For page 1: skip = (1–1) * 10 = 0 (show first 10 items)
    // For page 2: skip = (2–1) * 10 = 10 (skip first 10, show next 10)
    // For page 3: skip = (3–1) * 10 = 20 (skip first 20, show next 10)
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    res.send({
        data: { users, page, limit, totalCount, totalPages},
        status: 'success',
        message: "Data retrieved"
    });
  } catch (error) {
    console.log(error)
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
  const { id } = req.user;      //Jo frontend izmanto credentials:"include" jeb nosūta autentifikācijas cookie un auth midleware ievieto req.user = {id: "123456", username: "otto",role: "admin"};
  
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

router.post('/addFilter', authMiddleware, async(req, res) =>{



  const {newFilter, newFilterName} = req.body;  // Var arī šādi: const newFilter = req.body.newFilter; const newFilterName = req.body.newFilterName;
  const {id} = req.user;       

      //No frontend saņemto JSON express apstrādājot, iegūst:
      //   req.body = {
      //   newFilterName: "Administratori",
      //   newFilter: {
      //     username: "Otto",
      //     role: "admin"
      //   }
      // };

  console.log("Body:", req.body);
  console.log("newFilterName:", newFilterName);
  console.log("newFilter:", newFilter);

  try{
    const userFilter = new UserFilter(
      {
        user: id,
        name: newFilterName,
        filters: newFilter
      }
    )
    await userFilter.save();

    res.send({
      data:null,
      status: 'success',
      message: 'Filter saved'
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


router.get('/listFilters', authMiddleware, async(req, res) => {
  const { id } = req.user;

  try{
    //Atrast visus userFilter dokumentus, kur user lauks ir vienāds ar pašreizējā lietotāja id
    const userFilter = await UserFilter.find({user: id}); //user ir lauka nosaukums UserFilter MongoDB modelī.

        res.send({
          data: userFilter,
          status: 'success',
          message: "Filter data retrieved"
        });      
    }catch(error){
      console.log(error);        
      res.send({
          data: null,
          status: 'error',
          message: "Saved filters could not be retrieved"
        });
    };
  });

//Create new user
router.post('/addUser', authMiddleware, async (req, res) => {
  const {newUsername, newPassword, newPasswordConfirm, newRole} = req.body;
    
  if (req.user.role !== "admin") {
    return res.status(403).send({
        data: null,
        status: "error",
        message: "Access denied"
    });}  
  
  
  if (newPassword !== newPasswordConfirm) {
    return res.send({
      data:null,
      status: 'error',
      message: "Passwords don't match"
    });
  }
  
  try{
    const existingUser = await User.findOne({username: newUsername});

    if (existingUser){
      console.log("JAU EKSISTĒ LIETOTĀJS AR TĀDU USERNAME")
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
    });
  }catch (err) {
    console.log(err);
  }
});


//FOR USER EDIT FIND ONE USER BY ID
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params; 
  try{
    const existingUser = await User.findOne({_id: id}).select("-password");
    if(!existingUser){
      return res.send({
        data: null,
        status: "error",
        message: "User not found"
      });
    }
    return res.send({
      data: existingUser,
      status: "success"
    });

  }catch(err){
    console.log(err);
    return res.send({
      data: null,
      status: "error"
    });
  }
}
);

//FOR USER EDIT update ONE USER BY ID
router.patch("/:id", authMiddleware, async (req, res) => {
  console.log("PATCH HIT");
  //edit user 
  const { id } = req.params; 
  const { editUsername, editPassword, editPasswordConfirm, editRole } = req.body;
  const updateData = {};

  //ja nav tukšs, to ieliek updateData objektā
  if (editUsername) updateData.username = editUsername;
  if (editRole) updateData.role = editRole;

  if (req.user.role !== "admin") {
  return res.status(403).send({
      data: null,
      status: "error",
      message: "Access denied"
  });}  
  
  if (editPassword){
  if (editPassword !== editPasswordConfirm) {
    return res.send({
      data:null,
      status: 'error',
      message: "Passwords don't match"
    });
  }
  updateData.password = await bcrypt.hash(editPassword, 10);

}
  const updatedUser = await User.findByIdAndUpdate(
    id, updateData, { new: true }).select("-password");
  return res.send({
    data: updatedUser,
    status: "success",
    message: "User updated"
  });
})


router.delete("/:id", async(req, res) =>{
  //backend ņem id no url, ko nosūta userTable frontends
  const { id } = req.params; 

  try{
    const deleteUser = await User.deleteOne({_id: id});
    return res.send({
      data:null,
      status: "success",
      message: "User deleted"
    })

    }catch(err){
      console.log(err);
      return res.send({
        data:null,
        staus: "error",
        message: "User can't be deleted"
    });
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

