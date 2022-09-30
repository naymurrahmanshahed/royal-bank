"use strict";

/////////////////////////////////////////////////////////////
// Data
/////////////////////////////////////////////////////////////

const accounts = [
  {
    owner: "Naymur Rahman",
    movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
    interestRate: 1.5, // %
    password: 1234,
    movementsDates: [
      "2021-11-18T21:31:17.178Z",
      "2021-12-23T07:42:02.383Z",
      "2022-01-28T09:15:04.904Z",
      "2022-04-01T10:17:24.185Z",
      "2022-07-08T14:11:59.604Z",
      "2022-09-21T17:01:17.194Z",
      "2022-09-26T23:36:17.929Z",
      "2022-09-27T12:51:31.398Z",
      "2022-09-29T06:41:26.190Z",
      "2022-09-30T08:11:36.678Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Ayesha Akter",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850],
    interestRate: 1.3, // %
    password: 5678,
    movementsDates: [
      "2021-12-11T21:31:17.671Z",
      "2021-12-27T07:42:02.184Z",
      "2022-01-05T09:15:04.805Z",
      "2022-02-14T10:17:24.687Z",
      "2022-03-12T14:11:59.203Z",
      "2022-05-21T17:01:17.392Z",
      "2022-08-26T23:36:17.522Z",
      "2022-09-28T12:51:31.491Z",
      "2022-09-29T06:41:26.394Z",
      "2022-09-30T08:11:36.276Z",
    ],
    currency: "EUR",
    locale: "en-GB",
  },
];

////////////////////////////////////////////////////////
// Element
////////////////////////////////////////////////////////
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelbalance = document.querySelector(".balance-value");
const labelIn = document.querySelector(".summary-value-in");
const labelOut = document.querySelector(".summary-value-out");
const labelInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const inputLoginUsername = document.querySelector(".login-username");
const inputLoginPassword = document.querySelector(".login-password");
const inputTransferAccount = document.querySelector(".form-input-account");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");

const btnLogin = document.querySelector(".login-btn");
const btnSort = document.querySelector(".btn-sort");
const btnTransfer = document.querySelector(".btn-transfer");
const btnLoan = document.querySelector(".btn-loan");
const btnClose = document.querySelector(".btn-close");

function displayCurrentAccount(currentAccount) {
  displayMovements(currentAccount);
  displayBalance(currentAccount);
  displaySummary(currentAccount);
}
createUsername(accounts);

//create username

function createUsername(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word.at(0))
      .join("");
  });
}
let currentAccount, timer;

