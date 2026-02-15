const router = require('express').Router();
const controller = require("../controllers/Stock.controller");

router.post("/", controller.create);
router.get("/", controller.getStock);

module.exports = router;