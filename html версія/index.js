// Fetch data and fill the table
fetch('db.json')
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('data-table');
        data.forEach(item => {
            const row = table.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.name;
            row.insertCell().textContent = item.breed;
            row.insertCell().textContent = item.age;
        });
    });
console.log("test")
// Switch theme
// Switch theme
// Switch theme
function switchTheme() {
    const htmlElement = document.documentElement;
    const moonIcon = document.querySelector('.fa-moon');
    const sunIcon = document.querySelector('.fa-sun');
    const themeSwitch = document.getElementById('themeSwitch');

    if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
        // Switch to light theme
        htmlElement.setAttribute('data-bs-theme', 'light');

        themeSwitch.checked = false;
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark theme
        htmlElement.setAttribute('data-bs-theme', 'dark');

        themeSwitch.checked = true;
        localStorage.setItem('theme', 'dark');
    }
}

// On page load, set the theme from localStorage
window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    const themeSwitch = document.getElementById('themeSwitch');
    const htmlElement = document.documentElement;
    if (savedTheme) {
        htmlElement.setAttribute('data-bs-theme', savedTheme);
        if (savedTheme === 'dark') {
        
            themeSwitch.checked = true;
        } else {
 
            themeSwitch.checked = false;
        }
    }
    document.body.style.display = "block";  // Reveal the body
}

// Add a new row to the table
function addRow() {
    const table = document.getElementById('data-table');
    const numCols = table.rows[0].cells.length;  // Get the number of columns
    const row = table.insertRow();
    
    // Get the current number of rows in the table
    let numRows = table.rows.length -1;

    for (let i = 0; i < numCols; i++) {
        const cell = row.insertCell();
       
        if (i === 0) {
            cell.textContent = numRows; // Set the textContent to the id for the first cell
        } else {
            cell.textContent = '';
        }
    }
}



// Add a new column to the table
function addColumn() {
    const table = document.getElementById('data-table');
    const headerRow = table.rows[0];
    const newHeader = document.createElement('th');
    newHeader.textContent = 'Нова колонка';
    headerRow.appendChild(newHeader);
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cell = row.insertCell();
        cell.textContent = '';
    }
}

let isEditing = false;

function editTable() {
  const table = document.getElementById('data-table');
  const cells = table.getElementsByTagName('td');
  const headers = table.getElementsByTagName('th');
  const addRowButton = document.getElementById('addRowButton');
  const addColumnButton = document.getElementById('addColumnButton');
  const editTable = document.getElementById('editTable');
  const finishEditingTable = document.getElementById('finishEditingTable');

  if (!isEditing) {
    for (let i = 0; i < headers.length; i++) {
      const textarea = document.createElement('textarea');
      textarea.className = 'form-control'; // Bootstrap class
      textarea.value = headers[i].textContent;
      headers[i].textContent = '';
      headers[i].appendChild(textarea);
    }

    for (let i = 0; i < cells.length; i++) {
      const textarea = document.createElement('textarea');
      textarea.className = 'form-control'; // Bootstrap class
      textarea.value = cells[i].textContent;
      cells[i].textContent = '';
      cells[i].appendChild(textarea);
    }

    addRowButton.style.display = 'none';
    addColumnButton.style.display = 'none';
    editTable.style.display = 'none';
   finishEditingTable.style.display = 'inline-block';
    isEditing = true;
  } else {
    for (let i = 0; i < headers.length; i++) {
      headers[i].textContent = headers[i].firstChild.value;
    }

    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = cells[i].firstChild.value;
    }

    addRowButton.style.display = 'block';
    addColumnButton.style.display = 'block';
    editTable.style.display = 'inline-block';
    finishEditingTable.style.display = 'none';
    isEditing = false;
  }
}
