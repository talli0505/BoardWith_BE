const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  nickName: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  myPlace: {
    type: Array,
  },
  birth: {
    type: String,
  },
  gender: {
    type: String,
  },
  visible : {
    type : Boolean,
    default : true
  },
  likeGame: {
    type: Array,
  },
  introduce : {
    type : String,
  },
  refresh_token : {
    type : String,
  },
  admin : {
    type : String,
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
