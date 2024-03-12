const express = require("express");
const router = express.Router();
const {
  getTrucks,
  addTruck,
  updateTruck,
} = require("../controllers/trucks.controller");

router.get("/", getTrucks);
router.post("/", addTruck);
router.put("/", updateTruck);

module.exports = router;
