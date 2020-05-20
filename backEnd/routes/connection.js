const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "traffic",
  password: "12345",
  database: "trafficDB",
  multipleSatements: true
});

mysqlConnection.connect(err => {
  if (!err) console.log("connected");
  else console.log(err);
});

module.exports = mysqlConnection;
