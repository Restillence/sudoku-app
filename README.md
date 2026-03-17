# sudoku

React Native sudoku game. Works on web + android.

## run it

```bash
npm install
npm run web
```

Open http://localhost:8081

## build android

Easiest way is EAS:

```bash
npm i -g eas-cli
eas login
eas build --platform android --profile preview
```

Or if you want to build locally:

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK ends up in `android/app/build/outputs/apk/release/`

## how it works

Puzzle generator uses backtracking solver, then removes cells while ensuring unique solution. Nothing fancy.

Built with Expo 55 + TypeScript.
