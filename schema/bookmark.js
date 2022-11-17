const mongoose = require("mongoose");

const bookmarksSchema = new mongoose.Schema({
  postId: {
    type: String,
  },
  nickName: {
    type: String,
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

module.exports = mongoose.model("bookmarks", bookmarksSchema);