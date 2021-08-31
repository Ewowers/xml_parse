const { Schema, model } = require("mongoose");
const schema = new Schema({
  name: {
    type: String,
    //login пользователя
  },
  password: {
    type: String,
    //пороль пользователя
  },
  key: {
    type: String,
    //ЭЦП пользователя
  },
});
module.exports = model("user", schema);
