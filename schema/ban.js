const mongoose = require("mongoose");

const banSchema = new mongoose.Schema({
  room : {
    type : String,
  },
  banUser : {
    type : String,
  },
  createdAt: { 
    type: Date,
    default : Date.now
  }
});

module.exports = mongoose.model("Ban", banSchema);