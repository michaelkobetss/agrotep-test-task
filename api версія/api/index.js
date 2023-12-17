const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let db = require("./db/db.json");

app.get("/api/data", (req, res) => {
  res.json(db);
});
app.post("/api/addRow", (req, res) => {
    // Create a new row with an id and empty values for the other properties
    let newRow = {};
    Object.keys(db[0]).forEach(key => {
        if (key === 'id') {
            newRow[key] = db.length + 1;  // Generate a new id
        } else {
            newRow[key] = "-";  // Empty value for the other properties
        }
    });

    // Add the new row to the database and save the changes
    db.push(newRow);
    saveChanges();

    res.json({ message: "Row added successfully" });
    console.log("Row added successfully");
});


app.post("/api/addColumn", (req, res) => {
    db.forEach((row, index) => {
        const number = Object.keys(row).length
        row[`Нова колонка ${number}`] = "-";
        console.log(db.length)
    });

  saveChanges();
  res.json({ message: "Column added successfully" });
  console.log("Column added successfully");
});

app.delete("/api/deleteRow/:index", (req, res) => {
  const index = parseInt(req.params.index -1);
  if (index >= 0 && index < db.length) {
    db.splice(index, 1); // Remove the row at the specified index
    saveChanges();
    res.json({ message: "Row deleted successfully" });
    console.log("Row deleted successfully");
  } else {
    res.status(400).json({ message: "Invalid index" });
  }
});


app.delete("/api/deleteColumn/:columnIndex", (req, res) => {
  const columnIndex = req.params.columnIndex;
  // Convert the columnIndex to a columnName
  const columnName = Object.keys(db[0])[columnIndex];
  
  db.forEach((row) => {
    delete row[columnName];
  });
  saveChanges();
  res.json({ message: "Column deleted successfully" });
  console.log("Column deleted successfully");
});

app.put("/api/update", (req, res) => {
  db = req.body;
  saveChanges();
  res.json({ message: "Database updated successfully" });
});


function saveChanges() {
  fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
