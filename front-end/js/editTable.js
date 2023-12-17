// ;;         editTable.js
// ;;
// ;;          in this file you will find all the logic connected with editing a table
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;

//Enter editing mode
function editTable() {
  const table = document.getElementById("data-table");
  const editButton = document.getElementById("editTable");
  const finishEditingButton = document.getElementById("finishEditingTable");
  const addColumnButton = document.getElementById("addColumnButton");
  const addRowButton = document.getElementById("addRowButton");

  // Hide buttons that may cause problems
  editButton.style.display = "none";
  finishEditingButton.style.display = "block";
  addColumnButton.style.display = "none";
  addRowButton.style.display = "none";

  // Create/Generate delete  buttons for each column (trashcan icons above table head)
  const thead = table.querySelector("thead");
  const headerRow = thead.insertRow(0);
  for (let i = 0; i - 1 < table.rows[1].cells.length; i++) {
    if (i !== 0) {
      console.log(i);
      const cell = headerRow.insertCell(i);
      const button = document.createElement("button");
      button.classList.add("btn");
      button.innerHTML =
        '<i class="fas fa-trash"></i><i class="fas fa-arrow-down"></i>';
      button.onclick = function () {
        deleteColumn(i - 1);
      };
      cell.appendChild(button);
    } else {
      const cell = headerRow.insertCell(0);
      const p = document.createElement("p");
      cell.appendChild(p);
    }
  }

  // Iterate over all cells in the table
  for (let i = 1; i < table.rows.length; i++) {
    // Skip the first row (because we don't want to delete header)
    const row = table.rows[i];

    // Create/Generate delete  buttons for each row (trashcan icons to the left)
    if (i !== 1) {
      const cell = row.insertCell(0);
      const button = document.createElement("button");
      button.classList.add("btn");
      button.innerHTML =
        '<i class="fas fa-trash"></i><i class="fas fa-arrow-right"></i>';
      button.onclick = function () {
        deleteRow(i - 1); // Adjust the index to account for the new header row
      };
      cell.appendChild(button);
    } else {
      const cell = row.insertCell(0);
      const p = document.createElement("p");
      cell.appendChild(p);
    }

    //Create/Generate inputs inside table data
    for (let j = 1; j < row.cells.length; j++) {
      const cell = row.cells[j];
      const input = document.createElement("input");
      input.classList.add("form-control"); // Add Bootstrap class
      input.value = cell.innerText; // Set input value to current cell text
      cell.innerText = ""; // Clear cell text
      cell.appendChild(input); // Add input to cell
    }
  }
}

// Function to submit all the data in table to api,
function finishEditing() {
  const table = document.getElementById("data-table");
  const editButton = document.getElementById("editTable");
  const finishEditingButton = document.getElementById("finishEditingTable");

  // Toggle visibility of buttons
  editButton.style.display = "block";
  finishEditingButton.style.display = "none";

  // Get the headers (third row of the table)
  const headers = Array.from(table.rows[1].cells)
    .slice(1) // Skip the first index
    .map((cell) => {
      const input = cell.querySelector("input");
      return input ? input.value : "";
    });

  console.log(headers);
  const data = Array.from(table.rows)
    .slice(2) // Skip the first two rows
    .map((row) => {
      const rowData = {};
      // Iterate over all cells in the row
      Array.from(row.cells).forEach((cell, index) => {
        const input = cell.querySelector("input");
        // check for input (because trashcan icons are also in table data)
        if (input) {
          // Set the property of the rowData object based on the header
          rowData[headers[index - 1]] = input.value;
        }
      });
      return rowData;
    });

  // Send table data to server
  fetch(LOCAL_API_URL + "update", {
    method: PUT,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(location.reload());
}
