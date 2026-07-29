// Firebase Appelin FishingHUD
// shared/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC2la2tsFUZ1adgK2QfcgjZoF4W0fgAyBY",
    authDomain: "appelin-fishinghud.firebaseapp.com",
    databaseURL: "https://appelin-fishinghud-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "appelin-fishinghud",
    storageBucket: "appelin-fishinghud.firebasestorage.app",
    messagingSenderId: "594403353007",
    appId: "1:594403353007:web:57fc6f24a7b28826abcf5a",
    measurementId: "G-BZ7KDTTX6C"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export {
    ref,
    set,
    get,
    onValue
};