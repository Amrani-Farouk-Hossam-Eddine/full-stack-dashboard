const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const authRoute = require("./routes/auth.route");
const adminsRoute = require("./routes/admin.route");
const trucksRoute = require("./routes/trucks.route");
const carsRoute = require("./routes/cars.route");
const customersRoute = require("./routes/customers.route");
const driversRoute = require("./routes/drivers.route");

dotenv.config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Dashboard/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/admins", adminsRoute);
app.use("/api/auth", authRoute);
app.use("/api/trucks", trucksRoute);
app.use("/api/cars", carsRoute);
app.use("/api/customers", customersRoute);
app.use("/api/drivers", driversRoute);

app.listen(8800, () => {
  console.log("API is working");
});
