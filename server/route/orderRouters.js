const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.route("/").get(verifyToken, orderController.getOrderItems);

router.route("/").get(verifyToken, orderController.getMyOrders);
router.route("/").get(verifyToken, orderController.getMyOrders);

router.route("/new").post(verifyToken, orderController.newOrder);
router.route("/paid").put(verifyToken, orderController.updateORderToPaid);
router
  .route("/delivered")
  .post(verifyToken, orderController.updateORderToDelivered);
router.route("/new").post(verifyToken, orderController.newOrder);
router
  .route("/delete/:id")
  .delete(verifyToken, verifyAdmin, orderController.deleteOrder);

module.exports = router;
