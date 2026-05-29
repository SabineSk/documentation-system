const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserImg = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    image: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const UserImages = mongoose.model("userImages", UserImg);


module.exports = UserImages;