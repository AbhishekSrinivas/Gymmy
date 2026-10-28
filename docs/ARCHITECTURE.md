# Architecture

Plain HTML, CSS and JavaScript, no framework and no runtime dependencies. Capacitor wraps the finished page in an Android WebView.

## Build

`src/build.py` concatenates the JavaScript files in a fixed order, inlines the CSS, the exercise JSON and a small error banner, and writes one file, `www/index.html`. It runs `node --check` first so a syntax error fails the build. Fonts are loaded from `www/fonts`.

## State and storage

- One state object, `S`, per profile, saved to `localStorage` on every change by `save()`.
- Profiles live in a separate list, `U`. Each profile has its own key, goal, optional avatar and optional PIN hash.
- `migrate()` upgrades old saves in place, for example adding new equipment once.
- The profile entry stores the goal, and the app re-applies it on load so a default state never overrides it.

## Rendering

- `render()` rebuilds the `#app` tree from the current state. It never runs while a finger is down, so a redraw cannot swallow a tap.
- Events use delegation. Elements carry `data-a` (action) and `data-v` (value), and one click handler calls `ACT[action](value)`.
- The page keeps focus and caret in text boxes across a redraw.

## Layouts

- Portrait phone: single column, floating glass tab bar.
- Large landscape: a separate home layout, a vertical tab capsule on the left, and a zoomed canvas.
- Navigation uses a sliding pill driven by a CSS variable, in both orientations.

## Theming

Light is a tinted glass theme. Dark uses the attribute `data-gm=dark` on the root element with true black, a green glow rising from the bottom and frosted cards. The theme setting is Auto, Light or Dark and Auto follows `prefers-color-scheme`.

## Reordering and haptics

A long press of about 0.4 seconds starts a drag on any list marked `data-drag`. Haptics fire on a completed tap or a key press, never on touch down, so scrolling stays silent.

## Android build

GitHub Actions builds the web file, creates the Android project with Capacitor, generates launcher icons, adds the vibration permission, runs Gradle and publishes `Gymmy.apk` to the release named **latest**.
