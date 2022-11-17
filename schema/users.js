const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  img : {
    type : String,
    default : "https://cdn.pixabay.com/photo/2017/09/24/23/38/cat-2783601__340.jpg"
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
    type: String,
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
