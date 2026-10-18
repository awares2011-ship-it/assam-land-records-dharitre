import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asamland.info',
  appName: 'Assam Land Records â€“ Dharitre',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    // Route window.fetch & XMLHttpRequest through the native HTTP stack on
    // Android/iOS. This bypasses browser-WebView CORS so the app can call
    // ilrms.assam.gov.in directly and keep its session cookies in the native
    // cookie jar â€” no backend server needed.
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
