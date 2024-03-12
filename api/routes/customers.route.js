const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customers.controller");

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/logout", logoutCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
