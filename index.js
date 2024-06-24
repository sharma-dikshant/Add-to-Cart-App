import { dbDetails } from "./credentials/credentials.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const appSettings = dbDetails();

const app = initializeApp(appSettings);
const database = getFirestore(app);
const auth = getAuth();

// Auth elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupButton = document.getElementById("signup-button");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
console.log(logoutButton);

// UI elements
const authContainer = document.getElementById("auth-container");
const inputContainer = document.getElementById("input-container");
const shoppingListContainer = document.getElementById(
  "shopping-list-container"
);
const addBtn = document.getElementById("add-button");
const inputFieldEl = document.getElementById("input-field");
const shoppingListEl = document.getElementById("shopping-list");

// Sign Up
signupButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
    })
    .catch((error) => {
      console.error("Error signing up:", error.message);
    });
  emailInput.value = "";
  passwordInput.value = "";
});

// Log In
loginButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User logged in:", userCredential.user);
    })
    .catch((error) => {
      console.error("Error logging in:", error.message);
    });
  emailInput.value = "";
  passwordInput.value = "";
});

// Auth State Changed
onAuthStateChanged(auth, (user) => {
  if (user) {
    authContainer.style.display = "none";
    inputContainer.style.display = "flex";
    shoppingListContainer.style.display = "block";
    logoutButton.style.display = "block";
    setupUserItems(user.uid);
  } else {
    authContainer.style.display = "flex";
    inputContainer.style.display = "none";
    shoppingListContainer.style.display = "none";
    logoutButton.style.display = "none";
  }
});

// Log Out
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User logged out");
    })
    .catch((error) => {
      console.error("Error logging out:", error.message);
    });
});

// Setup user-specific items
function setupUserItems(uid) {
  const userItemsRef = collection(database, "users", uid, "shoppingList");

  addBtn.addEventListener("click", () => {
    const item = inputFieldEl.value.trim();
    if (item === "") {
      alert("Please enter an item");
      return;
    }
    addDoc(userItemsRef, { item })
      .then(() => {
        console.log("Item added");
        inputFieldEl.value = "";
      })
      .catch((error) => {
        console.error("Error adding item:", error.message);
      });
  });

  const q = query(userItemsRef);
  onSnapshot(q, (snapshot) => {
    shoppingListEl.innerHTML = "";
    snapshot.forEach((doc) => {
      const item = doc.data().item;
      const li = document.createElement("li");
      const itemdetails = document.createElement("span");
      itemdetails.textContent = item;

      //! logic to delete item

      // Create a delete button/icon
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "&#x2716;"; // Unicode for 'multiplication X' symbol
      li.appendChild(itemdetails);
      li.appendChild(deleteButton);

      // Delete item on button click
      deleteButton.addEventListener("click", () => {
        deleteDoc(doc.ref)
          .then(() => {
            console.log("Item deleted");
          })
          .catch((error) => {
            console.error("Error deleting item:", error.message);
          });
      });

      // li.addEventListener("dblclick", () => {
      //   deleteDoc(doc.ref)
      //     .then(() => {
      //       console.log("Item deleted");
      //     })
      //     .catch((error) => {
      //       console.error("Error deleting item:", error.message);
      //     });
      // });
      shoppingListEl.appendChild(li);
    });
  });
}
