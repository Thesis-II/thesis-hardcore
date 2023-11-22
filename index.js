const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql2 = require("mysql2");
const jwt = require("jsonwebtoken");

const secretKey =
  process.env.SECRET_KEY || "gV2$r9^uLpQw3ZtYxYzA#dG!kLmNp3s6v9y/B?E";

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
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const query =
    "SELECT * FROM user_account WHERE username = ? AND password = ?";

  db.query(query, [username, password], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (results.length === 1) {
      const user = results[0];
      const token = jwt.sign({ userId: user.UserID }, secretKey);
      return res
        .status(200)
        .json({ message: "Login successful", userId: user.UserID, token });
    } else {
      return res.status(401).json({ error: "Invalid username or password." });
    }
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  });
};

app.get("/api/getUserId", verifyToken, (req, res) => {
  const userId = req.userId;
  res.status(200).json({ userId });
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

app.post("/api/insert", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const sqlInsert =
    "INSERT INTO user_account (UserID, username, password) VALUES (?,?,?)";

  const randomAccountNumber = generateRandomAccountNumber();

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
  const userID = req.body.userID;

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
app.get("/api/sectionList", verifyToken, (req, res) => {
  const userId = req.userId;

  const sqlSelect = "SELECT * FROM section_list WHERE UserID = ?";
  db.query(sqlSelect, [userId], (err, results) => {
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

// UPDATE TOTAL SCORE START //
app.post("/api/updateTotalScore", (req, res) => {
  const { studentID, newScore } = req.body;
  console.log(
    "Received request to update total_score for student ID:",
    studentID
  );

  // Fetch the current total score for the student
  const sqlSelectTotalScore =
    "SELECT total_score FROM student_list WHERE id = ?";
  db.query(sqlSelectTotalScore, [studentID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching current total_score");
    } else {
      const currentTotalScore = results[0].total_score;
      const updatedTotalScore = currentTotalScore + newScore;

      // Update the total score in the database
      const sqlUpdate = "UPDATE student_list SET total_score = ? WHERE id = ?";
      db.query(
        sqlUpdate,
        [updatedTotalScore, studentID],
        (err, updateResults) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error updating total_score");
          } else {
            console.log("Total score updated successfully");
            res.status(200).send("Total score updated successfully");
          }
        }
      );
    }
  });
});
// UPDATE TOTAL SCORE END //

// FETCHING A SINGLE STUDENT START //
app.get("/api/student", (req, res) => {
  const studentID = req.query.studentID;
  console.log("Received studentID:", studentID);

  const sqlSelect =
    "SELECT id, firstName, lastName, total_score FROM student_list WHERE id = ?";

  db.query(sqlSelect, [studentID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching student data");
    } else {
      console.log("Query results:", results);

      const studentData = results[0];
      const enhancedStudentData = {
        ...studentData,
        studentID: studentData.id,
      };

      res.status(200).json(enhancedStudentData);
    }
  });
});
// FETCHING A SINGLE STUDENT END //

// Display Student Data to Table Start //
app.get("/api/studentList", (req, res) => {
  const sectionID = req.query.sectionID;
  console.log("Received sectionID:", sectionID);

  const sqlSelect = "SELECT * FROM student_list WHERE sectionID = ?";

  db.query(sqlSelect, [sectionID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching student data");
    } else {
      console.log("Query results:", results);
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

// FETCH ID AND TITLE FROM STORIES TABLE START //
app.get("/get-stories", (req, res) => {
  // Fetch all stories from the stories_table
  db.query("SELECT stories_id, title FROM stories_table", (err, results) => {
    if (err) {
      console.error("Error fetching stories:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", message: err.message });
    }

    res.status(200).json(results);
  });
});
// FETCH ID AND TITLE FROM STORIES TABLE END //

// ADD STORY AND WORDS TO DATABASE START //
app.post("/submit-story", (req, res) => {
  const { title, content, addedWords } = req.body;

  db.query(
    "INSERT INTO stories_table (title, content) VALUES (?, ?)",
    [title, content],
    (err, results) => {
      if (err) {
        console.error("Error inserting story:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const storyId = results.insertId;

      const proWords = addedWords.map((word) => [word, storyId]);
      db.query(
        "INSERT INTO pro_table (word, stories_id) VALUES ?",
        [proWords],
        (err) => {
          if (err) {
            console.error("Error inserting words:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          res.status(201).json({ message: "Story submitted successfully." });
        }
      );
    }
  );
});
// ADD STORY AND WORDS TO DATABASE END //

// DELETE STORIES FROM DATABASE START //
app.delete("/delete-story/:storyId", (req, res) => {
  const storyId = req.params.storyId;

  if (storyId === undefined) {
    return res.status(400).json({ message: "Invalid story ID" });
  }

  // Delete the records from the pro_table first
  db.query("DELETE FROM pro_table WHERE stories_id = ?", [storyId], (err) => {
    if (err) {
      console.error("Error deleting words:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Delete the row from the stories_table
    db.query(
      "DELETE FROM stories_table WHERE stories_id = ?",
      [storyId],
      (err, results) => {
        if (err) {
          console.error("Error deleting story:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Story not found" });
        }

        res.status(200).json({ message: "Story deleted successfully." });
      }
    );
  });
});
// DELETE STORIES FROM DATABASE END //

// FETCHING STUDENT FOR EXAMINATION START //
app.get("/api/studentExam", (req, res) => {
  const studentID = req.query.studentID;
  console.log("Received studentID:", studentID);

  const sqlSelect =
    "SELECT id, firstName, lastName FROM student_list WHERE id = ?";

  db.query(sqlSelect, [studentID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching student data");
    } else {
      console.log("Query results:", results);

      if (results.length === 0) {
        res.status(404).send("Student not found");
      } else {
        const studentData = results[0];
        const enhancedStudentData = {
          ...studentData,
          studentID: studentData.id,
        };

        res.status(200).json(enhancedStudentData);
      }
    }
  });
});
// FETCHING STUDENT FOR EXAMINATION END //

// FETCH STORY AND WORDS START //
app.get("/fetch-story/:storyId", (req, res) => {
  const storyId = req.params.storyId;

  db.query(
    "SELECT title, content FROM stories_table WHERE stories_id = ?",
    [storyId],
    (err, storyResults) => {
      if (err) {
        console.error("Error fetching story details:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (!storyResults || storyResults.length === 0) {
        console.log("No results found for story ID:", storyId);
        return res.status(404).json({ message: "No results found" });
      }

      db.query(
        "SELECT word FROM pro_table WHERE stories_id = ?",
        [storyId],
        (err, wordResults) => {
          if (err) {
            console.error("Error fetching words:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          const storyDetails = {
            title: storyResults[0].title,
            content: storyResults[0].content,
            words: wordResults.map((word) => word.word),
          };

          res.status(200).json(storyDetails);
        }
      );
    }
  );
});

// FETCH STORY AND WORDS END //

// SUBMIT SCORE TO DATABASE START //
app.post("/api/submitScore", (req, res) => {
  const { studentID, totalScore } = req.body;
  console.log("Received score submission:", { studentID, totalScore });
  console.log("Received score submission:", req.body);

  // Get a connection from the pool
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Begin the transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error beginning transaction:", err);
        res.status(500).send("Internal Server Error");
        return connection.release();
      }

      // Update the database with the student's total score
      const sqlUpdateScore =
        "UPDATE graph_table SET score = ? WHERE graph_id = ?";
      console.log("SQL Query:", sqlUpdateScore, [totalScore, studentID]);

      const studentIDInt = parseInt(studentID, 10);

      connection.query(
        sqlUpdateScore,
        [totalScore, studentID],
        (err, result) => {
          if (err) {
            console.error("Error updating score:", err);

            // Rollback the transaction in case of an error
            connection.rollback(() => {
              connection.release();
              res.status(500).send("Internal Server Error");
            });
          } else {
            // Commit the transaction if successful
            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                connection.rollback(() => {
                  connection.release();
                  res.status(500).send("Internal Server Error");
                });
              } else {
                // Release the connection back to the pool
                connection.release();

                // Send a success response
                res.status(200).send("Score submitted successfully");
              }
            });
          }
        }
      );
    });
  });
});
// SUBMIT SCORE TO DATABASE END //

app.listen(3001, () => {
  console.log("Server is running on Port 3001");
});
