# Assam Dharitree â€” Land Records Companion

An **unofficial** citizen companion mobile app (React + TypeScript + Vite + Tailwind, Android via Capacitor) for Assam land-records services, farmers and landowners.

> âš ï¸ **This app does not replace the Government of Assam Dharitree portal.** Any legally relevant land record must be obtained from the official portal. The app does **not** scrape protected endpoints, bypass CAPTCHA, or fabricate ownership information.

## Features

- **Dashboard** with green/white Material-3-inspired tiles
- **Land record search** with cascading **District â†’ Circle â†’ Village/Town** selection that opens the record on the official Dharitree portal (`ilrms.assam.gov.in/dhar`) via Capacitor Browser
- **Offline land measurement calculator** (Bigha / Katha / Lecha / Acre / Hectare / sq ft / sq m) using Assam-specific factors + plot area calculator
- **Weather** screen with 7-day forecast per Assam district (Open-Meteo, keyless)
- **Government schemes** directory (PM-KISAN, Orunodoi, Mission Basundhara, PMAY-G, IGNOAPS, PMJAY, PMFBY, NMMS, MGNREGA, e-Khajana) with eligibility, benefits, documents and application steps
- **News / local RSS reader** with Assam-focused feeds (NE Now Assam, PIB, IMD, etc.)
- **Jamabandi / Basundhara / Bhunaksha / Mutation / e-Khajana** info pages with official links
- **Stamp Duty estimator** and **EMI calculator**
- **Assamese + English** language toggle persisted locally
- **Searchable FAQ, Assamese glossary, Saved services, Feedback**

## Tech

- React 18, TypeScript, Vite 5
- Tailwind CSS 3 (brand green palette + Noto Sans Assamese)
- React Router 6 (hash router for Capacitor safety)
- Capacitor 6 (Android) with `@capacitor/browser`, `@capacitor/share`, `@capacitor/preferences`

## Architecture (land-record flow â€” same pattern as the Gujarat Satbara app)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   JSON    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  HTML form POST  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Native app form   â”‚ â”€â”€â”€â”€â”€â”€â”€â–¶  â”‚   Node.js backend   â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¶  â”‚   Dharitree portal   â”‚
â”‚  (one card, LTR)   â”‚           â”‚  (cookie-jar per    â”‚                  â”‚  ilrms.assam.gov.in  â”‚
â”‚                    â”‚ â—€â”€â”€â”€â”€â”€â”€â”€ â”‚   user session)     â”‚ â—€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚                      â”‚
â”‚  Native result     â”‚   JSON    â”‚  Parses record HTML â”‚  Record HTML +   â”‚                      â”‚
â”‚  renderer          â”‚           â”‚  â†’ {fields,tables}  â”‚  CAPTCHA image   â”‚                      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

- **CAPTCHA is relayed** to the app (as a `data:` URI loaded with the session's cookies) and solved by the user â€” nothing is bypassed.
- One cookie-jar session per app user. Dropdowns cascade through the backend so the gov page always sees a valid `__hidden` state. 15-min idle TTL.
- Record pages are parsed into typed `{title, fields[], tables[], source, fetchedAt}` and rendered in the app's own UI â€” no WebView, no portal chrome.

## Scripts

```bash
# Frontend
npm install            # install app deps
npm run dev            # Vite dev server at http://localhost:5173
npm run build          # production build in dist/
npm run cap:sync       # build + sync into Android project
npm run cap:open       # open Android Studio
npm run android:build  # debug APK (Windows gradlew)

# Backend (Node 20+)
cd backend
npm install            # express + cheerio + cors
npm start              # http://localhost:3000
```

Set `VITE_BACKEND_URL=https://your-domain.in` for a production build so the APK knows where to find the backend.

## Android (first-time setup)

```bash
npm install
npx cap add android      # once
npm run cap:sync
npm run cap:open         # Android Studio opens the generated project
```

Set the app id in `capacitor.config.ts` and the display name there as well.

## Data sources & attribution

- Weather â€” [Open-Meteo](https://open-meteo.com/) (free, keyless)
- News â€” public RSS via [rss2json](https://rss2json.com/) (NE Now, The Hindu, PIB, IMD)
- Market prices â€” pointed to [Agmarknet](https://agmarknet.gov.in/) / e-NAM / ASAMB (no fabricated prices)
- Land records â€” all record access is through the official **Dharitree** (`ilrms.assam.gov.in`) and **Mission Basundhara** portals
- Ads â€” Google **AdMob** (app-open, banner, interstitial, rewarded, native) via `@capacitor-community/admob`

## Source & links

- **Source code:** https://github.com/awares2011-ship-it/assam-land-records-dharitre
- **Privacy policy (live):** https://awares2011-ship-it.github.io/assam-land-records-dharitre/privacy-policy.html
- **App id:** `com.asamland.info` Â· **Version:** 1.1.0

## Google Play compliance notes

- AdMob integrated (`src/services/ads.ts`): frequency-capped interstitials, opt-in rewarded ads (in-app export only, no cash rewards), general/PG content rating, personalisation opt-out documented in the privacy policy.
- No personal data uploaded by the app itself; language and favourites use `localStorage`. Google AdMob receives ad-related identifiers as documented in the privacy policy.
- No scraping, no CAPTCHA bypass, no mocked ownership data.
- Clear disclaimers on every page that touches a Government service.

## Legal

This is an independent app. â€œAssamâ€, â€œDharitreeâ€, â€œILRMSâ€ and â€œMission Basundharaâ€ are referenced only to identify the respective Government services; this app is not endorsed by or affiliated with the Government of Assam.
