const mysql = require("mysql2");

//const connection = mysql.createConnection({});

const pool = mysql.createPool({
  host: "localhost",
  user: "bobby",
  password: "Bobby12345$",
  database: "business_db",
});

module.exports = pool.promise();
