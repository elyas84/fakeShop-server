const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.route("/").get(verifyToken, orderController.getOrderItems);
router.route("/myorders").get(verifyToken, orderController.getMyOrders);
router.route("/:id").get(verifyToken, orderController.getOrder);

router.route("/new").post(verifyToken, orderController.newOrder);
router.route("/paid/:id").put(verifyToken, orderController.updateORderToPaid);
router
  .route("/delivered/:id")
  .put(verifyToken, orderController.updateORderToDelivered);
router.route("/new").post(verifyToken, orderController.newOrder);
router
  .route("/delete/:id")
  .delete(verifyToken, verifyAdmin, orderController.deleteOrder);

module.exports = router;
