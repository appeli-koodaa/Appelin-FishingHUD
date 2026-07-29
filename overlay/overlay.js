// ==========================================================
// APPELIN FISHINGHUD
// OVERLAY.JS
// ==========================================================

import { db, ref, onValue } from "../shared/firebase.js";


// ==========================================================
// KELLO
// ==========================================================

function updateClock() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    document.getElementById("clock").textContent =
        `${hours}:${minutes}`;

}

updateClock();

setInterval(updateClock, 1000);


// ==========================================================
// KALAT
// ==========================================================

const fishRef = ref(db, "fish");

onValue(fishRef, (snapshot) => {

    const fish = snapshot.val();

    if (!fish) return;

    document.getElementById("pike").textContent =
        fish.pike ?? 0;

    document.getElementById("zander").textContent =
        fish.zander ?? 0;

    document.getElementById("perch").textContent =
        fish.perch ?? 0;

});


// ==========================================================
// LÄMPÖTILA
// ==========================================================

const weatherRef = ref(db, "weather");

onValue(weatherRef, (snapshot) => {

    const weather = snapshot.val();

    if (!weather) return;

    document.getElementById("weather").textContent =
        `${weather.temperature}°C`;

});


// ==========================================================
// SIJAINTI
// ==========================================================

const locationRef = ref(db, "location");

onValue(locationRef, (snapshot) => {

    const location = snapshot.val();

    if (!location) return;

    if (location.name) {

        document.getElementById("location").textContent =
            location.name;

    }

});