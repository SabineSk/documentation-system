const File = require("../models/file");
const authMiddleware = require("../middlewares/authMiddleware");

const express = require('express');
// const upload = require('../upload');

const multer = require("multer");

const router = express.Router();
//MULTER konfigurācija
//Next, define the storage configuration for uploaded files using **multer.diskStorage()**. This configuration determines where the uploaded files will be stored on the server. It takes an object with two functions: **destination** and **filename**.
//The filename function determines the name of the uploaded file. In this example, we use **Date.now()** to generate a unique timestamp for each uploaded file, which helps prevent filename clashes. 
//We append the original name of the file using **file.originalname** to maintain some context about the uploaded file. You can modify this function to generate filenames based on your specific needs.

//multer.diskStorage changing to memoryStorage so that files can be saved in buffer and then saved to database instead of saving to disk.
// const storage = multer.diskStorage({ 
//   destination: (req, file, cb) => { //cb is a callback funcition whom we pass the destination folder for uploaded files
//     cb(null, 'uploads/'); //null means that there is no error; second argument is the destination folder for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); //Date now is added to the name for uniqueness
//   }
// });

const storage = multer.memoryStorage();


//After setting up the storage configuration, you create an instance of Multer by calling **multer({ storage })**, passing in the **storage** configuration object. This creates the Multer middleware that you can use in your Express application to handle file uploads.

//TODO: add limits
const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB limit

};

const uploadWithLimits = multer({ storage: storage, limits });

// const upload = multer({
//   dest: "uploads/"
// });

// Set up a route for file uploads
router.post('/upload',authMiddleware, uploadWithLimits.single('file'), async (req, res) => { //Full address POST /api/files/upload
  // Handle the uploaded file
const { id: userId } = req.user;

    if (!req.file){
        return res.status(400).send({
        data: null,
        status: "error",
        message: "Fails nav izvēlēts"
        });
    }

    try{
          console.log(req.file);
    
    const newFile = new File({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: userId,
      data: req.file.buffer // Store the file data in the database

    });

    await newFile.save();

    return res.send({
        data: {
          id: newFile._id,
          originalName: newFile.originalName,
          mimeType: newFile.mimeType,
          size: newFile.size
        },
        status: "success",
        message: "Fails veiksmīgi augšupielādēts"
    });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        return res.send({
            data: null,
            status: "error",
            message: "Kļūda augšupielādējot failu"
        });
    }

});

router.get('/list', authMiddleware, async (req, res) => { //Full address GET /api/files/list
 const files = await File.find({uploadedBy: req.user.id});
  try{
  res.send({
    data: files,
    status: 'success',
    message: 'Files retrieved successfully'
  });
 }catch(error){
    console.log(error);
    res.send({
      data:null,
      status: 'error',
      message: "Data error"
    });
  }

});

router.delete("/:id", async(req, res)=>{
  console.log("DELETE ROUTE CALLED");
  console.log("ID:", req.params.id);
  //backend ņem id no url, ko nosūta frontends no failu saraksta
  const {id} = req.params;

  try{
    const deleteFile = await File.deleteOne({_id: id});
    // console.log("Delete result:", deleteFile);

    if (deleteFile.deletedCount === 0) {
      return res.send({
        data: null,
        status: "error",
        message: "File not found"
      });
    }

    return res.send({
      data:null,
      status: "success",
      message: "File deleted"
    })
  }catch(err){
    console.log(err);

    return res.send({
      data:null,
      status: "error",
      message: "File deletion failed"
    });
  }
});

router.get("/view/:id", async (req, res) =>{
  console.log("View ROUTE CALLED");
  console.log("ID:", req.params.id);
  //backend ņem id no url, ko nosūta frontends no failu saraksta
  const {id} = req.params;
  try{
    const file = await File.findById({_id: id});
    if(!file){
      return res.send.status(404).json({message: "File not found"});
    }
    res.setHeader("Content-type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.originalName}"`
    );

    res.send(file.data);
  }catch (err) {
  console.error("View file error:", err);
  res.status(500).json({ message: "Could not open file" });
}
});


router.get("/download/:id", async (req, res) =>{
  const {id} = req.params;
  try{
    const file = await File.findById({_id: id});
    if(!file){
      return res.send.status(404).json({message: "File not found"});
    }
    res.setHeader("Content-type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );

    res.send(file.data);
  }catch (err) {
  console.error("View file error:", err);
  res.status(500).json({ message: "Could not download file" });
}
});

//"Starred" funkctionality.
router.patch("/:fileID", authMiddleware, async (req, res) =>{
  //editing file metadata (starred)
  const {fileID} = req.params;
  const {editStarred} = req.body;
  const {editLocation} = req.body;
  const updateData = {};
  if (editStarred !== undefined) updateData.starred = editStarred;
  if (editLocation !== undefined) updateData.folder = editLocation;

  const updatedFile = await File.findByIdAndUpdate(fileID, updateData, {new: true});
  return res.send({
    data: updatedFile,
    status: "success",
    message: "File updated"
  });
  
})





module.exports = router;