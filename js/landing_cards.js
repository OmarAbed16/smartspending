// Fetch data from the JSON file
fetch("./js/currencies.json")
  .then((response) => response.json())
  .then((data) => {
    const currencyList = document.getElementById("currency-list");
    const sortedCurrencies = data.currencies;

    const order = ["JOD", "EGP", "KWD", "EUR", "SAR", "USD"];
    sortedCurrencies.sort(
      (a, b) => order.indexOf(a.currencyCode) - order.indexOf(b.currencyCode)
    );

    sortedCurrencies.forEach((currency) => {
      const listItem = document.createElement("li");
      listItem.classList.add("currency-list-item");

      const currencyText = `${currency.name} (${currency.currencyCode}) - ${currency.price} ${currency.currencyCode}`;
      const changeText =
        currency.change >= 0 ? `+${currency.change}%` : `${currency.change}%`;

      listItem.innerHTML = `
                <span>${currencyText}</span>
                <span class="${
                  currency.change >= 0 ? "text-success" : "text-danger"
                }">${changeText}</span>
            `;

      currencyList.appendChild(listItem);
    });
  })
  .catch((error) => console.error("Error loading currency data:", error));
let rotationInterval;

//...........FAQ js code..........

// function startRotation() {
//   const slider = document.querySelector(".slider-container");
//   slider.style.animationPlayState = "running";
// }

// function stopRotation() {
//   const slider = document.querySelector(".slider-container");
//   slider.style.animationPlayState = "paused";
// }
