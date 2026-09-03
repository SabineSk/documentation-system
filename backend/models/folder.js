const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    folderName: {
      type: String,
      required: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

folderSchema.index({ folderName:1, createdBy:1 }, { unique: true });


module.exports = mongoose.model("Folder", folderSchema);