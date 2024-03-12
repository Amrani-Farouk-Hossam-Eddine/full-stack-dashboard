const express = require("express");
const router = express.Router();
const {
  getDrivers,
  getDriver,
  registerDriver,
  loginDriver,
  logoutDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/drivers.controller");

router.get("/", getDrivers);
router.get("/:id", getDriver);
router.post("/register", registerDriver);
router.post("/login", loginDriver);
router.post("/logout", logoutDriver);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

module.exports = router;
