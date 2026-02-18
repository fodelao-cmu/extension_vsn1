// content.js - scans visible page content and highlights monetary patterns
(function () {
  const H_CLASS = 'capstein-highlight';
  const STYLE_ID = 'capstein-highlight-style';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `mark.${H_CLASS} { background: yellow; color: inherit; padding: 0 0.1em; border-radius: 2px; }`;
    (document.head || document.documentElement).appendChild(s);
  }

  function runOnce() {
    injectStyle();
    // Quite /b antes de dollars y asi para
    const regex = window.currencyRegex || /\p{Sc}|\b(?:usd|us\$|dollars?|dólares?|dolar(?:es)?|peso(?:s)?|mxn|million(?:s)?|mill[oó]n(?:es)?|mil)\b/giu;
    const fn = window.walkAndHighlight || function (root, r) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      let n; let c = 0;
      while ((n = walker.nextNode())) {
        try {
          c += window.highlightMatchesInTextNode ? window.highlightMatchesInTextNode(n, r, H_CLASS) : 0;
        } catch (e) {}
      }
      return c;
    };
    try {
      return fn(document.body, regex);
    } catch (e) {
      return 0;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOnce);
  } else runOnce();

  const observer = new MutationObserver((mutations) => {
    let added = false;
    for (const m of mutations) if (m.addedNodes && m.addedNodes.length) { added = true; break; }
    if (added) runOnce();
  });
  try {
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
})();
