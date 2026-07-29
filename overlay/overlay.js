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

onValue(ref(db, "fish"), (snapshot) => {

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
// SÄÄ
// ==========================================================

onValue(ref(db, "weather"), (snapshot) => {

    const weather = snapshot.val();

    if (!weather) return;


    document.getElementById("weather").textContent =
        `${weather.temperature}°C`;

});


// ==========================================================
// SIJAINTI
// ==========================================================

onValue(ref(db, "location"), (snapshot) => {

    const location = snapshot.val();

    if (!location) return;


    if (location.name) {

        document.getElementById("location").textContent =
            location.name;

    }

});


// ==========================================================
// TWITCH KATSOJAT
// ==========================================================

onValue(ref(db, "viewers"), (snapshot) => {

    const viewers = snapshot.val();

    if (viewers === null) return;


    document.getElementById("viewers").textContent =
        viewers;

});