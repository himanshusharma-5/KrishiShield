# Android Studio emulator wrapper

This Android project keeps the existing KrishiShield web app unchanged and loads it inside a native `WebView`.

## What it uses

- `MainActivity.kt` now points the WebView at an HTTPS tunnel URL placeholder
- replace `https://replace-with-your-ngrok-url.ngrok-free.app` with your live ngrok HTTPS URL
- native location permissions are forwarded to the web app so browser geolocation keeps working

## Run it in Android Studio

1. Start the Vite server on your laptop:
   - `npm run dev -- --host`
2. Start ngrok:
   - `ngrok http 5173`
3. Copy the HTTPS forwarding URL from ngrok.
4. Open `android/app/src/main/java/com/krishishield/emulator/MainActivity.kt`
5. Replace `WEB_APP_URL` with your ngrok HTTPS URL.
6. Open `android/` in Android Studio.
7. Let Gradle sync.
8. Run the `app` configuration on your device.

## Why this approach

- no changes to your React UI
- no changes to weather/location logic
- uses HTTPS so WebView geolocation can work during development
