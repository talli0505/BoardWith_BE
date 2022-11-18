const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  postId: {
    type: String,
  },
  userId: {
    type: String,
  },
  nickName: {
    type: String,
  },
  birth: {
    type: String,
  },
  gender: {
    type: String,
  },
  myPlace: {
    type: Array,
  },
  comment: {
    type: String
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

module.exports = mongoose.model("Comments", CommentsSchema);