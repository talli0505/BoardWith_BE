const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  nickname: {
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
    type : String
  },
  map : {
    type : String
  },
  partyMember : {
    type : Number
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

module.exports = mongoose.model("Posts", PostsSchema);