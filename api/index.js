// Import required modules
const express = require("express");
const fs = require("fs");
const cors = require("cors");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
let db = require("./db/db_initial.json");

// Helper function to save changes to the database
function saveChanges() {
  try {
    fs.writeFileSync("./db/db.json", JSON.stringify(db, null, 2));
  } catch (err) {
    console.error(err);
  }
}

// Route handlers
function sendData(req, res) {
  try {
    res.json(db);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function addRow(req, res) {
  let newRow = {};
  Object.keys(db[0]).forEach((key) => {
    newRow[key] = key === "id" ? db.length + 1 : "-";
  });

  db.push(newRow);
  saveChanges();

  res.json({ message: "Row added successfully" });
}

function addColumn(req, res) {
  db.forEach((row) => {
    const columnNumber = Object.keys(row).length;
    row[`Нова колонка ${columnNumber}`] = "-";
  });

  saveChanges();
  res.json({ message: "Column added successfully" });
}

function deleteRow(req, res) {
  // Check if there is more than one row left
  if (db.length <= 1) {
    res.status(400).json({ message: "Cannot delete any more rows" });
    return;
  }

  const index = parseInt(req.params.index - 1);
  if (index >= 0 && index < db.length) {
    db.splice(index, 1); // Remove the row at the specified index
    saveChanges();
    res.json({ message: "Row deleted successfully" });
    console.log("Row deleted successfully");
  } else {
    res.status(400).json({ message: "Invalid index" });
  }
}

function deleteColumn(req, res) {
  // Check if there is more than one column left
  if (Object.keys(db[0]).length <= 1) {
    res.status(400).json({ message: "Cannot delete any more columns" });
    console.log("Cannot delete any more columns");
    return;
  }

  const columnIndex = req.params.columnIndex;
  const keys = Object.keys(db[0]);

  // Check if columnIndex is valid
  if (columnIndex < 0 || columnIndex >= keys.length) {
    res.status(400).json({ message: "Invalid column index" });
    console.log(columnIndex);
    console.log("Invalid column index");
    return;
  }

  // Convert the columnIndex to a columnName
  const columnName = keys[columnIndex];

  db.forEach((row) => {
    delete row[columnName];
  });
  saveChanges();
  res.json({ message: "Column deleted successfully" });
  console.log("Column deleted successfully");
}

function updateDatabase(req, res) {
  db = req.body;
  saveChanges();
  res.json({ message: "Database updated successfully" });
}

// Routes
app.route("/api/data").get(sendData);
app.route("/api/addRow").post(addRow);
app.route("/api/addColumn").post(addColumn);
app.route("/api/deleteRow/:index").delete(deleteRow);
app.route("/api/deleteColumn/:columnIndex").delete(deleteColumn);
app.route("/api/update").put(updateDatabase);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  try {
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error(err);
  }
});
