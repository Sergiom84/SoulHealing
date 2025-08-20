import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.UCDM.rutinaperdon',
  appName: 'SoulHealing',
  webDir: 'client/dist',
  bundledWebRuntime: false,
  plugins: { SplashScreen: { launchShowDuration: 0 } },
};

export default config;