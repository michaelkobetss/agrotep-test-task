// On page load, set the theme from localStorage
window.onload = function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  const themeSwitch = document.getElementById("themeSwitch");
  const htmlElement = document.documentElement;

  htmlElement.setAttribute("data-bs-theme", savedTheme);
  themeSwitch.checked = savedTheme === "dark";
  document.body.style.display = "block"; // Reveal the body
};

// Switch theme
function switchTheme() {
  const htmlElement = document.documentElement;
  const themeSwitch = document.getElementById("themeSwitch");
  const currentTheme = htmlElement.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Switch theme
  htmlElement.setAttribute("data-bs-theme", newTheme);
  themeSwitch.checked = newTheme === "dark";
  localStorage.setItem("theme", newTheme);
}

// Fetch data and fill the table
async function fetchDataAndFillTable() {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/data");
    const data = await response.json();
    const table = document.getElementById("data-table");

    // Create table head and body
    createTableHead(table, data[0]);
    createTableBody(table, data);
  } catch (error) {
    console.error("Error:", error);
  }
}

function createTableHead(table, dataItem) {
  // Clear existing table head
  table.tHead?.remove();

  // Create new table head
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  Object.keys(dataItem).forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });
}

function createTableBody(table, data) {
  // Clear existing table body
  table.tBodies[0]?.remove();

  // Create new table body
  const tbody = table.createTBody();
  data.forEach((item) => {
    const row = tbody.insertRow();
    Object.values(item).forEach((value) => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });
}

// Add a new row to the table
async function addRow() {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/addRow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Success:", data);
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Add a new column to the table
async function addColumn() {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/addColumn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Success:", data);
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

function editTable() {
  const table = document.getElementById("data-table");
  const editButton = document.getElementById("editTable");
  const finishEditingButton = document.getElementById("finishEditingTable");
  const addColumnButton = document.getElementById("addColumnButton");
  const addRowButton = document.getElementById("addRowButton");

  // Toggle visibility of buttons
  editButton.style.display = "none";
  finishEditingButton.style.display = "block";
  addColumnButton.style.display = "none";
  addRowButton.style.display = "none";

  // Create delete buttons for each row
  const thead = table.querySelector("thead");
  const headerRow = thead.insertRow(0);
  for (let i = 0; i-1 < table.rows[1].cells.length; i++) {
    if (i !== 0) {
      console.log(i)
      const cell = headerRow.insertCell(i);
      const button = document.createElement("button");
      button.classList.add("btn");
      button.innerHTML = '<i class="fas fa-trash"></i><i class="fas fa-arrow-down"></i>';
      button.onclick = function () {
        deleteColumn(i-1);
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
    // Skip the first row
    const row = table.rows[i];

    // Create delete button for each row
    if (i !== 1) {
      const cell = row.insertCell(0);
      const button = document.createElement("button");
      button.classList.add("btn");
      button.innerHTML = '<i class="fas fa-trash"></i><i class="fas fa-arrow-right"></i>';
      button.onclick = function () {
        deleteRow(i - 1); // Adjust the index to account for the new header row
      };
      cell.appendChild(button);
    } else {
      const cell = row.insertCell(0);
      const p = document.createElement("p");
      cell.appendChild(p);
    }

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
    .slice(2) // Skip the first row
    .map((row) => {
      const rowData = {};
      // Iterate over all cells in the row
      Array.from(row.cells).forEach((cell, index) => {
        const input = cell.querySelector("input");
        // Check if the input is not null before accessing its value
        if (input) {
          // Set the property of the rowData object based on the header
          rowData[headers[index - 1]] = input.value;
        }
      });
      return rowData;
    });

  console.log(data);
  // Send table data to server
  fetch("http://127.0.0.1:3000/api/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(location.reload());
}

async function deleteRow(rowIndex) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/deleteRow/${rowIndex}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log("Success:", data);
    //   editTable(); // Refresh the onclick handlers
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteColumn(columnIndex) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/deleteColumn/${columnIndex}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log("Success:", data);
    //   editTable(); // Refresh the onclick handlers
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the function to fetch data and fill the table
fetchDataAndFillTable();
