const mongoose = require("mongoose");

const BookmarksSchema = new mongoose.Schema({
  nickName: {
    type: String,
  },
  postId: {
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

module.exports = mongoose.model("Bookmarks", BookmarksSchema);