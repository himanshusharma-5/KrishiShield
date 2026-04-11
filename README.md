# KrishiShield AI Weather Fix

React/Vite project with live weather data flow:

- Browser geolocation stores `{ lat, lon, name }`.
- Nominatim reverse geocoding resolves city/state.
- Open-Meteo current weather fetch runs after coordinates are available.
- Weather UI shows loading state, real temperature, and real wind.
- Weather failure keeps the last value instead of crashing.
