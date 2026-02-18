// utils.js - currency detection and DOM highlighting helpers
const currencyRegex = /\p{Sc}|\b(?:usd|us\$|dollars?|dólares?|dolar(?:es)?|peso(?:s)?|mxn|million(?:s)?|mill[oó]n(?:es)?|mil)\b/giu;

function findCurrencyTerms(text) {
  if (typeof text !== 'string' || text.length === 0) return [];
  const results = [];
  let m;
  currencyRegex.lastIndex = 0;
  while ((m = currencyRegex.exec(text)) !== null) {
    results.push({ match: m[0], index: m.index });
  }
  return results;
}

function isNodeVisible(node) {
  const el = node && (node.parentElement || node.parentNode);
  if (!el || el.nodeType !== 1) return false;
  try {
    const rects = el.getClientRects();
    if (!rects || rects.length === 0) return false;
    const style = window.getComputedStyle(el);
    if (style && (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) === 0)) return false;
  } catch (e) {
    return false;
  }
  return true;
}

function isInsideHighlight(node, className = 'capstein-highlight') {
  const el = node && (node.parentElement || node.parentNode);
  try {
    return !!(el && el.closest && el.closest(`mark.${className}`));
  } catch (e) {
    return false;
  }
}

function shouldSkipNode(node, className = 'capstein-highlight') {
  if (!node || node.nodeType !== Node.TEXT_NODE) return true;
  const parent = node.parentNode;
  if (!parent || parent.nodeType !== 1) return true;
  const bad = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'HEAD'];
  const pName = parent.nodeName;
  if (bad.includes(pName)) return true;
  if (parent.isContentEditable) return true;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(pName)) return true;
  if (isInsideHighlight(node, className)) return true;
  if (!isNodeVisible(node)) return true;
  return false;
}

function highlightMatchesInTextNode(textNode, regex, className = 'capstein-highlight') {
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE || !textNode.nodeValue) return 0;
  if (shouldSkipNode(textNode, className)) return 0;
  const text = textNode.nodeValue;
  regex = new RegExp(regex.source, 'giu');
  const matches = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    matches.push({ index: m.index, length: m[0].length });
  }
  if (matches.length === 0) return 0;

  const frag = document.createDocumentFragment();
  let last = 0;
  for (const mm of matches) {
    if (mm.index > last) frag.appendChild(document.createTextNode(text.slice(last, mm.index)));
    const mark = document.createElement('mark');
    mark.className = className;
    mark.textContent = text.slice(mm.index, mm.index + mm.length);
    frag.appendChild(mark);
    last = mm.index + mm.length;
  }
  if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
  textNode.parentNode.replaceChild(frag, textNode);
  return matches.length;
}

function walkAndHighlight(root, regex) {
  if (!root) return 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  let node;
  let count = 0;
  const textNodes = [];
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }
  for (const tn of textNodes) {
    count += highlightMatchesInTextNode(tn, regex);
  }
  return count;
}

try {
  window.currencyRegex = currencyRegex;
  window.findCurrencyTerms = findCurrencyTerms;
  window.highlightMatchesInTextNode = highlightMatchesInTextNode;
  window.walkAndHighlight = walkAndHighlight;
} catch (e) {}
