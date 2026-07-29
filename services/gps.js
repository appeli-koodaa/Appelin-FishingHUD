import { db, ref, set } from "../shared/firebase.js";

function setGpsStatus(text, color) {
    document.getElementById("gpsText").textContent = text;
    document.getElementById("gpsStatus").style.background = color;
}

export function startGps() {

    if (!navigator.geolocation) {
        setGpsStatus("GPS ei ole käytettävissä", "red");
        return;
    }

    navigator.geolocation.watchPosition(

        async (position) => {

            const lat = Number(position.coords.latitude.toFixed(6));
            const lon = Number(position.coords.longitude.toFixed(6));
            const accuracy = Math.round(position.coords.accuracy);

            await set(ref(db, "location"), {
                lat,
                lon,
                accuracy,
                updated: Date.now()
            });

            setGpsStatus("GPS käytössä", "limegreen");

        },

        (error) => {

            console.error(error);

            setGpsStatus("GPS estetty", "red");

        },

        {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 15000
        }

    );

}