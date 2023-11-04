const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql2 = require("mysql2");
const jwt = require("jsonwebtoken");

const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "01.God_is_Able",
  database: "thesis2_db",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Login into user account start
app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sqlSelectUser =
    "SELECT UserID FROM user_account WHERE username = ? AND password = ?";

  db.query(sqlSelectUser, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error during login");
    } else {
      if (result.length > 0) {
        const user = result[0];
        const userID = user.UserID;
        const sectionID = user.sectionID;

        const token = jwt.sign(
          { userId: userID, sectionId: sectionID },
          "your-secret-key",
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          message: "Login successful",
          token: token,
        });
      } else {
        res.status(401).send("Invalid credentials");
      }
    }
  });
});

// In the /api/user-data route
app.get("/api/user-data", (req, res) => {
  const token = req.headers.authorization;
  console.log("Token in request headers:", token);

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    console.log("Decoded token:", decoded);
    const userID = decoded.userId;
    const sectionID = decoded.sectionId;

    const sqlSelect =
      "SELECT * FROM section_list WHERE UserID = ? AND sectionID = ?";

    db.query(sqlSelect, [userID, sectionID], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error during data retrieval");
      } else {
        res.status(200).json(result);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).send("Invalid token");
  }
});
// Login into user account end

// Insert New User Account Start //

function generateRandomAccountNumber() {
  const numbers = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomAccountNumber = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomAccountNumber += numbers.charAt(randomIndex);
  }

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomAccountNumber += letters.charAt(randomIndex);
  }

  randomAccountNumber = randomAccountNumber
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  return randomAccountNumber;
}

// Your existing route code
app.post("/api/insert", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const sqlInsert =
    "INSERT INTO user_account (UserID, username, password) VALUES (?,?,?)";

  // Generate a random account number (UserID) using the function
  const randomAccountNumber = generateRandomAccountNumber();

  // Continue with the rest of your code
  db.query(
    sqlInsert,
    [randomAccountNumber, username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send("Request failed, error inserting data into the database.");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Data inserted successfully");
      }
    }
  );
});
// Insert New User Account End //
// Insert New Section Start //
app.post("/api/insection", (req, res) => {
  const sname = req.body.sname;
  const userID = req.body.userID; // Extract the userID from the request body

  // Modify your SQL query to insert both section name and user ID into the database
  const sqlInsert = "INSERT INTO section_list (sname, UserID) VALUES (?, ?)";

  db.query(sqlInsert, [sname, userID], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send("Request failed, error inserting data into the database.");
    } else {
      console.log("Data inserted successfully.");
      res.status(200).send("Data inserted successfully.");
    }
  });
});
// Insert New Section END //
// Fetch Data to Table Start //
app.get("/api/sectionList", (req, res) => {
  const sqlSelect = "SELECT * FROM section_list";
  db.query(sqlSelect, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching section data");
    } else {
      res.status(200).json(results);
    }
  });
});
// Fetch Data to Table End //
// Update Data in Table Start //
app.put("/api/updateSName", (req, res) => {
  const sname = req.body.sname;
  const newSName = req.body.newSName;

  const sqlUpdate = "UPDATE section_list SET sname = ? WHERE sname = ?";

  console.log("SQL Query:", sqlUpdate);
  console.log("Parameters:", [newSName, sname]);

  db.query(sqlUpdate, [newSName, sname], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Request failed, error updating name in database.");
    } else {
      if (result.affectedRows > 0) {
        console.log("Name updated successfully.");
        res.status(200).send("Name updated successfully.");
      } else {
        res.status(404).send("Record not found");
      }
    }
  });
});
// Update Data in Table End //
// Delete Data in Table Start //
app.delete("/api/deleteSection/:sectionName", (req, res) => {
  const sectionName = req.params.sectionName;
  const sqlDelete = "DELETE FROM section_list WHERE sname = ?";

  db.query(sqlDelete, [sectionName], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Request failed, error deleting section.");
    } else {
      if (result.affectedRows > 0) {
        console.log("Section deleted successfully.");
        res.status(204).send();
      } else {
        res.status(404).send("Section not found");
      }
    }
  });
});
// Delete Data in Table End //
// Add New Student on List Start
app.post("/api/students", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const sectionID = req.body.sectionID;

  console.log("Received sectionID:", sectionID);

  const sqlInsertStudent =
    "INSERT INTO student_list (firstName, lastName, sectionID) VALUES (?, ?, ?)";

  console.log("SQL Query:", sqlInsertStudent);

  db.query(
    sqlInsertStudent,
    [firstName, lastName, sectionID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error inserting student data.");
      }

      console.log("Student added successfully."); // Log success
      return res.status(200).send("Student added successfully.");
    }
  );
});
// Add New Student on List End
// Update Student on List Start //
app.put("/api/studentData/:id", (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, sectionID } = req.body;

  const sqlUpdate =
    "UPDATE student_list SET firstName = ?, lastName = ?, sectionID = ? WHERE id = ?";

  console.log("SQL Query:", sqlUpdate);
  console.log("Parameters:", [firstName, lastName, sectionID, id]);

  db.query(sqlUpdate, [firstName, lastName, sectionID, id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send("Request failed, error updating record in the database.");
    } else {
      if (result.affectedRows > 0) {
        console.log("Record updated successfully.");
        res.status(200).send("Record updated successfully.");
      } else {
        res.status(404).send("Record not found");
      }
    }
  });
});
// Update Student on List End //
// Delete Student on List Start //
app.delete("/api/studentData/:id", (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM student_list WHERE id = ?";

  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Request failed, error deleting section.");
    } else {
      if (result.affectedRows > 0) {
        console.log("Student record deleted successfully.");
        res.status(200).send("Student record deleted successfully.");
      } else {
        res.status(404).send("Student record not found");
      }
    }
  });
});
// Delete Student on List End //
// Display Student Data to Table Start //
app.get("/api/studentList", (req, res) => {
  const sectionID = req.query.sectionID;
  const sqlSelect = "SELECT * FROM student_list WHERE sectionID = ?";

  db.query(sqlSelect, [sectionID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching student data");
    } else {
      res.status(200).json(results);
    }
  });
});
// Display Student Data to Table End //
// Fetching Database Stored Words Start //
app.get("/api/wordData", (req, res) => {
  const query = "SELECT word FROM words ORDER BY RAND() LIMIT 10";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from MySQL:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const words = results.map((row) => row.word);
      console.log("Word data retrieved:", words);
      res.json(words);
    }
  });
});
// Fetching Database Stored Words End //

app.listen(3001, () => {
  console.log("Server is running on Port 3001");
});
