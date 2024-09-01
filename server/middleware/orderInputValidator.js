const { check } = require("express-validator");
const orderInput = [
  check("firstname", "firstname cannnot be empty").not().isEmpty().bail(),
  check("lastname", "lastname cannnot be empty").not().isEmpty().bail(),
  check("email", "email cannnot be empty").not().isEmpty().isEmail().bail(),
  check("mobileNumber", "mobile Number cannnot be empty").not().isEmpty().bail(),
  check("address", "address cannnot be empty").not().isEmpty().bail(),
  check("city", "city cannnot be empty").not().isEmpty().bail(),
];

module.exports = orderInput;
