import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'id.brewtech.app',
    appName: 'Brewtech',
    webDir: 'public/build',

    // ── Karena app ini Laravel/Inertia, kita load langsung dari server ──
    server: {
        url: process.env.CAPACITOR_SERVER_URL || 'https://brewtech-v2.vercel.app',
        cleartext: false,       // HTTPS only
        androidScheme: 'https',
    },

    android: {
        allowMixedContent: false,
        captureInput: true,
        webContentsDebuggingEnabled: false, // set true saat debug
    },
};

export default config;
