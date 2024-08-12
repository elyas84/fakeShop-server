const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const userInput = require("../middleware/userInputValidator");

// register
router.route("/new").post(authController.newUser);
// email confirmation
router
  .route("/confirm/:token")
  .get(authController.getEmailConfirmation);

module.exports = router;
