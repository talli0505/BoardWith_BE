const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  commentId: {
    type: Number,
    unique: true
  },
  postId: {
    type: String,
    unique: true
  },
  userId: {
    type: String,
    unique: true
  },
  nickname: {
    type: String,
    unique : true
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