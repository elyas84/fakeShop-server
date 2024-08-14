const { check } = require("express-validator");
const userLoginInput = [
  check("username", "username cannnot be empty").not().isEmpty().bail(),
  check(
    "password",
    "password must be more then 5 chars or is required"
  ).isLength({ min: 5, max: 80 }),
];

module.exports = userLoginInput;
