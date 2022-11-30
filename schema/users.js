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
  phoneNumber : {
    type : String,
  },
  address: {
    type: String,
  },
  myPlace: {
    type: Array,
  },
  age: {
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
  userAvater : {
    type : Object,
    default : { Eye : 1, Hair : 1, Mouth : 1, Back : 1 }
  },
  point : {
    type : Number,
    default : 0
  },
  totalPoint : {
    type : Number,
    default : 0
  },
  refresh_token : {
    type : String,
  },
  admin : {
    type : String,
  },
  bookmark: {
    type: Array,
  },
  bookmarkData: {
    type: Array,
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
