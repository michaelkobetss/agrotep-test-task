// ;;          generateTable.js
// ;;
// ;;          This file is responsible for initial generation of the table
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;

function createTableHead(table, dataItem) {
  // table.tHead?.remove(); //if something breaks uncomment this

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
  // table.tBodies[0]?.remove(); //if something breaks uncomment this

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

// Generate table (fetch data and fill)
(async function fetchDataAndFillTable() {
  try {
    const response = await fetch(LOCAL_API_URL + "data");
    const data = await response.json();
    const table = document.getElementById("data-table");

    // Create table head and body
    createTableHead(table, data[0]);
    createTableBody(table, data);
  } catch (error) {
    console.error("Error:", error);
  }
})();
