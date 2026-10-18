# Build & release — Android APK + AAB

## 0 · Prerequisites

- **Node 18+** (`node -v`)
- **Java 17** (Android Gradle Plugin 8.x requires JDK 17)
- **Android Studio** (Giraffe or newer) — only needed if you want the IDE
- Set `ANDROID_HOME` and add `platform-tools` to `PATH`

## 1 · Build the web app

```powershell
npm install
npm run build          # outputs to dist/
```

## 2 · Push the web build into the Android project

```powershell
npx cap sync android   # copies dist/ to android/app/src/main/assets/public
```

(or combined: `npm run cap:sync`)

## 3 · Debug APK — installable, unsigned by default (debug keystore)

```powershell
npm run android:debug
```

Produces: `android/app/build/outputs/apk/debug/app-debug.apk`

Install on a connected device: `adb install -r app-debug.apk`

## 4 · Release APK (signed) — for direct sideload

**One-time keystore setup:**

```powershell
keytool -genkey -v -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Copy it to a stable location (e.g. `D:/keystores/upload-keystore.jks`), then
create `android/app/keystore.properties` from the included sample:

```properties
storeFile=D:/keystores/upload-keystore.jks
storePassword=••••••
keyAlias=upload
keyPassword=••••••
```

Then build:

```powershell
npm run android:release
```

Produces: `android/app/build/outputs/apk/release/app-release.apk`

## 5 · Release AAB (Android App Bundle) — for Play Store upload

Requires the same keystore.properties from §4.

```powershell
npm run android:bundle
```

Produces: `android/app/build/outputs/bundle/release/app-release.aab`

Upload this `.aab` to Play Console → **Internal testing** or **Production**.

## 6 · What the gradle config does

| | |
|---|---|
| `applicationId` | `in.assam.dharitree` |
| `versionCode` / `versionName` | `1` / `1.0.0` (bump both for every Play Store upload) |
| `minSdkVersion` | 22 (Android 5.1) |
| `targetSdkVersion` / `compileSdk` | 34 (Android 14) |
| `R8` | **enabled** for release — code + resource shrinking |
| `bundle` splits | per-language, per-density, per-ABI (smaller downloads per device) |
| Signing | `signingConfigs.release` reads `app/keystore.properties`; falls back to no signing if the file is absent |

## 7 · Capacitor plugins shipped

- `@capacitor/app`
- `@capacitor/browser`
- `@capacitor/local-notifications` — lock-screen news + rotation
- `@capacitor/preferences`
- `@capacitor/share`

**`CapacitorHttp` is enabled** in `capacitor.config.ts`. That makes every
`window.fetch(...)` from the WebView go through the native HTTP stack:
- Cross-origin cookies to `ilrms.assam.gov.in` are kept in Android's native
  cookie jar.
- No CORS preflight failures — the browser's same-origin policy is bypassed
  for native requests.
- This is why the Dharitree cascade works on an installed APK without any
  backend server.

## 8 · Android permissions declared

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
```

Only `POST_NOTIFICATIONS` is runtime-prompted (Android 13+). The others are
install-time only.

## 9 · Launcher icon + splash

The in-app branding is driven by `public/app-logo.webp` (one file to rebrand).

For the Android **launcher icon** (status bar + home screen + task
switcher), you still need PNG mipmaps. Easiest path:

1. Open **Android Studio** → `File > New > Image Asset`
2. Select "Launcher Icons (Adaptive & Legacy)" → **Image source**:
   `public/app-logo.webp` → Next → Finish.
3. That writes PNGs to `android/app/src/main/res/mipmap-*/`.

Splash: `@capacitor/splash-screen` is not currently installed — the native
launch theme uses the system default. Add the plugin and run `cap sync` if
you want a branded splash.

## 10 · Troubleshooting

| Problem | Fix |
|---|---|
| `Unable to establish loopback connection` | Firewall blocking Gradle daemon — try `--no-daemon` or temporarily whitelist Java. |
| `SDK location not found` | Create `android/local.properties` with `sdk.dir=C:/Users/…/AppData/Local/Android/Sdk` |
| App crashes on launch after update | `npm run android:clean` then rebuild — clears stale R8 cache |
| Notifications don't appear on lock screen | On Android 13+, you must accept the POST_NOTIFICATIONS prompt the first time you tap "Enable notifications" in Settings → Notifications |
| Blank white screen after install | `npm run build` was skipped; the APK carries the old dist. Always use `npm run android:debug` which chains build + sync + assemble. |
