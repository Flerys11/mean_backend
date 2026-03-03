const router = require("express").Router();
const controller = require("../controllers/Commande.controller");
const auth = require("../middlewares/auth.middlewares");

router.use(auth);

router.post("/", controller.create);
router.get("/:id", controller.findPending);
router.put("/status/:id", controller.updateVersionToOne);
router.put("/annuler/:id", controller.cancel);
router.get("/stats/:type", controller.getStats);
router.get("/stats/:type/:id", controller.getStatsByArticle);

module.exports = router;