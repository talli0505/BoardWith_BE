const mongoose = require("mongoose");

const RoomsSchema = new mongoose.Schema({
  room : {
    type : String,
  },
  owner : {
    type : String,
  },
  member : {
    type : Array,
  },
  avatar : {
    type : Array,
  },
  createdAt: { 
    type: Date,
    default : Date.now
  },
  chat : {
    type : Object
  }
});

module.exports = mongoose.model("Room", RoomsSchema);;