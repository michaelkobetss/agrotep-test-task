// ;;          apiRequests.js
// ;;
// ;;          in this file you will find mostly functions connected to various api requests
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;
// ;;

// Add a new row to the table (when you press that + icon)
async function addRow() {
  try {
    const response = await fetch(LOCAL_API_URL + "addRow", {
      method: POST,
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

// Add a new column to the table (when you press that + icon)
async function addColumn() {
  try {
    const response = await fetch(LOCAL_API_URL + "addColumn", {
      method: POST,
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

async function deleteRow(rowIndex) {
  try {
    const response = await fetch(`${LOCAL_API_URL}deleteRow/${rowIndex}`, {
      method: DELETE,
    });
    const data = await response.json();
    console.log("Success:", data);
    //   editTable(); // Refresh the onclick handlers
  } catch (error) {
    console.error("Error:", error);
  }
}

//delete a row when clicking on a trashcan on top
async function deleteColumn(columnIndex) {
  try {
    const response = await fetch(
      `${LOCAL_API_URL}deleteColumn/${columnIndex}`,
      {
        method: DELETE,
      }
    );
    const data = await response.json();
    console.log("Success:", data);
    //   editTable(); // Refresh the onclick handlers
  } catch (error) {
    console.error("Error:", error);
  }
}
