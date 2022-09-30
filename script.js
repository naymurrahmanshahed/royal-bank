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
      "2022-09-10T17:01:17.194Z",
      "2022-09-12T23:36:17.929Z",
      "2022-09-15T12:51:31.398Z",
      "2022-09-19T06:41:26.190Z",
      "2022-09-21T08:11:36.678Z",
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
      "2022-05-16T17:01:17.392Z",
      "2022-08-10T23:36:17.522Z",
      "2022-09-03T12:51:31.491Z",
      "2022-09-18T06:41:26.394Z",
      "2022-09-21T08:11:36.276Z",
    ],
    currency: "EUR",
    locale: "en-GB",
  },
];

////////////////////////////////////////////////////////
// Element
////////////////////////////////////////////////////////
const labelWelcome = document.querySelector(".welcome");
const labelbalance = document.querySelector(".balance-value");
const labelIn = document.querySelector(".summary-value-in");
const labelOut = document.querySelector(".summary-value-out");
const labelInterest = document.querySelector(".summary-value-interest");

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
let currentAccount;

////////////////////////////////////////////////////////////////////////////////////////////////////
///Login Account
////////////////////////////////////////////////////////////////////////////////////////////////////

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount?.password === Number(inputLoginPassword.value)) {
    labelWelcome.textContent = `Wellcome back, ${currentAccount.owner
      .split(" ")
      .at(0)} `;
    containerApp.style.opacity = "1";
  } else {
    labelWelcome.textContent = "Login Failed🙁";
  }

  // clear flieds
  inputLoginUsername.value = "";
  inputLoginPassword.value = "";
  inputLoginPassword.blur();

  displayCurrentAccount(currentAccount);
});

///Display movements
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayMovements(account) {
  containerMovements.innerHTML = "";
  console.log(account);
  const moves = account.movements;
  moves.forEach((move, i) => {
    const type = move > 0 ? "deposit" : "withdrawal";
    const innerMovement = `
    <div class="movements-row">
      <div class="movements-type movements-type-${type}"> ${i + 1} ${type}</div>
        <div class="movement-date">2 Days ago</div>
          <div class="movement-value">${move}$</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", innerMovement);
  });
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////
/// Display Balance
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayBalance(account) {
  const currentBalance = account.movements;
  account.currentBalance = currentBalance.reduce((acc, move) => acc + move, 0);
  labelbalance.textContent = `${account.currentBalance}$`;
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
  labelIn.textContent = `${totalIncome}$`;

  //////////////////Outcome////////////////////////////
  const totalOutcome = moves
    .filter((move) => move < 0 ?? move)
    .reduce((acc, outcome) => acc + outcome, 0);

  labelOut.textContent = "";
  //display outcome
  labelOut.textContent = `${Math.abs(totalOutcome)}$`;

  //////////////////Interest////////////////////////////
  const totalInterest = moves
    .filter((move) => move > 0 ?? move)
    .map((interest) => (interest * account.interestRate) / 100)
    .filter((interest) => interest >= 1 ?? interest)
    .reduce((acc, interest) => acc + interest, 0);

  labelInterest.textContent = `${totalInterest}$`;
}

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
    // transfer money
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    //message
    labelWelcome.textContent = "Transaction successfully";

    // Update UI
    displayCurrentAccount(currentAccount);
  } else {
    //message
    labelWelcome.textContent = "Transaction failed";
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
///Loan
///////////////////////////////////////////////////////////////////////////////////////////////////////

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    //Add positive movement into current account
    currentAccount.movements.push(amount);

    //message
    labelWelcome.textContent = "Loan Added";
    // UpdateUI
    displayCurrentAccount(currentAccount);

    // Clear

    inputLoanAmount.value = "";
  } else {
    //message
    labelWelcome.textContent = "Loan Not Added";
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

    // delete
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;

    // sms
    labelWelcome.textContent = "account deleted";
  } else {
    labelWelcome.textContent = "delete can not be done";
  }

  // clear fileds
  inputCloseUsername.value = inputClosePassword.value = "";
  inputClosePassword.blur();
});
console.log(accounts);
