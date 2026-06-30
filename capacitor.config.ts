import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yashodeep.cliniccrm',
  appName: 'Yashodeep Clinic CRM',

  webDir: 'public',

  server: {
    url: 'https://clinic-followup-crm.vercel.app',
    cleartext: false
  }
};

export default config;