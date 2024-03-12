const db = require("../connect");
const jwt = require("jsonwebtoken");

const getTrucks = (req, res) => {
  const q = "SELECT * FROM tow_truck";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};

const addTruck = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "INSERT INTO tow_truck (driverId, license_plate_number, capacity) VALUES (?)";
    if (userInfo.role !== "driver")
      return res.status(403).json("Only drivers can create a truck");
    const values = [
      userInfo.id,
      req.body.license_plate_number,
      req.body.capacity,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("truck has been created");
    });
  });
};

const updateTruck = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "UPDATE tow_truck SET license_plate_number = ?, capacity = ? WHERE driverId = ?";
    db.query(
      q,
      [req.body.license_plate_number, req.body.capacity, userInfo.id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("truck has been created");
      }
    );
  });
};

module.exports = { getTrucks, addTruck, updateTruck };
