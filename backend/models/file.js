const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },


    /// mimeType — faila tips, piemēram, application/pdf;
    mimeType: { 
      type: String,
      required: true
    },

    size: {
      type: Number,
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    data: {
      type: Buffer,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("File", fileSchema);