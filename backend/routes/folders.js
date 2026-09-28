
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Folder = require('../models/folder');

router.post('/create',authMiddleware, async (req, res) => {
    const {folderName, parent} = req.body;
    const { id: userId } = req.user;

    console.log("req.user:", req.user);
    console.log("folderName:", folderName);
    console.log("parent:", parent);

    try{
        const existingFolder = await Folder.findOne({ folderName, createdBy: userId });
        if (existingFolder){
            return res.send({
                data:null,
                status: 'error',
                message: 'Folder name already exists'
            })
        }

        const newFolder = new Folder({
            folderName,
            parent: parent || null,
            createdBy: userId
        });
        await newFolder.save();
        res.send({
            data: newFolder,
            status: 'success',
            message: 'Folder created successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            status: 'error',
            message: 'Error creating folder'
        });
    }
});


router.get(`/list`, authMiddleware, async (req, res) => {
    const { id: userId } = req.user;
    const folders = await Folder.find({createdBy: req.user.id});
    try{
    res.send({
        data: folders,
        status: 'success',
        message: 'Folders retrieved successfully'
    });
    }catch (error) {
        console.log(error);
        res.send({
            data:null,
            status:'error',
            message: "Error retrieving folders"
        })
    }
});


router.delete("/:id", async(req, res)=>{
  console.log("DELETE ROUTE CALLED");
  console.log("ID:", req.params.id);
  //backend ņem id no url, ko nosūta frontends no failu saraksta
  const {id} = req.params;

  try{
    const deleteFolder = await Folder.deleteOne({_id: id});
    // console.log("Delete result:", deleteFile);

    if (deleteFolder.deletedCount === 0) {
      return res.send({
        data: null,
        status: "error",
        message: "Folder not found"
      });
    }

    return res.send({
      data:null,
      status: "success",
      message: "Folder deleted"
    })
  }catch(err){
    console.log(err);

    return res.send({
      data:null,
      status: "error",
      message: "Folder deletion failed"
    });
  }
});

module.exports = router;