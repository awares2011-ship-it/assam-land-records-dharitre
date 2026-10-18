// Central AdMob integration.
//
// Every flow is a no-op on the web / dev server (Capacitor native check), so
// development in the browser is completely ad-free. On device, real ad unit
// IDs are used for release builds and Google's test ads during `vite dev`.
//
// Placement strategy (policy-aware frequency caps):
//   • App-open  — once per cold start, shown shortly after first paint.
//   • Banner    — persistent bottom banner; the bottom nav is lifted by
//                 --ad-banner-h so the ad never covers app UI.
//   • Interstitial — every 3rd page navigation, ≥45 s apart, never within
//                 30 s of an app-open ad, never while another full-screen ad
//                 is showing.
//   • Rewarded  — opt-in before PDF export of a land record.
//   • Rewarded interstitial — opt-in before PNG export of a land record.
//   • Native    — small template card in the News feed (experimental plugin
//                 feed; fails silently and collapses its slot on error).
//
// Earning a reward unlocks further exports for REWARD_UNLOCK_MS so a heavy
// user is not hammered with ads back-to-back.

import {
  AdMob,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating,
  NativeAdFeed,
  NativeAdTemplate,
  RewardAdPluginEvents,
  RewardInterstitialAdPluginEvents,
} from '@capacitor-community/admob';

export const AD_UNITS = {
  appOpen: 'ca-app-pub-1607968585289432/5045337256',
  banner: 'ca-app-pub-1607968585289432/5397700209',
  rewarded: 'ca-app-pub-1607968585289432/6358418926',
  interstitial: 'ca-app-pub-1607968585289432/3506034030',
  native: 'ca-app-pub-1607968585289432/2440364377',
  rewardedInterstitial: 'ca-app-pub-1607968585289432/8566789028',
} as const;

const INTERSTITIAL_EVERY = 3;
const INTERSTITIAL_COOLDOWN_MS = 45_000;
const APP_OPEN_GRACE_MS = 30_000;
const APP_OPEN_LAUNCH_DELAY_MS = 1_500;
const REWARD_UNLOCK_MS = 10 * 60_000;
const FULLSCREEN_TIMEOUT_MS = 120_000;
const BANNER_RESERVE_DP = 50;

const isTesting = import.meta.env.DEV;

export function isNativePlatform(): boolean {
  try {
    const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
    return !!(w.Capacitor && typeof w.Capacitor.isNativePlatform === 'function' && w.Capacitor.isNativePlatform());
  } catch {
    return false;
  }
}

let initPromise: Promise<void> | null = null;
let ready = false;
let fullScreenBusy = false;
let navCount = 0;
let lastInterstitialAt = 0;
let appOpenShownAt = 0;
let lastRewardAt = 0;
let appOpenScheduled = false;
let interstitialPreload: Promise<boolean> | null = null;

function setBannerReserve(height: number) {
  document.documentElement.style.setProperty('--ad-banner-h', `${height}px`);
}

export function initAds(): Promise<void> {
  if (!isNativePlatform()) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // UMP consent must be resolved before the first ad request (EEA/UK).
    try {
      const info = await AdMob.requestConsentInfo({ tagForUnderAgeOfConsent: false });
      if (info.isConsentFormAvailable && info.status === 'REQUIRED') {
        await AdMob.showConsentForm().catch(() => undefined);
      }
    } catch {
      // Region without a configured UMP message — continue.
    }

    try {
      await AdMob.initialize({ maxAdContentRating: MaxAdContentRating.ParentalGuidance });
    } catch {
      return;
    }
    ready = true;

    try {
      await AdMob.showBanner({
        adId: AD_UNITS.banner,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        isTesting,
      });
      setBannerReserve(BANNER_RESERVE_DP);
      void AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: { width: number; height: number }) => {
        setBannerReserve(size.height > 0 ? size.height : 0);
      });
    } catch {
      setBannerReserve(0);
    }

    preloadInterstitial();
    // AppOpenAdOptions has no test flag — skip the app-open ad entirely in
    // development so a real ad is never requested from a dev device.
    if (!isTesting) {
      void AdMob.loadAppOpen({ adId: AD_UNITS.appOpen }).catch(() => undefined);
    }
  })().catch(() => undefined);

  return initPromise;
}

/* ------------------------------- App open ------------------------------- */

