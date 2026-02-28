const router = require("express").Router();
const controller = require("../controllers/Article.controller");

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.get('/boutique/:id_boutique', controller.findByBoutique);

module.exports = router;