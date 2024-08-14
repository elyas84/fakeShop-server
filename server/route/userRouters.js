const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
// get user profile
router.route("/profile/:id").get(verifyToken, userController.userProfile);
// update user profile
router.route("/update/:id").put(verifyToken, userController.updateUser);
// get users
router.route("/").get(verifyToken, verifyAdmin, userController.getUsers)

// detele a user
router.route("/delete/:id").delete(verifyToken, userController.deleteUser);

module.exports = router;
