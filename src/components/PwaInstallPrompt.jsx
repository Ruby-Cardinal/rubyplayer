import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, WifiOff, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const DISMISS_INSTALL_KEY = 'rubyplayer_pwa_install_dismissed';

export default function PwaInstallPrompt() {
  const { isInstallable, isOffline, updateAvailable, promptInstall, applyUpdate } = usePWA();
  const [installDismissed, setInstallDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_INSTALL_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [toastDismissed, setToastDismissed] = useState(false);

  if (toastDismissed) return null;

  if (isOffline) {
    return (
      <div className="pwa-toast offline">
        <WifiOff size={16} />
        <span>Working Offline (Cached Library Mode)</span>
        <button className="pwa-toast-close" onClick={() => setToastDismissed(true)} title="Dismiss">
          <X size={14} />
        </button>
      </div>
    );
  }

  if (updateAvailable) {
    return (
      <div className="pwa-toast update">
        <RefreshCw size={16} className="spin-icon" />
        <span>RubyPlayer Update Available</span>
        <button className="pwa-toast-action" onClick={applyUpdate}>
          Reload & Update
        </button>
        <button className="pwa-toast-close" onClick={() => setToastDismissed(true)} title="Dismiss">
          <X size={14} />
        </button>
      </div>
    );
  }
  return null;
}
