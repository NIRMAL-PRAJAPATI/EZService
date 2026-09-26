// Light / dark / system theme. The choice is saved on this device and applied
// by setting data-theme="dark" on <html>; index.css holds the dark palette.

const KEY = 'ez-theme';
const EVENT = 'ez:theme-change';
const media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

export const THEME_OPTIONS = ['light', 'dark', 'system'];

export const getThemePreference = () => {
  try {
    const saved = localStorage.getItem(KEY);
    return THEME_OPTIONS.includes(saved) ? saved : 'light';
  } catch {
    return 'light';
  }
};

const resolve = (pref) => (pref === 'system' ? (media?.matches ? 'dark' : 'light') : pref);

export const applyTheme = (pref = getThemePreference()) => {
  const theme = resolve(pref);
  const root = document.documentElement;
  if (theme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#1a1b20' : '#ffffff');
};

export const setThemePreference = (pref) => {
  try {
    localStorage.setItem(KEY, pref);
  } catch {
    /* storage unavailable: still apply for this visit */
  }
  applyTheme(pref);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: pref }));
};

export const onThemeChange = (handler) => {
  const listener = (e) => handler(e.detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
};

// Follow the phone/computer setting live when "System" is chosen.
export const initTheme = () => {
  applyTheme();
  media?.addEventListener?.('change', () => {
    if (getThemePreference() === 'system') applyTheme('system');
  });
};
