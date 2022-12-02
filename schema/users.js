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
  userAvatar : {
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
  loginCheck: {
    type: Boolean,
    default: true
  },
  tutorial : {
    type : Boolean,
    default : false,
  },
  rank : {
    type : Number,
  },
  createdAt: {
    type: String,
    default: Date.now
  },
  updatedAt: {
    type: String,
    default: Date.now
  },
  });

module.exports = mongoose.model("Users", UsersSchema);