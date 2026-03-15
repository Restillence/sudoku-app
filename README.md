# Sudoku App

A cross-platform Sudoku game built with React Native + Expo. Works on Web and Android.

## Features

- 🎮 **Classic Sudoku** - 9x9 grid with standard rules
- 🎯 **3 Difficulty Levels** - Easy, Medium, Hard
- ✏️ **Notes Mode** - Pencil in possible numbers
- ⏱️ **Timer** - Track your solve time
- ❌ **Error Highlighting** - See mistakes instantly
- 🏆 **Win Detection** - Celebration on completion
- 🔄 **Unlimited Puzzles** - Procedurally generated with unique solutions

## Run on Web

```bash
npm install
npm run web
```

Opens at http://localhost:8081

## Build Android APK

### Option 1: EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Build APK:
```bash
eas build --platform android --profile preview
```

4. Download APK from the Expo dashboard and install on your device.

### Option 2: Local Build (Advanced)

1. Prebuild native project:
```bash
npx expo prebuild --platform android
```

2. Build debug APK:
```bash
cd android
./gradlew assembleDebug
```

3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option 3: Export as PWA (No app store needed)

```bash
npx expo export --platform web
```

Host the `dist/` folder on any static hosting (Netlify, Vercel, GitHub Pages).

Users can then "Install App" from browser on Android.

## Install on Android Device

1. Transfer APK to your phone via USB, cloud, or QR code
2. Enable "Install from unknown sources" in Android Settings
3. Open the APK file to install

## Tech Stack

- React Native
- Expo SDK 55
- TypeScript

## License

MIT
