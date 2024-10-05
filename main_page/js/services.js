if (!localStorage.getItem("current_user")) {
  window.location.href = "../auth_check";
}
let current_user = localStorage.getItem("current_user");
console.log(current_user);

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
      toCurrency.appendChild(option);
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

// Event listener for the Save button
document
  .getElementById("save-btn")
  .addEventListener("click", saveDataToLocalStorage);

// Function to add income field and update local storage
function addIncomeField(amount = "", category = "salary", frequency = "month") {
  let incomeWrapper = document.querySelector(".income-row-wrapper");
  let newIncomeRow = document.createElement("div");
  newIncomeRow.classList.add("income-row");
  newIncomeRow.innerHTML = `
        <div class="converter-row budget-content">
            <div class="income-row" style="margin-left: -0.001vw;">
                <div class="form-group">
                    <label for="currency-select">Amount</label>
                    <input type="number" placeholder="Enter Income Amount" class="income-input" value="${amount}">
                </div>

                <div class="form-group">
                    <label for="category">Category</label>
                    <select class="category"> 
                        <option value="salary" ${
                          frequency === "salary" ? "selected" : ""
                        }>Salary</option>
                        <option value="freelance" ${
                          frequency === "freelance" ? "selected" : ""
                        }>Freelance</option>
                        <option value="business" ${
                          frequency === "business" ? "selected" : ""
                        }>Business</option>
                        <option value="investment" ${
                          frequency === "investment" ? "selected" : ""
                        }>Investment </option>
                        <option value="rental-income" ${
                          frequency === "rental-income" ? "selected" : ""
                        }>Rental Income</option>
                        <option value="commission " ${
                          frequency === "commission" ? "selected" : ""
                        }>Commission</option>
                        <option value="interest-income" ${
                          frequency === "interest-income" ? "selected" : ""
                        }>Interest Income</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="frequency">Income Frequency</label>
                    <select class="income-frequency">
                        <option value="month" ${
                          frequency === "month" ? "selected" : ""
                        }>Per Month</option>
                        <option value="week" ${
                          frequency === "week" ? "selected" : ""
                        }>Per Week</option>
                        <option value="day" ${
                          frequency === "day" ? "selected" : ""
                        }>Per Day</option>
                    </select>
                </div>
            </div>
        </div>
    `;
  newIncomeRow.style.marginTop = "-3vh";
  incomeWrapper.appendChild(newIncomeRow);
}

// Function to remove income field and update local storage
function removeIncomeField() {
  let incomeWrapper = document.querySelector(".income-row-wrapper");
  if (incomeWrapper.children.length > 1) {
    incomeWrapper.removeChild(incomeWrapper.lastChild);
  }
}

// Function to add expense field
function addExpenseField(
  amount = "",
  category = "salary",
  frequency = "month"
) {
  let expenseWrapper = document.querySelector(".expense-row-wrapper");
  let newExpenseRow = document.createElement("div");
  newExpenseRow.classList.add("expense-row");
  newExpenseRow.innerHTML = `
        <div class="converter-row budget-content">
            <div class="expense-row" style="margin-left: -0.1vw;">
                <div class="form-group">
                    <label for="currency-select">Amount</label>
                    <input type="number" placeholder="Enter Expense Amount" class="expense-input" value="${amount}">
                </div>

                <div class="form-group">
                    <label for="category">Category</label>
                    <select class="category">
                        <option value="groceries">Groceries</option>
                        <option value="housing">Housing</option>
                        <option value="utilities">Utilities</option>
                        <option value="transportation">Transportation</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="expense-frequency">Expense Frequency</label>
                    <select class="expense-frequency">
                        <option value="month" ${
                          frequency === "month" ? "selected" : ""
                        }>Per Month</option>
                        <option value="week" ${
                          frequency === "week" ? "selected" : ""
                        }>Per Week</option>
                        <option value="day" ${
                          frequency === "day" ? "selected" : ""
                        }>Per Day</option>
                    </select>
                </div>
            </div>
        </div>
    `;
  expenseWrapper.appendChild(newExpenseRow);
}

// Function to remove expense field and update local storage
function removeExpenseField() {
  let expenseWrapper = document.querySelector(".expense-row-wrapper");
  if (expenseWrapper.children.length > 1) {
    expenseWrapper.removeChild(expenseWrapper.lastChild);
  }
}

// Function to save data to local storage
function saveDataToLocalStorage() {
  incomeData = []; // Clear existing data
  expenseData = [];

  storeIncomeData(); // Collect and save income data
  storeExpenseData(); // Collect and save expense data

  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  localStorage.setItem("expenseData", JSON.stringify(expenseData));
}

// Function to store income data
function storeIncomeData() {
  incomeData = [];
  document.querySelectorAll(".income-row").forEach((row) => {
    let amount = row.querySelector(".income-input").value;
    let category = row.querySelector(".category").value; // Updated selector to class
    let frequency = row.querySelector(".income-frequency").value;
    if (amount) {
      incomeData.push({ amount, category, frequency, current_user });
    }
  });
}

