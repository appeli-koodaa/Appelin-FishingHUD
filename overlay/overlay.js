import { db, ref, onValue } from "../shared/firebase.js";

// ==========================================================
// KELLO
// ==========================================================

function updateClock() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    document.getElementById("clock").textContent = `${hours}:${minutes}`;

}

updateClock();
setInterval(updateClock, 1000);

// ==========================================================
// KALAT
// ==========================================================

onValue(ref(db, "fish"), (snapshot) => {

    if (!snapshot.exists()) return;

    const fish = snapshot.val();

    document.getElementById("pike").textContent = fish.pike ?? 0;
    document.getElementById("zander").textContent = fish.zander ?? 0;
    document.getElementById("perch").textContent = fish.perch ?? 0;

});

// ==========================================================
// SIJAINTI
// ==========================================================

onValue(ref(db, "location"), (snapshot) => {

    if (!snapshot.exists()) return;

    const location = snapshot.val();

    document.getElementById("location").textContent = location.name ?? "-";

});