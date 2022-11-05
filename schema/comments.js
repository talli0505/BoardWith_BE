const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  postId: {
    type: String,
  },
  userId: {
    type: String,
  },
  nickname: {
    type: String,
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