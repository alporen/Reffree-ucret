(() => {
  const key = 'hakem-ucret-temasi-v1';
  try {
    const fromApp = new URLSearchParams(window.location.search).get('theme');
    const saved = fromApp || window.localStorage.getItem(key);
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch { /* Uygulama varsayılan açık temada başlar. */ }
})();
