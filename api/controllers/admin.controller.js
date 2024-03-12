const db = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerAdmin = (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const q = "INSERT INTO admins (username, password) VALUES (?, ?)";
  db.query(q, [username, hashedPassword], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json("Admin has been registered successfully");
  });
};

const loginAdmin = (req, res) => {
  const { username, password } = req.body;
  const q = "SELECT * FROM admins WHERE username = ?";
  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Admin not found");
    const verify = bcrypt.compareSync(password, data[0].password);
    if (!verify) return res.status(400).json("Wrong username or password");
    const token = jwt.sign(
      { id: data[0].id, role: "admin" },
      process.env.SECRET_KEY
    );
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(data[0].username);
  });
};

const logoutAdmin = () => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("logout");
};

module.exports = { registerAdmin, loginAdmin, logoutAdmin };
