const { Schema, model } = require("mongoose");
const schema = new Schema({
  event: String,
  user: String,
  ip: String,
  method: String,
  date: Date,
});
module.exports = model("logs", schema);
