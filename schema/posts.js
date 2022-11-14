const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  nickName: {
    type: String,
  },
  title: {
    type: String,
    index: true
  },
  content: {
    type: String
  },
  location: {
    type: Object, String,
  },
  cafe: {
    type: String
  },
  date: {
    type: String
  },
  time: {
    type : Array
  },
  map : {
    type : String
  },
  partyMember : {
    type : Number
  },
  participant : {
    type : Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {   //✨추가추가
    type: Date,
    default: Date.now,
    expires: 0
  },
});

module.exports = mongoose.model("Posts", PostsSchema);