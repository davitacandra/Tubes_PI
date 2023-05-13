const mysql = require("mysql2");

const db_connection = mysql
  .createConnection({
    host: "localhost", // HOST NAME
    user: "root", // USER NAME
    database: "db_pi", // DATABASE NAME
    password: "", // DATABASE PASSWORD
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

const dbPromise = db_connection.promise();