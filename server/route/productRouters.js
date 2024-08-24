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
router.route("/:id/reviews").post(verifyToken, productController.createReivew);
router
  .route("/:id/delete/review")
  .delete(verifyToken, verifyAdmin, productController.deleteAReview);

router.route("/categories").get(productController.getProductByCategory);
router.route("/rating").get(productController.getProductByRating);
router.route("/search").get(productController.getProductsBySearchKeywords);
router.route("/prices").get(productController.getProductsByPriceRange);
router
  .route("/categories/prices")
  .get(productController.getProductByCategoryAndPriceRange);
router
  .route("/categories/rating")
  .get(productController.getProductByCategoryAndRatio);

module.exports = router;
