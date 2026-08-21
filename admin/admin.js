// ==========================================================
// APPELIN FISHINGHUD 2.0.3 - ADMIN.JS
// ==========================================================
import {
    db, ref, set, onValue, auth,
    onAuthStateChanged, signInWithEmailAndPassword
} from "../shared/firebase.js";
import { startGps } from "../services/gps.js";
import { startWeather } from "../services/weather.js";
import { startGeocoding } from "../services/geocoding.js";

const species = ["pike", "zander", "perch"];
let loggedIn = false;
let fish = { pike: 0, zander: 0, perch: 0 };
let top5 = createDefaultTop5();
let top5Loaded = false;
const top5Dirty = { pike: false, zander: false, perch: false };

function createDefaultTop5() {
    return {
        pike: { enabled: false, lengths: [0, 0, 0, 0, 0] },
        zander: { enabled: false, lengths: [0, 0, 0, 0, 0] },
        perch: { enabled: false, lengths: [0, 0, 0, 0, 0] }
    };
}

function normalizeLengths(values) {
    const cleaned = Array.isArray(values) ? values : [];
    return Array.from({ length: 5 }, (_, i) => {
        const value = Number(cleaned[i]);
        return Number.isFinite(value) && value > 0 ? Math.round(value * 10) / 10 : 0;
    }).sort((a, b) => b - a);
}

function normalizeTop5(data) {
    const defaults = createDefaultTop5();
    for (const key of species) {
        if (data?.[key]) {
            defaults[key].enabled = Boolean(data[key].enabled);
            defaults[key].lengths = normalizeLengths(data[key].lengths);
        }
    }
    return defaults;
}

function buildLengthInputs() {
    document.querySelectorAll(".length-grid").forEach((grid) => {
        const key = grid.dataset.species;
        grid.innerHTML = "";
        for (let i = 0; i < 5; i++) {
            const wrap = document.createElement("div");
            wrap.className = "length-field";
            const label = document.createElement("label");
            label.htmlFor = `${key}Length${i}`;
            label.textContent = `${i + 1}. pisin`;
            const input = document.createElement("input");
            input.id = `${key}Length${i}`;
            input.type = "number";
            input.min = "0";
            input.max = "200";
            input.step = "0.1";
            input.inputMode = "decimal";
            input.placeholder = "cm";
            input.addEventListener("input", () => {
                top5Dirty[key] = true;
                updateTop5TotalPreview(key);
            });
            wrap.append(label, input);
            grid.appendChild(wrap);
        }
    });
}

function setTop5EditorState(key) {
    const enabled = document.getElementById(`${key}Top5Enabled`).checked;
    const grid = document.querySelector(`.length-grid[data-species="${key}"]`);
    const helper = document.getElementById(`${key}Top5Helper`);

    grid.classList.toggle("is-disabled", !enabled);
    grid.querySelectorAll("input").forEach((input) => {
        input.disabled = !enabled;
    });

    helper.textContent = enabled
        ? "Syötä 5 mittaa. HUD järjestää ne automaattisesti pisimmästä lyhimpään."
        : "Laita TOP 5 päälle, jotta voit syöttää mitat.";
    helper.classList.toggle("is-active", enabled);
}

function readLengthsFromInputs(key) {
    return normalizeLengths(Array.from({ length: 5 }, (_, i) =>
        document.getElementById(`${key}Length${i}`).value
    ));
}

function updateTop5TotalPreview(key) {
    const lengths = readLengthsFromInputs(key);
    const total = lengths.reduce((sum, value) => sum + value, 0);
    document.getElementById(`${key}Total`).textContent = `${formatNumber(total)} cm`;
}

function renderTop5Species(key) {
    document.getElementById(`${key}Top5Enabled`).checked = top5[key].enabled;
    top5[key].lengths.forEach((value, i) => {
        document.getElementById(`${key}Length${i}`).value = value || "";
    });
    setTop5EditorState(key);
    updateTop5TotalPreview(key);
}

function renderTop5Admin() {
    for (const key of species) {
        if (!top5Dirty[key]) renderTop5Species(key);
    }
}

function formatNumber(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
}

