const display = document.querySelector("main");
const popup = document.createElement("popup");
const price = document.getElementById('priceInput');
const taxesFilePath = 'data/taxes.json';
let taxes = [];
let errorMsg = "";
popup.className = "popup";
display.prepend(popup);
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
  .then(function(data) {
    taxes = data;
  })
  .catch(error => errorMsg += error.message);
  if (taxes.length > 0) {
    price.removeAttribute("disabled");
  } else {
    errorMsg += "No tax loaded successfully.";
    $(`.popup`).html(`<h2>ERROR</h2><p>${errorMsg}</p>`);
  }