export function scheduleAppOpenOnLaunch(): void {
  if (!isNativePlatform() || appOpenScheduled) return;
  appOpenScheduled = true;
  window.setTimeout(() => {
    void (async () => {
      if (!ready || fullScreenBusy) return;
      try {
        const { value } = await AdMob.isAppOpenLoaded();
        if (!value || fullScreenBusy) return;
        fullScreenBusy = true;
        appOpenShownAt = Date.now();
        await AdMob.showAppOpen();
      } catch {
        // No fill or already shown — never block the launch.
      } finally {
        fullScreenBusy = false;
      }
    })();
  }, APP_OPEN_LAUNCH_DELAY_MS);
}

/* ----------------------------- Interstitial ----------------------------- */

function preloadInterstitial(): void {
  if (!ready) return;
  interstitialPreload = AdMob.prepareInterstitial({ adId: AD_UNITS.interstitial, isTesting })
    .then(() => true)
    .catch(() => {
      interstitialPreload = null;
      return false;
    });
}

export function onNavigate(): void {
  if (!isNativePlatform() || !ready) return;
  navCount += 1;
  if (navCount % INTERSTITIAL_EVERY !== 0) return;
  void maybeShowInterstitial();
}

async function maybeShowInterstitial(): Promise<void> {
  if (fullScreenBusy) return;
  const now = Date.now();
  if (now - lastInterstitialAt < INTERSTITIAL_COOLDOWN_MS) return;
  if (appOpenShownAt > 0 && now - appOpenShownAt < APP_OPEN_GRACE_MS) return;

  if (!interstitialPreload) {
    preloadInterstitial();
    return;
  }
  const loaded = await interstitialPreload;
  if (!loaded || fullScreenBusy) return;
  // Re-check the clock — loading may have taken time.
  if (Date.now() - lastInterstitialAt < INTERSTITIAL_COOLDOWN_MS) return;

  fullScreenBusy = true;
  try {
    await AdMob.showInterstitial({ adId: AD_UNITS.interstitial });
  } catch {
    // No fill / show failure — fall through and re-arm.
  } finally {
    fullScreenBusy = false;
    lastInterstitialAt = Date.now();
    preloadInterstitial();
  }
}

/* ------------------------------- Rewards -------------------------------- */

export type GateResult = 'rewarded' | 'closed' | 'unavailable';

/**
 * Show a rewarded ad (or rewarded interstitial) as an opt-in gate.
 * Returns:
 *   'rewarded'    — the user earned the reward (or the session unlock is active)
 *   'closed'      — the ad was dismissed before the reward was earned
 *   'unavailable' — no ad / web platform / another full-screen ad is showing
 */
export async function showRewardGate(kind: 'rewarded' | 'rewardedInterstitial'): Promise<GateResult> {
  if (!isNativePlatform() || !ready) return 'unavailable';
  if (Date.now() - lastRewardAt < REWARD_UNLOCK_MS) return 'rewarded';
  if (fullScreenBusy) return 'unavailable';

  fullScreenBusy = true;
  let dismissHandle: { remove: () => Promise<void> } | undefined;
  try {
    if (kind === 'rewarded') {
      await AdMob.prepareRewardVideoAd({ adId: AD_UNITS.rewarded, isTesting });
    } else {
      await AdMob.prepareRewardInterstitialAd({ adId: AD_UNITS.rewardedInterstitial, isTesting });
    }

    const dismissEvent = kind === 'rewarded'
      ? RewardAdPluginEvents.Dismissed
      : RewardInterstitialAdPluginEvents.Dismissed;
    const show = kind === 'rewarded'
      ? AdMob.showRewardVideoAd()
      : AdMob.showRewardInterstitialAd();

    let resolveDismiss: (_: 'closed') => void = () => undefined;
    const dismissal = new Promise<'closed'>((res) => { resolveDismiss = res; });
    dismissHandle = await AdMob.addListener(dismissEvent as never, () => resolveDismiss('closed'));

    const timeout = new Promise<'closed'>((res) => {
      window.setTimeout(() => res('closed'), FULLSCREEN_TIMEOUT_MS);
    });
    const completion = show.then(() => 'rewarded' as const).catch(() => 'closed' as const);

    const outcome = await Promise.race([completion, dismissal, timeout]);
    if (outcome === 'rewarded') lastRewardAt = Date.now();
    return outcome;
  } catch {
    return 'unavailable';
  } finally {
    fullScreenBusy = false;
    void dismissHandle?.remove().catch(() => undefined);
  }
}

/* -------------------------------- Native -------------------------------- */

export { NativeAdFeed, NativeAdTemplate };