////////////////////////////////////////////////////////////////////////////////////////////////////
///Login Account
////////////////////////////////////////////////////////////////////////////////////////////////////

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount?.password === Number(inputLoginPassword.value)) {
    setTimeout(() => {
      //display ui and welcome
      labelWelcome.textContent = `Wellcome back, ${currentAccount.owner
        .split(" ")
        .at(0)} `;
      containerApp.style.opacity = "1";

      //display date and time
      const now = new Date();
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(now);
      //log out timer
      if (timer) clearInterval(timer);
      timer = logOut();

      //update ui
      displayCurrentAccount(currentAccount);
    }, 3000);
  } else {
    setTimeout(() => {
      labelWelcome.textContent = "Login Failed🙁";
    }, 3000);
  }

  // clear flieds
  inputLoginUsername.value = "";
  inputLoginPassword.value = "";
  inputLoginPassword.blur();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//days calculation
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function formatMoveDate(date, locale) {
  const calculateDays = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));

  const daysPassed = calculateDays(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function displayMovements(account, sorted = false) {
  containerMovements.innerHTML = "";
  console.log(account);
  const moves = sorted
    ? account.movements.slice(0).sort((a, b) => a - b)
    : account.movements;

  moves.forEach((move, i) => {
    const currencyformatter = formattingCurrency(
      move,
      account.locale,
      account.currency
    );

    const type = move > 0 ? "deposit" : "withdrawal";
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMoveDate(date, account.locale);
    const innerMovement = `
    
    <div class="movements-row">
      <div class="movements-type movements-type-${type}"> ${i + 1} ${type}</div>
        <div class="movement-date">${displayDate}</div>
          <div class="movement-value">${currencyformatter}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", innerMovement);
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//format currency
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function formattingCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////
/// Display Balance
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayBalance(account) {
  const currentBalance = account.movements;
  account.currentBalance = currentBalance.reduce((acc, move) => acc + move, 0);
  labelbalance.textContent = formattingCurrency(
    account.currentBalance,
    account.locale,
    account.currency
  );
}

//////////////////////////////////////////////////////////////////////////////////////////
///Display Summary
//////////////////////////////////////////////////////////////////////////////////////////

function displaySummary(account) {
  const moves = account.movements;

  ///////////////// Income///////////////////////////
  const totalIncome = moves
    .filter((move) => move > 0 ?? move)
    .reduce((acc, move) => acc + move, 0);

  labelIn.textContent = "";
  //disply income
  labelIn.textContent = formattingCurrency(
    totalIncome,
    account.locale,
    account.currency
  );

  //////////////////Outcome////////////////////////////
  const totalOutcome = moves
    .filter((move) => move < 0 ?? move)
    .reduce((acc, outcome) => acc + outcome, 0);

  labelOut.textContent = "";
  //display outcome
  labelOut.textContent = formattingCurrency(
    Math.abs(totalOutcome),
    account.locale,
    account.currency
  );

  //////////////////Interest////////////////////////////
  const totalInterest = moves
    .filter((move) => move > 0 ?? move)
    .map((interest) => (interest * account.interestRate) / 100)
    .filter((interest) => interest >= 1 ?? interest)
    .reduce((acc, interest) => acc + interest, 0);

  labelInterest.textContent = formattingCurrency(
    totalInterest,
    account.locale,
    account.currency
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///sorted
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let isSorted;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
///Transfer Balance
///////////////////////////////////////////////////////////////////////////////////////////////////////

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const recieverAccount = accounts.find(
    (account) => account.username === inputTransferAccount.value
  );
  const amount = Number(inputTransferAmount.value);

  // clear fields
  inputTransferAccount.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    amount <= currentAccount.currentBalance &&
    recieverAccount.username !== currentAccount.username &&
    recieverAccount
  ) {
    setTimeout(() => {
      // transfer money
      currentAccount.movements.push(-amount);
      recieverAccount.movements.push(amount);
      // Add transfer date and time
      currentAccount.movementsDates.push(new Date().toISOString());
      recieverAccount.movementsDates.push(new Date().toISOString());
      //message
      labelWelcome.textContent = "Transaction successfully";

      // Update UI
      displayCurrentAccount(currentAccount);
    }, 3000);
    //log out timer
    if (timer) clearInterval(timer);
    timer = logOut();
  } else {
    setTimeout(() => {
      //message
      labelWelcome.textContent = "Transaction failed";
    }, 3000);
    //log out timer
    if (timer) clearInterval(timer);
    timer = logOut();
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
///Loan
///////////////////////////////////////////////////////////////////////////////////////////////////////

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  const currents = currentAccount.movements.some(
    (move) => move >= amount * 0.1
  );
  console.log(currents);
  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    setTimeout(() => {
      //Add positive movement into current account
      currentAccount.movements.push(amount);

      // Add loan time and date
      currentAccount.movementsDates.push(new Date().toISOString());
      //message
      labelWelcome.textContent = "Loan Added";

      // UpdateUI
      displayCurrentAccount(currentAccount);

      // Clear

      inputLoanAmount.value = "";
    }, 3000);
    //log out timer
    if (timer) clearInterval(timer);
    timer = logOut();
  } else {
    setTimeout(() => {
      //message
      labelWelcome.textContent = "Loan Not Added";
    }, 3000);
    //log out timer
    if (timer) clearInterval(timer);
    timer = logOut();
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

///////////////////////////////
//Delete Account
///////////////////////////////

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.password === Number(inputClosePassword.value)
  ) {
    const index = accounts.findIndex(
      (account) => account.userName === currentAccount.userName
    );
    setTimeout(() => {
      // delete
      accounts.splice(index, 1);

      // hide ui
      containerApp.style.opacity = 0;

      // sms
      labelWelcome.textContent = "account deleted";
    }, 3000);
    //log out timer
    if (timer) clearInterval(timer);
    timer = logOut();
  } else {
    setTimeout(() => {
      labelWelcome.textContent = "delete can not be done";
    }, 3000);
    //log out timer
    if (timer) clearInterval(timer);
    timer = logOut();
  }

  // clear fileds
  inputCloseUsername.value = "";
  inputClosePassword.value = "";
  inputClosePassword.blur();
});
console.log(accounts);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//timer
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function logOut() {
  labelTimer.textContent = "";
  let time = 120;
  const clock = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "You've been logged out!";
      containerApp.style.opacity = 0;
    }
    time--;
  };
  clock();

  timer = setInterval(clock, 1000);
  return timer;
}
