const price = document.getElementById('priceInput');
const taxesFilePath = 'data/taxes.json';
let taxes=[];
fetch(taxesFilePath)
  .then(
    response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok');
        }
    }
  )
  .then(data => {
    taxes = data;
  })
  .catch(error => console.error('Error loading taxes:', error));