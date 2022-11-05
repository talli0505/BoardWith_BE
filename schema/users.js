const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  likePlace: {
    type: String,
  },
  birth: {
    type: String,
  },
  gender: {
    type: String,
  },
  likeGame: {
    type: String,
  },
  salt: {
    type: String,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Users", UsersSchema);
