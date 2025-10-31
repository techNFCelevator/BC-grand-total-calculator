const display = document.querySelector("main");
const popup = document.createElement("section");
const price = document.getElementById('priceInput');
const taxesFile = 'data/taxes.json';
let taxes = [];
let errorMsg = "";
popup.className = "popup";
display.prepend(popup);
fetch(taxesFile)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.statusText} ${response.status} received when fetching ${taxesFile}`);
      }
      return response.json();
    })
    .then(data => {
      taxes = data;
      for (let key=0; key < taxes.length;) {
        if (Object.hasOwn(taxes[key], "tax") && typeof taxes[key].tax === "string" && Object.hasOwn(taxes[key], "rate") && typeof taxes[key].rate === "number") {
          key++;
        } else {
          taxes.splice(key, 1);
        }
      }
      if (taxes.length > 0) {
        price.removeAttribute("disabled");
      } else {
        throw new Error("No valid taxes loaded successfully.");
      }
    })
    .catch(error => $(`.popup`).html(`<h2>Error Loading Taxes</h2><p>${error.message}</p>`));