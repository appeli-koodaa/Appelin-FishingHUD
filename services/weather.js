// ==========================================================
// APPELIN FISHINGHUD
// SERVICES / WEATHER.JS
// ==========================================================

import { db, ref, onValue, set } from "../shared/firebase.js";

let lastFetch = 0;

export function startWeather() {

    console.log("Weather service started");

    onValue(ref(db, "location"), async (snapshot) => {

        console.log("Location listener triggered");

        if (!snapshot.exists()) {
            console.log("Location does not exist");
            return;
        }

        const location = snapshot.val();

        console.log("Location received:", location);

        if (!location.lat || !location.lon) {
            console.log("Latitude or longitude missing");
            return;
        }

        // Päivitetään korkeintaan 5 minuutin välein
        if (Date.now() - lastFetch < 5 * 60 * 1000) {
            console.log("Weather update skipped (5 min rule)");
            return;
        }

        lastFetch = Date.now();

        try {

            const url =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${location.lat}` +
                `&longitude=${location.lon}` +
                `&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`;

            console.log("Fetching:", url);

            const response = await fetch(url);

            console.log("HTTP status:", response.status);

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();

            console.log("Weather response:", data);

            const current = data.current;

            await set(ref(db, "weather"), {

                temperature: Math.round(current.temperature_2m),
                windspeed: Math.round(current.wind_speed_10m),
                winddirection: Math.round(current.wind_direction_10m),
                weathercode: current.weather_code,
                updated: Date.now()

            });

            console.log("Weather updated successfully");

        } catch (err) {

            console.error("Weather error:", err);

        }

    });

}