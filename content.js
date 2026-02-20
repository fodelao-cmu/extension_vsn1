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

  function sendMatches(matches) {
    if (matches && matches.length > 0) {
      chrome.runtime.sendMessage({
        type: "DETECTED",
        data: matches
      }, (response) => {
        console.log("Matches sent to background:", matches);
      });
    }
  }

  function init() {
    injectStyle();
    const matches = walkAndHighlight(document.body, currencyRegex);
    sendMatches(matches);
  }

  init();

  new MutationObserver(() => {
    const matches = walkAndHighlight(document.body, currencyRegex);
    sendMatches(matches);
  }).observe(document.body, { childList: true, subtree: true });

})();
