//-------- Currency Converter Section----------
const apiUrl = "https://restcountries.com/v3.1/all";
const exchangeApiUrl = "https://open.er-api.com/v6/latest/";

// Get dropdown elements
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const currencySelect = document.getElementById("currency-select");

// Fetch countries and currencies
function fetchCurrencies() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((countries) => {
      // Sort countries alphabetically by common name
      countries.sort((a, b) => {
        const nameA = a.name.common.toLowerCase();
        const nameB = b.name.common.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      populateDropdowns(countries);
    })
    .catch((error) => {
      console.error("Error fetching countries:", error);
    });
}

function populateDropdowns(countries) {
  countries.forEach((country) => {
    if (country.currencies) {
      const currencyCode = Object.keys(country.currencies)[0];
      const option = document.createElement("option");
      option.value = currencyCode;
      option.innerHTML = `${country.name.common} - ${currencyCode}`;
      // used cloneNode beacause we have to put the same options in "From" and "To" drop-down, it creates a copy of the original option so that it can be added to the "From" dropdown without being removed from the "To" dropdown.
      fromCurrency.appendChild(option.cloneNode(true));
      toCurrency.appendChild(option.cloneNode(true));
      currencySelect.appendChild(option);
    }
  });
}

function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || !from || !to) {
    alert("Please fill out all fields");
    return;
  }

  fetch(`${exchangeApiUrl}${from}`)
    .then((response) => response.json())
    .then((data) => {
      const exchangeRate = data.rates[to];
      const convertedAmount = (amount * exchangeRate).toFixed(2);
      document.getElementById(
        "resultText"
      ).innerHTML = `<p>${amount} ${from} = </p>
      <h4>${convertedAmount} ${to} </h4>`;
    })
    .catch((error) => {
      console.error("Error converting currency:", error);
    });
}

// Add event listener to convert button
document
  .getElementById("convertButton")
  .addEventListener("click", convertCurrency);

// Fetch currencies on page load
fetchCurrencies();

//-----Budget Tracker Section--------\

let incomeData = [];
let expenseData = [];

// Function to add income field and update local storage
function addIncomeField(amount = '', category = 'salary', frequency = 'month') {
  let incomeWrapper = document.querySelector(".income-row-wrapper");
  let newIncomeRow = document.createElement("div");
  newIncomeRow.classList.add("income-row");
  newIncomeRow.innerHTML = `
        <div class="converter-row budget-content">
                                <div class="income-row" style= "margin-left : -0.001vw;">
                                    <div class="form-group">
                                        <label
                                            for="currency-select">Amount</label>
                                        <input type="number"
                                            placeholder="Enter Income Amount"
                                            class="income-input" value="${amount}">
                                    </div>

                                    <div class="form-group">
                                        <label for="category">Category</label>
                                        <select id="category">
                                            <option value="salary" ${category === 'salary' ? 'selected' : ''}>Salary</option>
                                            <option value="freelance" ${category === 'freelance' ? 'selected' : ''}>Freelance</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="frequency">Income Frequency</label>
                                        <select id="frequency">
                                            <option value="month" ${frequency === 'month' ? 'selected' : ''}>Per Month</option>
                                            <option value="week" ${frequency === 'week' ? 'selected' : ''}>Per Week</option>
                                            <option value="day" ${frequency === 'day' ? 'selected' : ''}>Per Day</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
    `;
  newIncomeRow.style.marginTop = "-3vh";
  incomeWrapper.appendChild(newIncomeRow);
  updateLocalStorage();
}

// Function to remove income field and update local storage
function removeIncomeField() {
  let incomeWrapper = document.querySelector(".income-row-wrapper");
  if (incomeWrapper.children.length > 1) {
    incomeWrapper.removeChild(incomeWrapper.lastChild);
    updateLocalStorage();
  }
}

