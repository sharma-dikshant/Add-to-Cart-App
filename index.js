import { dbDetails } from "./credentials/credentials.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = dbDetails();

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const addBtn = document.getElementById("add-button");
const inputFieldEl = document.getElementById("input-field");
const shoppingListEl = document.getElementById("shopping-list");

addBtn.addEventListener("click", () => {
  const item = inputFieldEl.value.trim();
  if(item === ''){
    alert('Please enter an item');
    return;
  }
  push(shoppingListInDB, item);
  console.log(item);
  clearInputField();
  // appendNewItem(item);
});

onValue(shoppingListInDB, (snapshot) => {
  // const shoppingListArr = Object.values(snapshot.val());
  if (snapshot.exists()) {
    const shoppingListArr = Object.entries(snapshot.val());

    clearShoppingList();
    for (let i = 0; i < shoppingListArr.length; i++) {
      let currentItem = shoppingListArr[i];

      appendNewItem(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = `<li>No Items</li>`;
  }
});

function clearInputField() {
  inputFieldEl.value = "";
}

function clearShoppingList() {
  shoppingListEl.innerHTML = "";
}

function appendNewItem(currentItem) {
  let currentItemID = currentItem[0];
  let currentItemValue = currentItem[1];

  let newItem = document.createElement("li");
  newItem.innerText = currentItemValue;
  shoppingListEl.append(newItem);

  newItem.addEventListener("dblclick", () => {
    console.log(currentItemID);

    let exactLocationOfItemInDB = ref(
      database,
      `shoppingList/${currentItemID}`
    );

    remove(exactLocationOfItemInDB);
  });
}