// Function to store expense data
function storeExpenseData() {
  expenseData = [];
  document.querySelectorAll(".expense-row").forEach((row) => {
    let amount = row.querySelector(".expense-input").value;
    let category = row.querySelector(".category").value; // Updated selector to class
    let frequency = row.querySelector(".expense-frequency").value;
    if (amount) {
      expenseData.push({ amount, category, frequency, current_user });
    }
  });
}

// Function to load data from local storage
function loadDataFromLocalStorage() {
  let savedIncomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
  let savedExpenseData = JSON.parse(localStorage.getItem("expenseData")) || [];

  let filteredIncomeData = savedIncomeData.filter(
    (data) => data.current_user === current_user
  );
  let filteredExpenseData = savedExpenseData.filter(
    (data) => data.current_user === current_user
  );

  filteredIncomeData.forEach((data) =>
    addIncomeField(data.amount, data.category, data.frequency)
  );

  filteredExpenseData.forEach((data) =>
    addExpenseField(data.amount, data.category, data.frequency)
  );
}

// Function to display financial report and draw the circle
function showReport() {
  let incomeInputs = document.querySelectorAll(".income-input");
  let expenseInputs = document.querySelectorAll(".expense-input");
  let incomeFrequencies = document.querySelectorAll(".income-frequency");
  let expenseFrequencies = document.querySelectorAll(".expense-frequency");

  let totalIncome = 0,
    totalExpenses = 0;

  incomeInputs.forEach((input, index) => {
    if (input.value) {
      let value = parseFloat(input.value);
      let frequency = incomeFrequencies[index].value;
      switch (frequency) {
        case "month":
          totalIncome += value;
          break;
        case "week":
          totalIncome += value * 4; // Convert weekly to monthly
          break;
        case "day":
          totalIncome += value * 30; // Convert daily to monthly
          break;
      }
    }
  });

  expenseInputs.forEach((input, index) => {
    if (input.value) {
      let value = parseFloat(input.value);
      let frequency = expenseFrequencies[index].value;
      switch (frequency) {
        case "month":
          totalExpenses += value;
          break;
        case "week":
          totalExpenses += value * 4; // Convert weekly to monthly
          break;
        case "day":
          totalExpenses += value * 30; // Convert daily to monthly
          break;
      }
    }
  });

  let savings = totalIncome - totalExpenses;

  if (totalIncome === 0) {
    alert("Total income cannot be zero.");
    return;
  }

  document.getElementById("total-income").innerText = totalIncome.toFixed(2);
  document.getElementById("total-expenses").innerText =
    totalExpenses.toFixed(2);
  document.getElementById("savings").innerText = savings.toFixed(2);

  let reportDiv = document.getElementById("financial-report");
  reportDiv.style.display = "flex";

  drawFinancialCircle(totalIncome, totalExpenses, savings);
}

// Function to draw the circle with animation
function drawFinancialCircle(totalIncome, totalExpenses, savings) {
  let canvas = document.getElementById("financial-circle");
  let ctx = canvas.getContext("2d");
  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  let radius = 80;
  let lineWidth = 20;

  // Clear the canvas before drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Total Income (full circle background)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = "#0f9d58"; // Light color representing total income
  ctx.stroke();

  // Calculate the angles for expenses and savings
  let expenseAngle = (totalExpenses / totalIncome) * 2 * Math.PI;
  let savingsAngle = (savings / totalIncome) * 2 * Math.PI;

  let startAngle = -Math.PI / 2;

  // Animate Expenses
  let currentExpenseAngle = 0;
  let expenseAnimation = setInterval(() => {
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      radius,
      startAngle,
      startAngle + currentExpenseAngle
    );
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#db4437"; // Red for expenses
    ctx.stroke();

    currentExpenseAngle += 0.01; // Increase the angle gradually
    if (currentExpenseAngle >= expenseAngle) {
      clearInterval(expenseAnimation);
      animateSavings(
        startAngle + currentExpenseAngle,
        savingsAngle,
        centerX,
        centerY,
        radius,
        lineWidth,
        ctx,
        totalIncome // Pass totalIncome as a parameter
      );
    }
  }, 10);
}

function animateSavings(
  startAngle,
  savingsAngle,
  centerX,
  centerY,
  radius,
  lineWidth,
  ctx,
  totalIncome // Accept totalIncome as a parameter
) {
  let currentSavingsAngle = 0;
  let savingsAnimation = setInterval(() => {
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      radius,
      startAngle,
      startAngle + currentSavingsAngle
    );
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#0f9d58"; // Green for savings
    ctx.stroke();

    currentSavingsAngle += 0.01; // Increase the angle gradually
    if (currentSavingsAngle >= savingsAngle) {
      clearInterval(savingsAnimation);
      displayTotalIncome(centerX, centerY, totalIncome, ctx); // totalIncome is now defined
    }
  }, 10);
}

function displayTotalIncome(centerX, centerY, totalIncome, ctx) {
  // Display total income in the center of the circle
  ctx.font = "bold 20px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${totalIncome.toFixed(2)}`, centerX, centerY);
}

// Load data when the page is loaded
document.addEventListener("DOMContentLoaded", loadDataFromLocalStorage);