// Function to add expense field and update local storage
function addExpenseField(amount = '', category = 'salary', frequency = 'month') {
  let expenseWrapper = document.querySelector(".expense-row-wrapper");
  let newExpenseRow = document.createElement("div");
  newExpenseRow.classList.add("expense-row");
  newExpenseRow.innerHTML = `
        <div class="converter-row budget-content">
                            <div class="expense-row" style="margin-left: -0.1vw;">
                                <div class="form-group">
                                    <label
                                        for="currency-select">Amount</label>
                                    <input type="number"
                                        placeholder="Enter Expense Amount"
                                        class="expense-input" value="${amount}">
                                </div>

                                <div class="form-group">
                                    <label for="category">Category</label>
                                    <select id="category">
                                        <option value="salary" ${category === 'salary' ? 'selected' : ''}>Salary</option>
                                        <option value="freelance" ${category === 'freelance' ? 'selected' : ''}>Freelance</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="expense-frequency">Expense Frequency</label>
                                    <select id="expense-frequency">
                                        <option value="month" ${frequency === 'month' ? 'selected' : ''}>Per Month</option>
                                        <option value="week" ${frequency === 'week' ? 'selected' : ''}>Per Week</option>
                                        <option value="day" ${frequency === 'day' ? 'selected' : ''}>Per Day</option>
                                    </select>
                                </div>
                            </div>
                        </div>
    `;
  expenseWrapper.appendChild(newExpenseRow);
  updateLocalStorage();
}

// Function to remove expense field and update local storage
function removeExpenseField() {
  let expenseWrapper = document.querySelector(".expense-row-wrapper");
  if (expenseWrapper.children.length > 1) {
    expenseWrapper.removeChild(expenseWrapper.lastChild);
    updateLocalStorage();
  }
}

// Function to save data to local storage
function saveDataToLocalStorage() {
  storeIncomeData(); // Collect and save income data
  storeExpenseData(); // Collect and save expense data
  localStorage.setItem('incomeData', JSON.stringify(incomeData));
  localStorage.setItem('expenseData', JSON.stringify(expenseData));
}

// Function to store income data
function storeIncomeData() {
  incomeData = [];
  document.querySelectorAll('.income-row').forEach(row => {
    let amount = row.querySelector('.income-input').value;
    let category = row.querySelector('#category').value;
    let frequency = row.querySelector('#frequency').value;
    if (amount) {
      incomeData.push({ amount, category, frequency });
    }
  });
}

// Function to store expense data
function storeExpenseData() {
  expenseData = [];
  document.querySelectorAll('.expense-row').forEach(row => {
    let amount = row.querySelector('.expense-input').value;
    let category = row.querySelector('#category').value;
    let frequency = row.querySelector('#expense-frequency').value;
    if (amount) {
      expenseData.push({ amount, category, frequency });
    }
  });
}

// Function to load data from local storage
function loadDataFromLocalStorage() {
  let savedIncomeData = JSON.parse(localStorage.getItem('incomeData')) || [];
  let savedExpenseData = JSON.parse(localStorage.getItem('expenseData')) || [];

  savedIncomeData.forEach(data => addIncomeField(data.amount, data.category, data.frequency));
  savedExpenseData.forEach(data => addExpenseField(data.amount, data.category, data.frequency));
}

// Function to update local storage whenever data changes
function updateLocalStorage() {
  saveDataToLocalStorage();
}

// Function to display financial report
function showReport() {
  let incomeInputs = document.querySelectorAll(".income-input");
  let expenseInputs = document.querySelectorAll(".expense-input");
  const incomeFrequency = document.getElementById("frequency").value;
  const expenseFrequency = document.getElementById("expense-frequency").value;

  let totalIncome = 0, totalExpenses = 0;

  incomeInputs.forEach((input) => {
    if (input.value) {
      switch (incomeFrequency) {
        case "month":
          totalIncome += parseFloat(input.value);
          break;
        case "week":
          totalIncome += 4 * parseFloat(input.value);
          break;
        case "day":
          totalIncome += 30 * parseFloat(input.value);
          break;
      }
    }
  });

  expenseInputs.forEach((input) => {
    if (input.value) {
      switch (expenseFrequency) {
        case "month":
          totalExpenses += parseFloat(input.value);
          break;
        case "week":
          totalExpenses += 4 * parseFloat(input.value);
          break;
        case "day":
          totalExpenses += 30 * parseFloat(input.value);
          break;
      }
    }
  });

  let savings = totalIncome - totalExpenses;

  let reportDiv = document.getElementById("financial-report");
  reportDiv.innerHTML = `
    <h3>Financial Report</h3>
    <p>Total Income: $${totalIncome.toFixed(2)}</p>
    <p>Total Expenses: $${totalExpenses.toFixed(2)}</p>
    <p>Savings: $${savings.toFixed(2)}</p>
  `;
  reportDiv.style.display = "block";
}

// Call loadDataFromLocalStorage on page load
window.onload = loadDataFromLocalStorage;