const router = require("express").Router();
const controller = require("../controllers/Commande.controller");

router.post("/", controller.create);
router.get("/stats/:type", controller.getStats);

module.exports = router;