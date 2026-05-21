const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userToken = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    token: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const UserToken = mongoose.model("userToken", userToken);


module.exports = UserToken;