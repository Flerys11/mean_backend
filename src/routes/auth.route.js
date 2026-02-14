const router = require("express").Router();
const controller = require("../controllers/auth.controller");

router.post("/inscription", controller.register);
router.post("/login", controller.login);

module.exports = router;
