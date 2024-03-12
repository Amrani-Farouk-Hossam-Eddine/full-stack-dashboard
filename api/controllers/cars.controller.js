const db = require("../connect");
const jwt = require("jsonwebtoken");

const getCar = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q = "SELECT * FROM cars WHERE ownerId = ?";
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(data);
    });
  });
};

const addCar = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "INSERT INTO cars (ownerId, license_plate_number, model) VALUES (?)";
    if (userInfo.role !== "user")
      return res.status(403).json("Only users can create a truck");
    const values = [userInfo.id, req.body.license_plate_number, req.body.model];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("car has been created");
    });
  });
};

const updateCar = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "UPDATE cars SET license_plate_number = ?, model = ? WHERE ownerId = ?";
    if (userInfo.role !== "user")
      return res.status(403).json("Only users can create a truck");
    db.query(
      q,
      [req.body.license_plate_number, req.body.model, userInfo.id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("car has been updated");
      }
    );
  });
};

module.exports = { getCar, addCar, updateCar };
