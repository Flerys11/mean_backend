const router = require('express').Router();
const controller = require("../controllers/Stock.controller");
const auth = require("../middlewares/auth.middlewares");

// router.use(auth);

router.post("/", controller.create);
router.get("/", controller.getStock);
router.get("/:id", controller.getStockByIdBoutique);

module.exports = router;