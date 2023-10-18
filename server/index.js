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
// Insert New Section Start //
app.post("/api/insection", (req, res) => {
  const sname = req.body.sname;
  const sqlInsert = "INSERT INTO section_list (sname) values (?)";
  db.query(sqlInsert, [sname], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send("Request failed, error inserting data into database.");
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
