const db = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getCustomers = (req, res) => {
  const q = "SELECT id, username,  phone FROM customers";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};

const getCustomer = (req, res) => {
  const q = "SELECT id, username,  phone FROM customers WHERE id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};

const registerCustomer = (req, res) => {
  const q = "SELECT * FROM customers WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) return res.status(409).json("Customer already exists");
    const q = "INSERT INTO customers (username, password, phone) VALUES (?)";
    const salt = bcrypt.genSaltSync(10);
    const hasedPassword = bcrypt.hashSync(req.body.password, salt);
    const values = [req.body.username, hasedPassword, req.body.phone];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Customer has been created");
    });
  });
};

const loginCustomer = (req, res) => {
  const q = "SELECT * FROM customers WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Customer not found");
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

const logoutCustomer = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("logout");
};

const updateCustomer = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const userId = req.params.id;
    if (userInfo.role === "admin" || userInfo.id === userId) {
      const q = "UPDATE customers SET username = ?, phone = ? WHERE id = ?";
      db.query(q, [req.body.username, req.body.phone, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("customer has been updated");
      });
    }
  });
};

const deleteCustomer = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const userId = req.params.id;
    if (userInfo.role === "admin" || userInfo.id === userId) {
      const q = "DELETE FROM customers WHERE id = ?";
      db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Customer has been deleted");
      });
    }
  });
};

module.exports = {
  getCustomers,
  getCustomer,
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  updateCustomer,
  deleteCustomer,
};
