const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const config = require("config");
const load = require("./helper/load.helper");
const app = express();
require("body-parser-xml")(bodyParser);
app.use(cookieParser());
app.use(bodyParser.xml());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("client"));
app.use(load);
app.get("/", (req, res) => {
  res.sendFile("/index.html");
});
app.get("/log", (req, res) => {
  res.sendFile(__dirname + "/client/log.html");
});
app.use("/api", require("./api/api"));
const start = async () => {
  try {
    await mongoose.connect(config.get("mongo"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const port = process.env.APP || 8001;
    app.listen(port, () => console.log("run"));
  } catch (e) {
    console.log(e);
  }
};
start();
