const decimals = 2;
const display = document.querySelector("main");
const popup = document.createElement("dialog");
const price = document.getElementById("priceInput");
const validator = new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`);
const taxesFile = 'data/taxes.json';
const title = document.querySelector("header h1");
document.title = "Price tax calculator";
let lastValidInput = "";
let taxes = [];
let errorMsg = "";
popup.className = "popup";
title.textContent = document.title;
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
      let loadedMsg = "Loaded ";
      for (let key=0; key < taxes.length;) {
        if (Object.hasOwn(taxes[key], "tax") && typeof taxes[key].tax === "string" && Object.hasOwn(taxes[key], "rate") && typeof taxes[key].rate === "number") {
          let taxStr = `${taxes[key].tax} (${taxes[key].rate}%)`;
          if (key === 0) {
            loadedMsg += taxStr;
          } else if (key < taxes.length -1) {
            loadedMsg += `, ${taxStr},`;
          } else {
            loadedMsg += ` and ${taxStr}`;
          }
          key++;
        } else {
          taxes.splice(key, 1);
        }
      }
      if (taxes.length > 0) {
        loadedMsg += " successfully.";
        alert(loadedMsg);
        price.removeAttribute("disabled");
      } else {
        throw new Error("No valid taxes loaded successfully.");
      }
    })
    .catch(error => {
      popup.innerHTML = `<h2>Error Loading Taxes</h2><p>${error.message}</p>`;
      popup.show();
    });
function calculate(initial) {
  let total = initial;
  taxes.forEach(tax => {
    total += parseFloat((initial * (tax.rate / 100)).toFixed(decimals));
  });
  return total;
}
function process(input) {
  const final = calculate(input);
  showMath(input, final);
}
function showMath(initial, final) {
  popup.innerHTML = `<h2>Price Calculation</h2><p>Initial: $${initial.toFixed(decimals)}</p>`;
  taxes.forEach(tax => {
    popup.innerHTML += `<p>+ ${tax.tax} (${tax.rate}%): $${(initial * (tax.rate / 100)).toFixed(decimals)}</p>`;
  });
  popup.innerHTML += `<hr><p>Final: $${final.toFixed(decimals)}</p><button>Close</button>`;
  const closeButton = popup.querySelector("button");
  closeButton.addEventListener("click", () => {
    popup.close();
  });
  popup.showModal();
}
price.addEventListener("input", event => {
  const newInput = event.target.value;
  if (validator.test(newInput)) {
    lastValidInput = newInput;
  } else {
    event.target.value = lastValidInput;
  }
});
price.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    let input = parseFloat(price.value);
    if (Number.isNaN(input)) {
      alert(`Unsure what "${price.value}" meant. Please be more specific.`);
    } else {
      process(input);
    }
  }
});