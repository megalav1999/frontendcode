const addItemForm = document.getElementById('addItemForm');

// Function to fetch items from the server
function fetchItems() {
  return fetch('/api/items')
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching items:', error);
      return [];
    });
}

// Function to display items in a new page
function displayItemsInNewPage(items) {
  const formattedItems = items.map(item => `${item.title}\n${item.description}\n\n`).join('');

  const newWindow = window.open();
  newWindow.document.write(`<html><head><title>Item List</title></head><body><pre>${formattedItems}</pre><button id="goBackBtn">Go Back</button></body></html>`);
  newWindow.document.close();

  // Add event listener to the "Go Back" button in the new page
  newWindow.document.getElementById('goBackBtn').addEventListener('click', function() {
    newWindow.close(); // Close the new window
  });
}

// Event listener for form submission to add a new item
addItemForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  // Make POST request to add a new item
  fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  })
    .then(response => {
      if (response.status === 201) {
        // If item added successfully, fetch and display updated items
        fetchItems().then(updatedItems => {
          // Display updated items in a new page
          displayItemsInNewPage(updatedItems);
        });

        // Clear the form fields after adding
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
      } else {
        console.error('Failed to add item');
      }
    })
    .catch(error => console.error('Error adding item:', error));
});