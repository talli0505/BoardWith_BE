const mongoose = require("mongoose");
const Schema = mongoose.Schema

const CommentsSchema = new mongoose.Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Posts',
    required: true,
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