const express = require("express");
const router = express.Router();

const {
  getAllProductStatic,
  getAllProduct,
  createProduct,
} = require("../controllers/products");

//router.route("/").post(createProduct);
router.route("/").get(getAllProduct);
router.route("/static").get(getAllProductStatic);

module.exports = router;
