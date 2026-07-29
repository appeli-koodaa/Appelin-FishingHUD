// ==========================================================
// APPELIN FISHINGHUD
// ADMIN.JS
// ==========================================================

import { db, ref, set, get } from "../shared/firebase.js";

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
// Lataa kalat Firebasesta
// ==========================================================

async function loadFish() {

    try {

        const snapshot = await get(ref(db, "fish"));

        if (snapshot.exists()) {
            fish = snapshot.val();
        }

        updateDisplay();

    } catch (error) {

        console.error("Virhe ladattaessa kaloja:", error);

    }

}

// ==========================================================
// Tallenna Firebasean
// ==========================================================

async function saveFish() {

    try {

        await set(ref(db, "fish"), fish);

    } catch (error) {

        console.error("Virhe tallennettaessa kaloja:", error);

    }

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

    updateDisplay();
    await saveFish();
    vibrate();

};

document.getElementById("pikeMinus").onclick = async () => {

    if (fish.pike > 0) {

        fish.pike--;

        updateDisplay();
        await saveFish();
        vibrate();

    }

};

// ==========================================================
// Kuha
// ==========================================================

document.getElementById("zanderPlus").onclick = async () => {

    fish.zander++;

    updateDisplay();
    await saveFish();
    vibrate();

};

document.getElementById("zanderMinus").onclick = async () => {

    if (fish.zander > 0) {

        fish.zander--;

        updateDisplay();
        await saveFish();
        vibrate();

    }

};

// ==========================================================
// Ahven
// ==========================================================

document.getElementById("perchPlus").onclick = async () => {

    fish.perch++;

    updateDisplay();
    await saveFish();
    vibrate();

};

document.getElementById("perchMinus").onclick = async () => {

    if (fish.perch > 0) {

        fish.perch--;

        updateDisplay();
        await saveFish();
        vibrate();

    }

};

// ==========================================================
// Reset
// ==========================================================

document.getElementById("resetButton").onclick = async () => {

    const ok = confirm("Haluatko varmasti nollata saaliin?");

    if (!ok) return;

    fish = {
        pike: 0,
        zander: 0,
        perch: 0
    };

    updateDisplay();
    await saveFish();
    vibrate();

};

// ==========================================================
// Käynnistys
// ==========================================================

loadFish();