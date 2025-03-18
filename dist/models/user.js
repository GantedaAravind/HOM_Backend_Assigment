"use strict";

var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String
});
module.exports = mongoose.model("User", UserSchema);