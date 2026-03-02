const router = require("express").Router();
const controller = require("../controllers/Boutique.controller");
const auth = require("../middlewares/auth.middlewares");

router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.use(auth);

router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;