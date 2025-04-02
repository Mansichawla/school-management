require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
      return res.status(500).json({ error: error.message });
    } else {
      res
        .status(201)
        .json({
          message: "school added successfully",
          schoolId: data.insertID,
        });
    }
  });
});

app.get("/listSchools", (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  db.query("SELECT * FROM SCHOOLS", (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    const sortedSchools = data
      .map((school) => ({
        ...school,
        distance: calculateDistance(
          latitude,
          longitude,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
      return res.json(sortedSchools);
  });
  
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
