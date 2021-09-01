const jwt = require("jsonwebtoken");
const config = require("config");
const Users = require("../model/user.model");
module.exports = (req, res, next) => {
  const list = "/api/user";
  let { id } = req.cookies;
  try {
    if (id) token = jwt.verify(token, "JWT");
    if (req.url !== "/" && !id && req.url.indexOf(list)) {
      return res.redirect("/");
    }
    return next();
  } catch (e) {
    console.log(e);
    if (req.url !== "/" && req.url.indexOf(list)) {
      return res.redirect("/");
    }
    return next();
  }
};
