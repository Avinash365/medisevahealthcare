// Helper to determine API base URL.
// Behavior:
// - During local development (hostname is localhost or 127.0.0.1) returns empty string to use relative '/api' paths.
// - Otherwise, returns VITE_APP_API_BASE if set, or empty string as fallback.
export function getApiBase() {
  // During local dev prefer the Vite dev proxy (relative '/api' paths)
  // even if VITE_APP_API_BASE is set in .env. This avoids accidentally
  // sending requests to a remote host while developing locally.
  try {
    if (typeof window !== 'undefined' && window && window.location) {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') return '';
    }
  } catch (e) {
    // ignore
  }

  // Not local — prefer explicit VITE_APP_API_BASE when provided (useful for deployed builds)
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_APP_API_BASE : '';
  return (env && String(env).trim() !== '') ? String(env).replace(/\/$/, '') : '';
}
