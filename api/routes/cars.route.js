const express = require("express");
const router = express.Router();
const { getCar, addCar, updateCar } = require("../controllers/cars.controller");

router.get("/", getCar);
router.post("/", addCar);
router.put("/", updateCar);

module.exports = router;
