const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "chironess1",
  database: "tow_trucks",
});

module.exports = db;
