const price = document.getElementById('priceInput');
const taxesFilePath = 'data/taxes.json';
let taxes=[];
fetch(taxesFilePath)
  .then(
    function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Unable to obtain ${taxesFilePath} because the response is ${response.ok}');
        }
    }
  )
  .then(data => {
    taxes = data;
  })
  .catch(error => console.error('Error loading taxes:', error));