# Privacy Policy — Assam Land Records (Dharitre)

**Last updated: 18 October 2026**

Assam Land Records – Dharitre ("the App") is an **unofficial, independent** companion app for viewing public land records of Assam through the Government of Assam's ILRMS/Dharitree portal. The App is **not affiliated with, endorsed by, or operated by** the Government of Assam or any of its departments.

## Summary

- The App has **no user accounts**, **no ads**, and **no analytics or tracking** of any kind.
- The App does **not collect, transmit, or sell any personal data** to the developer.
- Your searches, saved items, settings, and exported documents **stay on your device**.
- The App only contacts third-party services to fetch the public content you explicitly request (land records, weather, news).

## Information the App accesses

### Land record searches (official government portal)

When you perform a land search, the App sends your search parameters — district, subdivision, circle, mouza, lot/village, **dag number**, **patta type**, and the **CAPTCHA answer** — directly from your device to the official Government of Assam portal at `ilrms.assam.gov.in`, using the App's built-in HTTP stack. Session cookies required by that portal are stored locally in the App's native cookie jar on your device.

- The developer **never receives** this information.
- Search results are held in memory for display only and are **not saved** unless *you* choose to export them.
- Access to land records remains subject to the government portal's own terms, CAPTCHA, and rate limits.

### Weather

If you use the weather feature, the App requests a public forecast from `api.open-meteo.com` using the coordinates of the **district you selected** (from a fixed list bundled in the App). The App does **not** access your device GPS or precise location.

### News

If you use the news feature, the App fetches public RSS news feeds through the third-party proxy `rss2json.com`, which forwards requests to Indian news sites (e.g. Nenow, The Hindu, Indian Express, Hindustimes). The proxy operator can see the request (including your IP address) and the feed URL.

### External links

Links to official websites (Basundhara, DLRS, e-Khajana, PM-Kisan, market prices, etc.) open in your device's browser or the in-app browser. Those websites are governed by their own privacy policies.

## Information stored on your device

The App stores the following locally (in your browser/WebView storage on the device). None of it is uploaded anywhere:

| Item | Purpose |
|---|---|
| Saved/favorite services | Your pinned shortcuts on the Saved page |
| Notification settings | Enable/disable flag, intervals, category toggles, last-shown timestamps, recently seen news headlines |
| Language preference | Assamese / English / Hindi |
| Selected weather district | Your chosen district for the weather card |
| Onboarding & rating flags | Whether you dismissed the intro or rate prompt |

Exported Jamabandi documents (PNG/PDF) are written to the App's documents folder on your device and shared only if *you* send them through the system share sheet.

## Notifications

The App can show **local** notifications (news headlines, scheme tips, weather for your chosen district, in-app updates). These are generated and scheduled entirely on your device. On Android 13+, notification permission is requested at runtime; you can revoke it any time in system settings. No notification content is sent to the developer.

## Permissions the App uses

- **Internet / network state** — to fetch public data listed above.
- **Notifications, vibrate, boot completion, alarms** — to schedule and display local notifications.

The App requests **no** location, camera, microphone, contacts, SMS, phone, or file-picker permissions.

## Sharing

The share feature uses your device's built-in share sheet. Content is shared only with the apps you choose, subject to their policies.

## Data retention and deletion

The developer operates **no servers** and holds **no user data**. To erase everything the App keeps, clear the App's storage (Android Settings → Apps → Assam Land Records → Storage → Clear storage) or uninstall the App.

## Children's privacy

The App is suitable for general audiences and collects no personal data from anyone, including children.

## Security

Because no personal data leaves your device, there is nothing for the developer to breach. Keep your device itself secure; land records fetched from the government portal are as sensitive as anything you choose to export or share.

## Third-party services

| Service | Operator | Why |
|---|---|---|
| `ilrms.assam.gov.in` | Government of Assam | Land record searches |
| `api.open-meteo.com` | Open-Meteo (open data) | Weather forecasts |
| `rss2json.com` | RSS2JSON | News feed conversion |
| Google Fonts | Google | App typography (requests may include your IP) |

## Changes to this policy

This policy may be updated as the App changes. The "Last updated" date above reflects the latest revision. Continued use after changes constitutes acceptance of the revised policy.

## Contact

Questions or concerns: open an issue at
**https://github.com/awares2011-ship-it/assam-land-records-dharitre**

## Disclaimer

The App is an unofficial tool. Always verify land records through official Government of Assam channels. The developer is not responsible for decisions made based on data retrieved through the App.
