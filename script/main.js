const price = document.getElementById('priceInput');
const taxesFilePath = 'data/taxes.json';
let taxes = [];
let errorMsg = "";
fetch(taxesFilePath)
  .then(
    response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Response is ${response.ok} as it cannot find ${taxesFilePath}");
        }
    }
  )
  .then(data => {
    taxes = data;
    for (let key = 0; key < taxes.length;) {
        if (Object.hasOwn(taxes[key], "tax") && typeof taxes[key].tax === "string" && Object.hasOwn(taxes[key], "rate") && typeof taxes[key].rate === "number") {
            ++key;
        } else {
            taxes.splice(key, 1);
        }
    }
  })
  .catch(error => console.error('Error loading taxes:', error));
  if (taxes.length > 0) {}