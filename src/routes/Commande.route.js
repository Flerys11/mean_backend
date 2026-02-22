const router = require("express").Router();
const controller = require("../controllers/Commande.controller");
const auth = require("../middlewares/auth.middlewares");

router.use(auth);

router.post("/", controller.create);
router.get("/stats/:type", controller.getStats);

module.exports = router;