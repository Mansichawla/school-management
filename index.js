require("dotenv").config();
const express = require("express");
const mysql = require('mysql2')
const bodyParser = require("body-parser")

// const mysql = require("mysql");
const geolib = require("geolib");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "school_management",
  port:3300
});
db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});
// Routes
app.post("/addSchool", (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, address, latitude, longitude], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error", err });
    } else {
      res.status(201).json({
        message: "school added successfully",
        schoolId: data.insertID,
      });
    }
  });
});

app.get("/listSchools", (req, res) => {
  const { latitude, longitude } = req.query;


  const sql = "SELECT * FROM SCHOOLS";
  db.query(sql, (err, schools) => {
    if (err) return res.status(500).json({ error: err.message });

    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: geolib.getDistance(
          { latitude: Number(latitude), longitude: Number(longitude) },
          { latitude: school.latitude, longitude: school.longitude }
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
    return res.json(sortedSchools);
  });
});


app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
