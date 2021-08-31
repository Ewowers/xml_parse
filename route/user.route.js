const { Router } = require("express");
const control = require("../controller/user.control");
const router = Router();

router.post("/auth", control.auth);
router.post("/authToken", control.authToken);
router.post("/out", control.out);
router.post("/onload", control.onload);

module.exports = router;
