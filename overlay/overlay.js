import { db, ref, onValue } from "../shared/firebase.js";

// ---------- KELLO ----------

function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    document.getElementById("clock").textContent = `${hours}:${minutes}`;
}

updateClock();
setInterval(updateClock, 1000);

// ---------- FIREBASE ----------

const fishRef = ref(db, "fish");

onValue(fishRef, (snapshot) => {

    const fish = snapshot.val();

    if (!fish) return;

    document.getElementById("pike").textContent = fish.pike ?? 0;
    document.getElementById("zander").textContent = fish.zander ?? 0;
    document.getElementById("perch").textContent = fish.perch ?? 0;

});