// ==========================================================
// APPELIN FISHINGHUD
// SERVICES / GEOCODING.JS
// ==========================================================

import { db, ref, onValue, set } from "../shared/firebase.js";

let lastLat = null;
let lastLon = null;


// ==========================================================
// Käynnistä paikannimen haku
// ==========================================================

export function startGeocoding() {

    console.log("Geocoding service started");


    onValue(ref(db, "location"), async (snapshot) => {

        if (!snapshot.exists()) return;


        const location = snapshot.val();


        if (!location.lat || !location.lon) return;


        // Ei haeta samaa paikkaa uudestaan

        if (
            lastLat === location.lat &&
            lastLon === location.lon
        ) {
            return;
        }


        lastLat = location.lat;
        lastLon = location.lon;


        try {

            const url =
                `https://api.bigdatacloud.net/data/reverse-geocode-client` +
                `?latitude=${location.lat}` +
                `&longitude=${location.lon}` +
                `&localityLanguage=fi`;


            const response = await fetch(url);


            if (!response.ok) {

                throw new Error("Geocoding API error");

            }


            const data = await response.json();


            const name =
                data.locality ||
                data.city ||
                data.principalSubdivision ||
                "Tuntematon";


            await set(ref(db, "location"), {

                ...location,

                name

            });


            console.log("Location updated:", name);


        } catch (error) {

            console.error("Geocoding error:", error);

        }

    });

}