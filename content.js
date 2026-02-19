// content.js

(() => {
  const H_CLASS = 'capstein-highlight';
  const STYLE_ID = 'capstein-highlight-style';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      `mark.${H_CLASS} { background: yellow; padding: 0 0.1em; border-radius: 2px; }`;

    document.head.appendChild(style);
  }

  function init() {
    injectStyle();
    walkAndHighlight(document.body, currencyRegex);
  }

  init();

  new MutationObserver(() => {
    walkAndHighlight(document.body, currencyRegex);
  }).observe(document.body, { childList: true, subtree: true });

})();
