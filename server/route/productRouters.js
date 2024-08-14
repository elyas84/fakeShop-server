const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// get products
router.route("/").get(productController.getProducts);
// new product
router
  .route("/new")
  .post(verifyToken, verifyAdmin, productController.newProject);
//update
router
  .route("/update/:id")
  .put(verifyToken, verifyAdmin, productController.updateProduct);
//get product
router.route("/product/:id").get(productController.getProduct);
//delete
router
  .route("/delete/:id")
  .delete(verifyToken, verifyAdmin, productController.deleteProduct);
// add c comment
router.route("/:id/comments").post(verifyToken, productController.newComment);

module.exports = router;
