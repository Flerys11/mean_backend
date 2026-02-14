const router = require("express").Router();
const auth = require("../middlewares/auth.middlewares");
const controller = require("../controllers/Utilisateur.controller");

router.use(auth);

router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
