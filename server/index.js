const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql2 = require("mysql2");

const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "01.God_is_Able",
  database: "thesis2_db",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Login into user account start //
app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sqlSelect =
    "SELECT * FROM user_account WHERE username = ? AND password = ?";
  db.query(sqlSelect, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error during login");
    } else {
      if (result.length > 0) {
        res.status(200).send("Login successful");
      } else {
        res.status(401).send("Invalid credentials");
      }
    }
  });
});
// Login into user account start //

// Insert New User Account Start //

app.post("/api/insert", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const sqlInsert =
    "INSERT INTO user_account (username, password) VALUES (?,?)";
  db.query(sqlInsert, [username, password], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send("Request failed, error inserting data into database.");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Data inserted successfully");
    }
  });
});
// Insert New User Account End //

app.listen(3001, () => {
  console.log("Server is running on Port 3001");
});
