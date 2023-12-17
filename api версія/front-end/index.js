// Fetch data and fill the table
async function fetchDataAndFillTable() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/data');
        const data = await response.json();
        const table = document.getElementById('data-table');
        
        // Create table head
        createTableHead(table, data[0]);

        // Create table body
        createTableBody(table, data);

        // Now that the table is loaded, you can access the headers
        const headers = Array.from(table.rows[0].cells).map(cell => cell.querySelector('input').value);
        console.log(headers);
    } catch (error) {
        console.error('Error:', error);
    }
}

function createTableHead(table, dataItem) {
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    Object.keys(dataItem).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
}

function createTableBody(table, data) {
    data.forEach(item => {
        const row = table.insertRow();
        Object.values(item).forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });
}

// Switch theme
function switchTheme() {
    const htmlElement = document.documentElement;
    const themeSwitch = document.getElementById('themeSwitch');
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Switch theme
    htmlElement.setAttribute('data-bs-theme', newTheme);
    themeSwitch.checked = newTheme === 'dark';
    localStorage.setItem('theme', newTheme);
}

// On page load, set the theme from localStorage
window.onload = function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeSwitch = document.getElementById('themeSwitch');
    const htmlElement = document.documentElement;

    htmlElement.setAttribute('data-bs-theme', savedTheme);
    themeSwitch.checked = savedTheme === 'dark';
    document.body.style.display = "block";  // Reveal the body
}

// Add a new row to the table
async function addRow() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/addRow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('Success:', data);
        location.reload();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add a new column to the table
async function addColumn() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/addColumn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('Success:', data);
        location.reload();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function to fetch data and fill the table
fetchDataAndFillTable();
document.getElementById('tableForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get all the input elements in the table
    const inputs = this.querySelectorAll('input');

    // Create an array to hold the data
    let data = [];

    // Loop through the inputs and add their values to the data array
    inputs.forEach(input => {
        data.push(input.value);
    });

    // Send a PUT request to the API with the data
    fetch('/api/update/:id', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});


function editTable() {
    const table = document.getElementById('data-table');
    const editButton = document.getElementById('editTable');
    const finishEditingButton = document.getElementById('finishEditingTable');
  
    // Toggle visibility of buttons
    editButton.style.display = 'none';
    finishEditingButton.style.display = 'block';
  
    // Iterate over all cells in the table
    for (let row of table.rows) {
      for (let cell of row.cells) {
        const input = document.createElement('input');
        input.classList.add('form-control'); // Add Bootstrap class
        input.value = cell.innerText; // Set input value to current cell text
        cell.innerText = ''; // Clear cell text
        cell.appendChild(input); // Add input to cell
      }
    }
  }
  
  function finishEditing() {
    const table = document.getElementById('data-table');
    const editButton = document.getElementById('editTable');
    const finishEditingButton = document.getElementById('finishEditingTable');
  
    // Toggle visibility of buttons
    editButton.style.display = 'block';
    finishEditingButton.style.display = 'none';
  
    // Get the headers (first row of the table)
    const headers = Array.from(table.rows[0].cells).map(cell => cell.querySelector('input').value);
    // Iterate over all rows in the table, starting from the second row
    console.log(Array.from(table.rows))
    const data = Array.from(table.rows).slice(1).map(row => {
      const rowData = {};
      // Iterate over all cells in the row
      Array.from(row.cells).forEach((cell, index) => {
          const input = cell.querySelector('input');
        
          // Set the property of the rowData object based on the header
          rowData[headers[index]] = input.value;
        });

        return rowData;
    });
  
    // Send table data to server
    fetch('http://127.0.0.1:3000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
  