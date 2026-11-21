/**
 * Security and anti-inspection protection for Synora 2K26 portal.
 * Eliminates plaintext credentials by using SHA-256 Web Crypto verification
 * and prevents browser inspection / devtools shortcuts.
 */

export const AUTH_HASH_CONFIG = {
  // SHA-256 of admin username
  userHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  // SHA-256 of salt + password
  passHash: '74e4aef979b0a7961edbd370a0270cb2382488b4bba1a645c3940c344d4bb754',
  salt: 'synora26_kishkinda_aiml_secure_',
} as const;

/**
 * Computes SHA-256 hash using browser native Web Crypto API.
 */
export async function computeSha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validates admin credentials securely via hash comparison.
 * The raw password string never resides in the bundle or console.
 */
export async function verifyAdminCredentials(
  user: string,
  pass: string
): Promise<boolean> {
  const cleanUser = user.trim().toLowerCase();
  const cleanPass = pass.trim();

  const userDigest = await computeSha256(cleanUser);
  const passDigest = await computeSha256(AUTH_HASH_CONFIG.salt + cleanPass);

  return (
    userDigest === AUTH_HASH_CONFIG.userHash &&
    passDigest === AUTH_HASH_CONFIG.passHash
  );
}

/**
 * Initializes client-side anti-inspect protections:
 * 1. Blocks right-click context menu (Inspect Element)
 * 2. Blocks inspection keys (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
 * 3. Silences console output to prevent credential inspection
 */
export function setupInspectProtection(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Disable right-click context menu
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };
  window.addEventListener('contextmenu', onContextMenu, { capture: true });

  // Disable DevTools shortcuts
  const onKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Ctrl+Shift+I / J / C (DevTools / Console / Element Inspector)
    if (
      ctrlOrCmd &&
      e.shiftKey &&
      ['i', 'j', 'c'].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Ctrl+U (View Page Source)
    if (ctrlOrCmd && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };
  window.addEventListener('keydown', onKeyDown, { capture: true });

  // Suppress console outputs
  const noop = () => {};
  const origLog = console.log;
  const origWarn = console.warn;
  const origInfo = console.info;
  const origDebug = console.debug;
  const origTable = console.table;

  console.log = noop;
  console.warn = noop;
  console.info = noop;
  console.debug = noop;
  console.table = noop;

  try {
    console.clear();
  } catch {
    // Ignore clear error
  }

  return () => {
    window.removeEventListener('contextmenu', onContextMenu, { capture: true });
    window.removeEventListener('keydown', onKeyDown, { capture: true });
    console.log = origLog;
    console.warn = origWarn;
    console.info = origInfo;
    console.debug = origDebug;
    console.table = origTable;
  };
}
