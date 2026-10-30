# Gymmy

![Gymmy](assets/icon-only.png)

A workout app I built for myself that runs entirely on the phone. It plans lifting days for bulk, shred or maintain, shows an animated figure for each exercise, and logs sets and weights in lb and kg. There are no accounts and no nutrition tracking.

Download the latest APK from the [releases page](https://github.com/AbhishekSrinivas/Gymmy/releases/latest).

![Screens](docs/screenshots/overview.jpg)

## What it does

- 201 exercises, each with an animated figure, muscle map, grip and stance options and form cues
- Bulk, shred and maintain goals that change sets, reps, rest and cardio
- A workout player with rest timer, previous numbers, rest-pause and drop-set prompts, and swap or skip
- A recovery check that moves exercises around when a muscle is still sore from a recent session
- A 12-week size program plus single sessions for chest, back, shoulders, arms and abs, searchable by name or original title
- Focus mode builds a workout from the muscles you tap on a body map
- Stretch, mobility, warm-up and cool-down routines
- Gym and home modes with their own equipment lists
- Weekly schedule with drag to reorder and away periods
- Progress charts, personal records and milestones
- Up to 10 profiles, each with an optional PIN
- Light, dark (true black) and automatic themes, and different haptic strengths for taps, rest end and records

## Screenshots

| Home | Workouts | Week | Progress |
|---|---|---|---|
| ![](docs/screenshots/home-light.png) | ![](docs/screenshots/workouts.png) | ![](docs/screenshots/week.png) | ![](docs/screenshots/progress.png) |

| Exercise | Dark theme | Tablet |
|---|---|---|
| ![](docs/screenshots/exercise.png) | ![](docs/screenshots/home-dark.png) | ![](docs/screenshots/tablet-landscape.png) |

## Install

On Android, open the latest release, download `Gymmy.apk`, and allow installs from your browser or file manager when asked. The APK is rebuilt on every push to `main`. It is debug-signed, so installing a new one over the old one keeps your data.

You can also serve the `www` folder from any static host and add it to the home screen. Vibration does not work on iOS Safari.

## Build

Needs Python 3 and Node 18+.

```bash
python3 src/build.py          # writes www/index.html
npm install
npx cap add android           # first time only
npx @capacitor/assets generate --android --iconBackgroundColor '#0A0C0E'
npx cap sync android
cd android && ./gradlew assembleDebug
```

The APK ends up in `android/app/build/outputs/apk/debug/`. Pushing to `main` or running the **Build Android APK** workflow does the same thing on GitHub.

## Layout

```
src/        app source; build.py joins it into www/index.html
www/        built page and bundled fonts (what the APK loads)
assets/     launcher icon source
docs/       screenshots and architecture notes
.github/    APK build workflow
```

More in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Data

The app keeps workouts, profiles, settings and PIN hashes in local storage. The Android app makes no network calls and bundles its fonts, so it works offline. Use Menu > Backup and data to export a copy, since clearing app data wipes it. Menu > Reset clears today, the current week, the current month or the whole profile. The PIN keeps other people out of a profile but is not strong security. The optional cloud sync only runs in the hosted web version and is switched off in the APK.

## To do

- Signed release builds
- Native haptics, widget and reminder notifications
- Self-hosted sync
- More legs and glutes sessions and Shred defaults for every program

## Credits

The app credits the program ideas to Jim Stoppani, Abel Albonetti, Arnold Schwarzenegger, Jeff Nippard, Mike Israetel, Robyn Machado, Chad Hollmer and ATHLEAN-X. I wrote the text and drew the figures myself.

No license yet. Open an issue if you want to use it.
