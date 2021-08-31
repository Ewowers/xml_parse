const Notif = require("../model/notif.model");
const { verify } = require("./user.control");
const Log = require("../model/console.model");
const Ip = require("ip");
const config = require("config");
const pg = require("./pg.control");
const log = (event, user, ip, method) => {
  //функция для записи в логи
  let obj = {
    event,
    user,
    ip,
    method,
    date: new Date(),
  };
  new Log(obj).save();
};
class Controller {
  async get(req, res) {
    //get all type json
    try {
      const model = await Notif.find({});
      const { name } = await verify(req.cookies.id);
      log("Notif: получение notif", name, Ip.address(), "GET");
      return res.json(model);
    } catch (e) {
      //при ошибке занос в логи
      const { name } = await verify(req.cookies.id, config.get("jwt"));
      log("Notif: " + e.toString(), name || "error", Ip.address(), "GET");
      return res.send(e);
    }
  }
  async getId(req, res) {
    //get by id
    try {
      const { name } = await verify(req.cookies.id, config.get("jwt"));

      const { id } = req.params;
      const util = require("../utils/jsonToXml");
      let str = id.substr(id.length - 4, 4);
      if (str === ".xml") {
        str = id.slice(0, id.length - 4);
        const model = await Request.findById(str);
        console.log("str", str);
        console.log("model", model);
        const { token, sendMessage } = model;
        const { request } = sendMessage;
        const { messageInfo } = request;
        const jsonData = {
          // данные для json to xml
          token: token,
          messageId: messageInfo.messageId,
          correlationId: messageInfo.correlationId,
          serviceId: messageInfo.serviceId,
          messageType: messageInfo.messageType,
          messageDate: messageInfo.messageDate,
          senderId: messageInfo.sender.senderId,
          password: messageInfo.sender.password,
        };
        res.set("Content-Type", "text/xml");
        log("Notif: получение notif по id xml", name || error, Ip.address(), "GET");
        return res.send(util(jsonData));
      }
      log("Notif: получение notif по id json", name || error, Ip.address(), "GET");
      const model = await Model.findById(req.params.id);
      return res.json(model);
    } catch (e) {
      const { name } = await verify(req.cookies.id, config.get("jwt"));
      log("Notif: " + e.toString(), name || error, Ip.address(), "GET");
      return res.send(e);
    }
  }

  async getIds(req, res) {
    //get by id's
    try {
      let { ids } = req.params;
      ids = ids.split(",");
      let arr = [];
      for (let i = 0; i <= ids.length - 1; i++) {
        if (ids[i] === "") continue;
        const model = await Notif.findById(ids[i]);
        arr.push(model);
      }
      const { name } = await verify(req.cookies.id, config.get("jwt"));
      log("Notif: получение по id's", name || error, Ip.address(), "GET");
      return res.json(arr);
    } catch (e) {
      //при ошибке занос в логи
      log("Notif: " + e.toString(), null, Ip.address(), "GET");
      return res.send(e);
    }
  }
  async add(req, res) {
    //post add
    try {
      //разбор xml post
      const envelope = req.body["S:Envelope"];
      const body = envelope["S:Body"][0]["ns2:sendMessage"][0].request[0];
      const token = //токен
        envelope["SOAP-ENV:Header"][0]["wsse:Security"][0]["ds:Signature"][0]["ds:KeyInfo"][0][
          "wsse:SecurityTokenReference"
        ][0]["wsse:KeyIdentifier"][0]["_"];
      const { messageInfo, messageData } = body; //данные из body

      const model = new Notif({
        //создание модели mongoDB
        token: token,
        sendMessage: {
          request: {
            messageInfo: {
              messageId: messageInfo[0].messageId.toString(),
              correlationId: messageInfo[0].correlationId.toString(),
              serviceId: messageInfo[0].serviceId.toString(),
              messageType: messageInfo[0].messageType.toString(),
              messageDate: messageInfo[0].messageType.toString(),
              sender: {
                senderId: messageInfo[0].sender[0].senderId.toString(),
                password: messageInfo[0].sender[0].password.toString(),
              },
            },
            messageData: {
              data: messageData[0].data[0]["_"],
            },
          },
        },
      });

      await model.save(model); //сахранение
      pg.notif(model);
      try {
        const { name } = await verify(req.cookies.id, config.get("jwt"));
        log("Notif: создание notif", name || "error", Ip.address(), "GET");
      } catch (e) {
        console.log(e);
      }
      return res.json({ id: model._id });
    } catch (e) {
      //при ошибке занос в логи
      log("Notif: " + e.toString(), null, Ip.address(), "POST");
      return res.send(e);
    }
  }
  async save(model) {
    const notif = new Notif(model);
    await notif.save();
    pg.notif(model);
    return notif._id;
  }
}
module.exports = new Controller();
