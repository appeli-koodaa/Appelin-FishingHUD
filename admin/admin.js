// ==========================================================
// APPELIN FISHINGHUD
// ADMIN.JS
// ==========================================================


import { 
    db,
    ref,
    set,
    onValue,
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from "../shared/firebase.js";


import { startGps } from "../services/gps.js";
import { startWeather } from "../services/weather.js";
import { startGeocoding } from "../services/geocoding.js";



// ==========================================================
// AUTH
// ==========================================================

let loggedIn = false;


onAuthStateChanged(auth, (user) => {


    if (user) {


        console.log(
            "Admin logged in:",
            user.email
        );


        loggedIn = true;


        const status =
            document.getElementById("loginStatus");


        if (status) {

            status.textContent =
                "Kirjautunut: " + user.email;

        }


    } else {


        console.log(
            "Admin not logged in"
        );


        loggedIn = false;


    }

});




// ==========================================================
// LOGIN
// ==========================================================

document.getElementById("loginButton").onclick = async () => {


    const email =
        document.getElementById("email").value;


    const password =
        document.getElementById("password").value;



    try {


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        document.getElementById("loginStatus").textContent =
            "Kirjautuminen onnistui";


    } catch (error) {


        console.error(error);


        document.getElementById("loginStatus").textContent =
            "Kirjautuminen epäonnistui";


    }


};




// ==========================================================
// KÄYNNISTÄ PALVELUT
// ==========================================================

startGps();

startWeather();

startGeocoding();




// ==========================================================
// KALAT
// ==========================================================

let fish = {


    pike: 0,

    zander: 0,

    perch: 0


};




// ==========================================================
// PÄIVITÄ NÄKYMÄ
// ==========================================================

function updateDisplay() {


    document.getElementById("pikeCount").textContent =
        fish.pike;


    document.getElementById("zanderCount").textContent =
        fish.zander;


    document.getElementById("perchCount").textContent =
        fish.perch;


}




// ==========================================================
// FIREBASE - KALAT
// ==========================================================

onValue(ref(db, "fish"), (snapshot) => {


    if (!snapshot.exists()) return;


    fish = snapshot.val();


    updateDisplay();


});




// ==========================================================
// TALLENNA KALAT
// ==========================================================

async function saveFish() {


    if (!loggedIn) {


        alert(
            "Kirjaudu ensin sisään"
        );


        return;


    }



    await set(
        ref(db, "fish"),
        fish
    );


}




// ==========================================================
// VÄRINÄ
// ==========================================================

function vibrate() {


    if (navigator.vibrate) {


        navigator.vibrate(20);


    }


}




// ==========================================================
// HAUKI
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
// KUHA
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
// AHVEN
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
// RESET
// ==========================================================

document.getElementById("resetButton").onclick = async () => {


    if (
        !confirm(
            "Haluatko varmasti nollata saaliin?"
        )
    ) return;



    fish = {


        pike: 0,

        zander: 0,

        perch: 0


    };



    await saveFish();


    vibrate();


};