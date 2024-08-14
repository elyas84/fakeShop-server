const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const userRegisterInput = require("../middleware/registerInputValidator");
const userLoginInput = require("../middleware/registerInputValidator");

// register
router.route("/new").post(userRegisterInput, authController.newUser);
// email confirmation
router.route("/confirm/:token").get(authController.getEmailConfirmation);

// login
router.route("/login").post(userLoginInput, authController.login);
// logout
router.route("/logout").post(authController.logout);

module.exports = router;
