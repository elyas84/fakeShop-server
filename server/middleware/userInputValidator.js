const { check } = require("express-validator");
const userInput = [
  check("email", "email cannnot be empty").not().isEmpty().isEmail().bail(),
  check("username", "username cannnot be empty").not().isEmpty().bail(),
  check(
    "password",
    "password must be more then 5 chars or is required"
  ).isLength({ min: 5, max: 80 }),
];

module.exports = userInput;
