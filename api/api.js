const { Router } = require("express");
const Debug = require("../model/console.model");
const user = require("../route/user.route");
const notif = require("../route/notif.route");
const first = require("../route/first.route");
const request = require("../route/request.route");
const router = Router();
router.use("/user", user);
router.use("/notif", notif);
router.use("/first", first);
router.use("/request", request);
router.use("/debug", async (req, res) => {
  const debug = await Debug.find();
  res.json(debug);
});
module.exports = router;
