var mongoose = require("mongoose");
var passportLM = require("passport-local-mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String
}).plugin(passportLM));