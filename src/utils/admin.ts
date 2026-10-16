import { useState, useEffect } from 'react';

/**
 * Determines whether the user is in Admin/Editor mode.
 * Editor controls will ONLY appear inside the Google AI Studio environment (ais-dev-*),
 * localhost, or when explicitly requested via ?admin=true.
 * 
 * Final public users/clients on the shared URL (ais-pre-*) or custom domain
 * will NEVER see any personalization or admin buttons.
 */
export function useAdminMode() {
  const [isDevEnvironment, setIsDevEnvironment] = useState<boolean>(false);
  const [previewAsClient, setPreviewAsClient] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;
    const searchParams = new URLSearchParams(window.location.search);
    const hasAdminParam = searchParams.get('admin') === 'true' || searchParams.get('admin') === '1';

    // Check if in Google AI Studio dev container or localhost or ?admin=true
    const isDev =
      hostname.includes('ais-dev-') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hasAdminParam;

    setIsDevEnvironment(isDev);
  }, []);

  const isAdmin = isDevEnvironment && !previewAsClient;

  return {
    isDevEnvironment,
    isAdmin,
    previewAsClient,
    setPreviewAsClient,
  };
}
