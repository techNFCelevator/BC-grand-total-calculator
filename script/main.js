const display = document.querySelector("main");
const invalidKeys = ["e", "E", "+", "-"];
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
    .catch(error => popup.innerHTML = `<h2>Error Loading Taxes</h2><p>${error.message}</p>`);
function calculate(initial) {
  let total = initial;
  taxes.forEach(tax => {
    total += initial * (tax.rate / 100);
  });
  return total;
}
function process(input) {
  const final = calculate(input);
  display(input, final);
}
function display(initial, final) {
  popup.innerHTML = `<h2>Price Calculation</h2><p>Initial: $${initial}</p>`;
  taxes.forEach(tax => {
    popup.innerHTML += `<p>${tax.tax} (${tax.rate}%): $${(initial * (tax.rate / 100)).toFixed(2)}</p>`;
  });
  popup.innerHTML += `<hr><p>Final: $${final}</p><button`;
}
document.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    if (price.value !== "" && price.value !== null) {
      process(parseFloat(price.value));
    }
  } else if (invalidKeys.includes(event.key)) {
    event.preventDefault();
  }
});