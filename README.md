# Gymmy

A private, on-device workout app (bulk, shred, maintain). One page of plain HTML, CSS and JavaScript, wrapped as an Android app with Capacitor.

## Get the APK (no Android Studio needed)

1. Push this repo to GitHub (branch `main`).
2. Open the repo on GitHub, go to **Actions**, then **Build Android APK**. It runs on every push, or press **Run workflow**.
3. When the run finishes (about 5 minutes), open it and download the **gymmy-apk** artifact (a zip containing `app-debug.apk`).
4. Copy `app-debug.apk` to your Android phone or tablet, open it, and allow **Install unknown apps** when asked.

## Change the app

- Sources are in `src/` (`style.css`, the JavaScript files, `exercises.json`).
- `python3 src/build.py` rebuilds `www/index.html`, the file the app loads.
- Commit and push, and the workflow builds a fresh APK.

## Notes

- Everything is stored on the device. The cloud sync that works in the Claude version does not run in the APK, so use **Backup and data** in the menu to copy your data between devices.
- Fonts are bundled, so the app works fully offline.
- The icon is `assets/icon-only.png`. Replace it with any 1024 by 1024 PNG and push.
- The APK is a debug build. It is fine for your own devices. A Play Store release would need a signed release build.
