// ==========================================================
// APPELIN FISHINGHUD
// ADMIN.JS
// ==========================================================

import { db, ref, set, onValue } from "../shared/firebase.js";

let fish = {
    pike: 0,
    zander: 0,
    perch: 0
};

// ==========================================================
// Päivitä näkymä
// ==========================================================

function updateDisplay() {

    document.getElementById("pikeCount").textContent = fish.pike;
    document.getElementById("zanderCount").textContent = fish.zander;
    document.getElementById("perchCount").textContent = fish.perch;

}

// ==========================================================
// Kuuntele kaloja
// ==========================================================

onValue(ref(db, "fish"), (snapshot) => {

    if (!snapshot.exists()) return;

    fish = snapshot.val();

    updateDisplay();

});

// ==========================================================
// Kuuntele sijaintia
// ==========================================================

onValue(ref(db, "location"), (snapshot) => {

    if (!snapshot.exists()) return;

    const location = snapshot.val();

    document.getElementById("locationInput").value = location.name ?? "";

});

// ==========================================================
// Tallenna kalat
// ==========================================================

async function saveFish() {

    await set(ref(db, "fish"), fish);

}

// ==========================================================
// Tallenna sijainti
// ==========================================================

async function saveLocation() {

    const name = document.getElementById("locationInput").value.trim();

    await set(ref(db, "location"), {
        name
    });

}

// ==========================================================
// Kevyt värinä
// ==========================================================

function vibrate() {

    if (navigator.vibrate) {
        navigator.vibrate(20);
    }

}

// ==========================================================
// Hauki
// ==========================================================

document.getElementById("pikePlus").onclick = async () => {

    fish.pike++;

    await saveFish();

    vibrate();

};

document.getElementById("pikeMinus").onclick = async () => {

    if (fish.pike === 0) return;

    fish.pike--;

    await saveFish();

    vibrate();

};

// ==========================================================
// Kuha
// ==========================================================

document.getElementById("zanderPlus").onclick = async () => {

    fish.zander++;

    await saveFish();

    vibrate();

};

document.getElementById("zanderMinus").onclick = async () => {

    if (fish.zander === 0) return;

    fish.zander--;

    await saveFish();

    vibrate();

};

// ==========================================================
// Ahven
// ==========================================================

document.getElementById("perchPlus").onclick = async () => {

    fish.perch++;

    await saveFish();

    vibrate();

};

document.getElementById("perchMinus").onclick = async () => {

    if (fish.perch === 0) return;

    fish.perch--;

    await saveFish();

    vibrate();

};

// ==========================================================
// Sijainti
// ==========================================================

document.getElementById("locationSave").onclick = async () => {

    await saveLocation();

    vibrate();

};

// ==========================================================
// Reset
// ==========================================================

document.getElementById("resetButton").onclick = async () => {

    if (!confirm("Haluatko varmasti nollata saaliin?")) return;

    fish = {
        pike: 0,
        zander: 0,
        perch: 0
    };

    await saveFish();

    vibrate();

};