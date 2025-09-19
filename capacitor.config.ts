import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bluenex.safeon',
  appName: 'safeon',
  webDir: 'build',
  server: {
    androidScheme: 'https'   // 로컬 API가 http면 아래 4-1 cleartext 허용 필요
  }
};

export default config;
