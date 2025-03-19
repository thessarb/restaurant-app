import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vendor.thezonenyc',
  appName: 'The Zone NYC',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 500,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: "#00000000",
      splashFullScreen: true,
      splashImmersive: true,
    },
    "StatusBar": {
      "overlaysWebView": false,
    }
  }
};

export default config;
