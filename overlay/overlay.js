// ==========================================================
// APPELIN FISHINGHUD 2.0.3 - OVERLAY.JS
// ==========================================================
import { db, ref, onValue } from "../shared/firebase.js";

const speciesConfig = {
    pike: { label: "Hauki" },
    zander: { label: "Kuha" },
    perch: { label: "Ahven" }
};

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("clock").textContent = `${hours}:${minutes}`;
}
updateClock();
setInterval(updateClock, 1000);

onValue(ref(db, "fish"), (snapshot) => {
    const fish = snapshot.val();
    if (!fish) return;
    document.getElementById("pike").textContent = fish.pike ?? 0;
    document.getElementById("zander").textContent = fish.zander ?? 0;
    document.getElementById("perch").textContent = fish.perch ?? 0;
});

onValue(ref(db, "top5"), (snapshot) => renderTop5(snapshot.val() || {}));

function normalizeLengths(values) {
    const cleaned = Array.isArray(values) ? values : [];
    return Array.from({ length: 5 }, (_, i) => {
        const value = Number(cleaned[i]);
        return Number.isFinite(value) && value > 0 ? Math.round(value * 10) / 10 : 0;
    }).sort((a, b) => b - a);
}

function formatNumber(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
}

function renderTop5(data) {
    const container = document.getElementById("top5Rows");
    container.innerHTML = "";

    for (const [key, config] of Object.entries(speciesConfig)) {
        const item = data?.[key];
        if (!item?.enabled) continue;

        const lengths = normalizeLengths(item.lengths);
        const total = lengths.reduce((sum, value) => sum + value, 0);
        const row = document.createElement("div");
        row.className = "top5-row";

        const species = document.createElement("div");
        species.className = "top5-species";
        species.textContent = config.label;
        row.appendChild(species);

        lengths.forEach((value, index) => {
            const box = document.createElement("div");
            box.className = "length-box";
            box.textContent = `${index + 1}. ${value > 0 ? formatNumber(value) : "--"} cm`;
            row.appendChild(box);
        });

        const totalBox = document.createElement("div");
        totalBox.className = "length-box total";
        totalBox.textContent = `Yhteismitta ${formatNumber(total)} cm`;
        row.appendChild(totalBox);
        container.appendChild(row);
    }
}

onValue(ref(db, "weather"), (snapshot) => {
    const weather = snapshot.val();
    if (!weather) return;
    document.getElementById("weather").textContent = `${weather.temperature}°C`;
});

onValue(ref(db, "location"), (snapshot) => {
    const location = snapshot.val();
    if (location?.name) document.getElementById("location").textContent = location.name;
});

onValue(ref(db, "viewers"), (snapshot) => {
    const viewers = snapshot.val();
    if (viewers === null) return;
    document.getElementById("viewers").textContent = viewers;
});
