const router = require("express").Router();

const categoryRoutes = require("./category");
const productRoutes = require("./product");

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

module.exports = router;
