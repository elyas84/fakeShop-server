const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.route("/").get(verifyToken, verifyAdmin, orderController.getOrders);
router.route("/myorders").get(verifyToken, orderController.getMyOrders);
router.route("/:id").get(verifyToken, orderController.getOrder);
router.route("/new").post(verifyToken, orderController.newOrder);
router.route("/paid/:id").put(verifyToken, orderController.updateOrderToPaid);
router.route("/delivered/:id").put(orderController.updateOrderToDelivered); // open however protected in frontend
router
  .route("/delete/:id")
  .delete(verifyToken, verifyAdmin, orderController.deleteOrder);

module.exports = router;
