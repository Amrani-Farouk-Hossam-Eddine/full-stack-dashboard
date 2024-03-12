const db = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getDrivers = (req, res) => {
  const q = "SELECT id, username, phone FROM drivers";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
};

const getDriver = (req, res) => {
  const q = "SELECT * FROM drivers WHERE id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    res.status(200).json(info);
  });
};

const registerDriver = (req, res) => {
  const q = "SELECT * FROM drivers WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) return res.status(409).json("Driver already exists");
    const q =
      "INSERT INTO drivers (username, password, phone, age, firstname, lastname, img, licensePlate) VALUES (?)";
    const salt = bcrypt.genSaltSync(10);
    const hasedPassword = bcrypt.hashSync(req.body.password, salt);
    const values = [
      req.body.username,
      hasedPassword,
      req.body.phone,
      req.body.age,
      req.body.firstname,
      req.body.lastname,
      req.body.img,
      req.body.licensePlate,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Driver has been created");
    });
  });
};

const loginDriver = (req, res) => {
  const q = "SELECT * FROM drivers WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Driver not found");
    const verify = bcrypt.compareSync(req.body.password, data[0].password);
    if (!verify) return res.status(400).json("Wrong username or password");
    const token = jwt.sign({ id: data[0].id }, process.env.SECRET_KEY);
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json("logged in");
  });
};

const logoutDriver = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("logout");
};

const updateDriver = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const userId = req.params.id;
    if (userInfo.role === "admin" || userInfo.id === userId) {
      const q =
        "UPDATE drivers SET username = ?, phone = ?, age = ?, firstname = ?, lastname = ?, licensePlate = ?, img = ? WHERE id = ?";
      db.query(
        q,
        [
          req.body.username,
          req.body.phone,
          req.body.age,
          req.body.firstname,
          req.body.lastname,
          req.body.licensePlate,
          req.body.img,
          userId,
        ],
        (err, data) => {
          if (err) return res.status(500).json(err);
          res.status(200).json("Driver has been updated");
        }
      );
    }
  });
};

const deleteDriver = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const userId = req.params.id;
    if (userInfo.role === "admin" || userInfo.id === userId) {
      const q = "DELETE FROM drivers WHERE id = ?";
      db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Driver has been deleted");
      });
    }
  });
};

module.exports = {
  getDrivers,
  getDriver,
  registerDriver,
  loginDriver,
  logoutDriver,
  updateDriver,
  deleteDriver,
};
