

const express = require('express');
// const upload = require('../upload');

const multer = require("multer");

const router = express.Router();
//MULTER konfigurācija
//Next, define the storage configuration for uploaded files using **multer.diskStorage()**. This configuration determines where the uploaded files will be stored on the server. It takes an object with two functions: **destination** and **filename**.
//The filename function determines the name of the uploaded file. In this example, we use **Date.now()** to generate a unique timestamp for each uploaded file, which helps prevent filename clashes. 
//We append the original name of the file using **file.originalname** to maintain some context about the uploaded file. You can modify this function to generate filenames based on your specific needs.
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { //cb is a callback funcition whom we pass the destination folder for uploaded files
    cb(null, 'uploads/'); //null means that there is no error; second argument is the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); //Date now is added to the name for uniqueness
  }
});

//After setting up the storage configuration, you create an instance of Multer by calling **multer({ storage })**, passing in the **storage** configuration object. This creates the Multer middleware that you can use in your Express application to handle file uploads.
const upload = multer({ storage: storage });


// const upload = multer({
//   dest: "uploads/"
// });

// Set up a route for file uploads
router.post('/upload', upload.single('file'), (req, res) => { //Full address POST /api/files/upload
  // Handle the uploaded file
    if (!req.file){
        return res.status(400).send({
        data: null,
        status: "error",
        message: "Fails nav izvēlēts"
        });
    }
    return res.send({
        data: req.file,
        status: "success",
        message: "Fails veiksmīgi augšupielādēts"
    });
});


module.exports = router;