### Project Explaination:
This is a simple add to cart app with firebase authentication and use firebase firestore to store data.  
You can simply sign up here and add items to be purchase from market.  
The main feature of this app is that you can share this email and password with your family member to keep in sync the item to be purchase.  
You can delete items which you have purchased.
### preview:

<img src="./assets/screenshots/WhatsApp Image 2024-06-24 at 09.06.11_1e623a44.jpg"></img>
### Project Workflow:
The project can be break into following steps:  
*Step-0* Set up Firebase Project.  
*Step-1* Set up Firebase Authetication.  
*Step-2* HTML Structure.  
*Step-3* Initializing firebase and importing firebase functions into our projects.  
*Step-4* Implementing user sign up and Login.  
*Step-5* Handling user state change.  
*Step-6* Logout.  
*Step-7* Add items to Firestore.  
*Step-8* Loading user specific content.  
*Step-9* Implementing delete functionality.  

## *Step-0* Set up Firebase Project.
*Step-1* Go to [firebase](firebase.google.com).  
*Step-2* Create an account if not.  
*Step-3* Then click on Go to console.  
*Step-4* Click on Add Project.  
*Step-5* Enter Project Name and click on Create Project.  
*Optional* Disable Google Analytics.
*Step-6* Click on Continue.  
*Step-7* Click on Create Project.  
*Step-8* Click on Continue.  
*Step-9* Create web app by clicking on web button.  
*Step-10* Copy the firebase config which we use to initialize firebase in our project.  
**You're Firebase Project Setup is done**

## *Step-1* Set up Firebase Authetication.
Now, to enable firebase authentication  
*Step-1* Go to console.  
*Step-2* Click on your project.  
*Step-3* Click on build in sidebar.
*Step-4* Click on Authentication.  
*Step-5* Click on Sign-in method.  
*Step-6* Enable Email/Password.  
*Step-7* Click on Save.  
**Firebase Authetication is done.**

## *Step-2* HTML Structure.
-   ```html
    <script src="./credentials/credentials.js" type="module"></script>
    <script src="index.js" type="module"></script>
    ```
    import these scripts with `type="module"`

## *Step-3* Initializing firebase and importing firebase functions into our projects.
*Step-1* Create a folder `credentials` inside it create a file `credentials.js` in this we store our firebase credentials.  
```javascript 
export function dbDetails() {
  return {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGE_SENDER_ID",
    appId: "YOUR_APPID",
  };
}
```
*Step-2* Copy the firebase config which we use to initialize firebase in our project and paste.  
*Step-4* Create a file `index.js`.  
*Step-5* import `dbdetails` functions from `credentials.js`.
```javascript  
import { dbDetails } from "./credentials/credentials.js";
```  
```javascript 

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

```
*Step-6* Import `initializeApp` from `https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js`.  
*Step-7* Import  `getDatabase`, `ref`,
  `push`,
  `onValue`,
  `remove`, from `https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js`.  
*Step-8* Import `getAuth`,
  `createUserWithEmailAndPassword`,
  `signInWithEmailAndPassword`,
  `signOut`,
  `onAuthStateChanged`, from `https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js`.  
*Step-9* Import `getFirestore`,
  `collection`,
  `addDoc`,
  `query`,
  `where`,
  `onSnapshot`,
  `deleteDoc`,
  `doc`, from `https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js`.  

```javascript
const appSettings = dbDetails();
```
`dbDetails` return the our firebase config which will store in `appSettings`.

*Step-10* Now intiailize our firebase `app` using `initializeApp` which takes firebase config as parameter.

```javascript 
const app = initialiseApp(appSettings);
```

*Step-11* Now we will create our `auth` instance using `getAuth` which
takes `app` as parameter.
```javascript
const auth = getAuth();
```
*Step-12* Now we will create our `firestore` instance using `getFirestore`
which takes `app` as parameter.
```javascript
const database = getFirestore(app);
```

## *Step-4* Implementing user sign up and Login.

*Step-1* Sign Up
```javascript
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
```
As soon as sign up button is pressed the value of `emailInput` and `passwordInput` will get stored in `email` and `password`. Now, `createUserWithEmailAndPassword` function is used to create user account into our app. It takes three parameter - the authentication instance `auth`, `email`, `password`. It returns a promise.  

*Step-2* Login  
```javascript
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
```
As soon as login button is pressed the value of `emailInput` and `passwordInput` will
get stored in `email` and `password`. Now, `signInWithEmailAndPassword` function is used to
login user into our app. It takes three parameter - the authentication instance `auth`, `email`,
`password`. It returns a promise.
If login credentials is correct then it logged in otherwise, it will through an error.
## *Step-5* Handling user state change.

```javascript
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
```
As soon as user logged in or logged out, the `onAuthStateChanged` function is called.
It takes two parameter - the authentication instance `auth`, `user`. It returns a function.
The function takes one parameter - `user`. If user is logged in then it will display the
`inputContainer`, `shoppingListContainer` and `logoutButton`. Otherwise, it will display the
`authContainer`
## *Step-6* Logout
```javascript
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User logged out");
    })
    .catch((error) => {
      console.error("Error logging out:", error.message);
    });
});
```
As soon as logout button is pressed the `signOut` function is called. It takes one parameter
the authentication instance `auth`. It returns a promise. If user logged out then it will
display the `authContainer` and hide the `inputContainer`, `shoppingListContainer` and `
logoutButton` which is done by previous step i.e. user state handler.


## *Step-7* Add items to Firestore.
```javascript
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
```
`setupUserItems()` is called when user logged in. This function takes one parameter `uid` which is user id of logged in user. 
-   ```javascript
    const userItemsRef = collection(database, "users", uid,      "shoppingList");
    ```
    It creates a reference to the collection `shoppingList` under the user id `uid`  

-   ```javascript
    addDoc(userItemsRef, { item })
      .then(() => {
        console.log("Item added");
        inputFieldEl.value = "";
      })
      .catch((error) => {
        console.error("Error adding item:", error.message);
      });
    ```
    It adds the item to the collection `shoppingList` under the user id `uid` and if item is added then it will display the message "Item added" and clear the input field.

## *Step-8* Loading user specific content.

```javascript
const q = query(userItemsRef);
  onSnapshot(q, (snapshot) => {
    shoppingListEl.innerHTML = "";
    snapshot.forEach((doc) => {
      const item = doc.data().item;
      const li = document.createElement("li");
      const itemdetails = document.createElement("span");
      itemdetails.textContent = item;
```


## *Step-9* Implementing delete functionality.
```javascript
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
       shoppingListEl.appendChild(li);
    });
  });
```
`deleteDoc()` takes parameter `doc.ref` and return a promise.