onAuthStateChanged(auth, (user) => {
    loggedIn = Boolean(user);
    const status = document.getElementById("loginStatus");
    status.textContent = user ? `Kirjautunut: ${user.email}` : "Ei kirjautunut";
});

document.getElementById("loginButton").onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        document.getElementById("loginStatus").textContent = "Kirjautuminen onnistui";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    } catch (error) {
        console.error(error);
        document.getElementById("loginStatus").textContent = "Kirjautuminen epäonnistui";
    }
};

startGps();
startWeather();
startGeocoding();
buildLengthInputs();
for (const key of species) setTop5EditorState(key);

function updateDisplay() {
    document.getElementById("pikeCount").textContent = fish.pike ?? 0;
    document.getElementById("zanderCount").textContent = fish.zander ?? 0;
    document.getElementById("perchCount").textContent = fish.perch ?? 0;
}

onValue(ref(db, "fish"), (snapshot) => {
    if (!snapshot.exists()) return;
    fish = { ...fish, ...snapshot.val() };
    updateDisplay();
});

onValue(ref(db, "top5"), (snapshot) => {
    top5 = normalizeTop5(snapshot.val());
    top5Loaded = true;
    renderTop5Admin();
});

async function saveFish() {
    if (!loggedIn) {
        alert("Kirjaudu ensin sisään");
        return false;
    }
    await set(ref(db, "fish"), fish);
    return true;
}

async function saveTop5Species(key) {
    if (!loggedIn) {
        alert("Kirjaudu ensin sisään");
        return;
    }

    if (!top5Loaded) top5 = createDefaultTop5();

    const nextValue = {
        enabled: document.getElementById(`${key}Top5Enabled`).checked,
        lengths: readLengthsFromInputs(key)
    };

    const saveButton = document.querySelector(`[data-save-species="${key}"]`);
    const originalText = saveButton.textContent;
    saveButton.disabled = true;
    saveButton.textContent = "Tallennetaan...";

    try {
        await set(ref(db, `top5/${key}`), nextValue);
        top5[key] = nextValue;
        top5Dirty[key] = false;
        renderTop5Species(key);
        saveButton.textContent = "Tallennettu ✓";
        vibrate();
        setTimeout(() => {
            saveButton.textContent = originalText;
        }, 1200);
    } catch (error) {
        console.error("TOP 5 tallennus epäonnistui:", error);
        saveButton.textContent = originalText;
        alert("TOP 5 -tallennus epäonnistui. Tarkista Firebase-yhteys ja kirjautuminen.");
    } finally {
        saveButton.disabled = false;
    }
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(20);
}

for (const key of species) {
    document.getElementById(`${key}Plus`).onclick = async () => {
        fish[key] = Number(fish[key] ?? 0) + 1;
        if (await saveFish()) vibrate();
    };
    document.getElementById(`${key}Minus`).onclick = async () => {
        if (Number(fish[key] ?? 0) === 0) return;
        fish[key] = Number(fish[key]) - 1;
        if (await saveFish()) vibrate();
    };
    document.querySelector(`[data-save-species="${key}"]`).addEventListener("click", () => saveTop5Species(key));
    document.getElementById(`${key}Top5Enabled`).addEventListener("change", () => {
        top5Dirty[key] = true;
        setTop5EditorState(key);
        updateTop5TotalPreview(key);
    });
}

document.getElementById("resetButton").onclick = async () => {
    if (!confirm("Haluatko varmasti nollata saalismäärät sekä kaikki TOP 5 -mitat?")) return;
    if (!loggedIn) {
        alert("Kirjaudu ensin sisään");
        return;
    }

    const emptyTop5 = createDefaultTop5();

    try {
        await Promise.all([
            set(ref(db, "fish"), { pike: 0, zander: 0, perch: 0 }),
            set(ref(db, "top5"), emptyTop5)
        ]);

        fish = { pike: 0, zander: 0, perch: 0 };
        top5 = emptyTop5;
        for (const key of species) top5Dirty[key] = false;
        updateDisplay();
        renderTop5Admin();
        vibrate();
        alert("Saalis ja TOP 5 -mitat nollattu.");
    } catch (error) {
        console.error("Saalin nollaus epäonnistui:", error);
        alert("Nollaus epäonnistui. Tarkista Firebase-yhteys ja kirjautuminen.");
    }
};
