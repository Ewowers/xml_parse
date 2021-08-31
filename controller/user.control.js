const User = require("../model/user.model");
const Log = require("../model/console.model");
const config = require("config");
const jwt = require("jsonwebtoken");
const Ip = require("ip");
const sing = (id) => {
  console.log(id || false);
  let key = require("config").get("jwt");
  let token = jwt.sign({ id: id }, key, { expiresIn: "168h" });
  return token;
};
const log = (event, user, ip, method) => {
  let obj = {
    event,
    user,
    ip,
    method,
    date: new Date(),
  };
  new Log(obj).save();
};
class Control {
  async verify(token) {
    console.log(token);
    try {
      let { id } = await jwt.verify(token, config.get("jwt"));
      const user = await User.findById(id);
      return user;
    } catch (e) {
      log(`Проверка токена: ${e}`, "no auth", Ip.address(), "POST");
    }
  }
  async auth(req, res) {
    //авторизация по логину и поролю
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ name: username });
      if (!user) {
        log("Авторизация: Не верный логин", "no auth", Ip.address(), "POST");
        return res.json({ message: "Не верный логин" });
      }
      if (password !== user.password) {
        log("Авторизация: Не верный пороль", user.name, Ip.address(), "POST");
        return res.json({ message: "Не верный пороль" });
      }
      log("Авторизация: Пользователь авторизовался", user.name, Ip.address(), "POST");
      return res.cookie("id", sing(user._id)).json({ status: true });
    } catch (e) {
      log("Error: " + e, "no user", Ip.address(), "POST");
    }
  }
  async authToken(req, res) {
    //авторизация по ЭЦП ключу
    try {
      const { token } = req.body;
      const user = await User.findOne({ ket: token });
      if (!token) {
        log("Авторизация: Не верный ЭЦП", "no auth", Ip.address(), "POST");
        return res.json({ message: "токен не верный" });
      }
      log("Авторизация: Пользователь аворизовался по ЭЦП", "token", Ip.address(), "POST");
      return res.cookie("id", sing(user._id)).json({ status: true });
    } catch (e) {
      log("Error: " + e, "no user", Ip.address(), "POST");
    }
  }
  out(req, res) {
    try {
      log("Авторизация: Пользователь вышел из аккаунта", "no auth", Ip.address(), "POST");
      return res.clearCookie("id").send(true);
    } catch (e) {
      log("Error: " + e, "no user", Ip.address(), "POST");
    }
  }
  async onload(req, res) {
    try {
      const admin = await User.findOne({ user: "admin" });
      if (!admin) {
        new User({
          name: "admin",
          password: "admin",
        }).save();
      }
      const { id } = req.cookies;
      let user;
      if (!id) return res.send(false);
      try {
        const token = jwt.verify(id, require("config").get("jwt"));
        if (!token) return res.send(false);
        user = await User.findById(token.id);
      } catch (e) {
        console.log(e);
      }
      log("Авторизация: Пользователь зашел", user.name, Ip.address(), "POST");
      return res.send(true);
    } catch (e) {
      log("Error: " + e, "no user", Ip.address(), "POST");
    }
  }
}
module.exports = new Control();
