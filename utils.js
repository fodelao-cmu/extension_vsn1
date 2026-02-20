// utils.js

const currencyRegex =
  /\p{Sc}|\b(?:usd|us\$|dollars?|dólares?|dolar(?:es)?|peso(?:s)?|mxn|million(?:s)?|mill[oó]n(?:es)?|mil)\b/giu;

function shouldSkipNode(node, className = 'capstein-highlight') {
  if (!node || node.nodeType !== Node.TEXT_NODE) return true;

  const parent = node.parentNode;
  if (!parent || parent.nodeType !== 1) return true;

  const blocked = ['SCRIPT','STYLE','NOSCRIPT','IFRAME','OBJECT','HEAD'];
  if (blocked.includes(parent.nodeName)) return true;

  if (parent.closest(`mark.${className}`)) return true;

  return false;
}

function highlightMatchesInTextNode(textNode, regex, className = 'capstein-highlight') {
  if (shouldSkipNode(textNode, className)) return [];

  const text = textNode.nodeValue;
  if (!text) return [];

  const matches = [...text.matchAll(regex)];
  if (!matches.length) return [];

  const frag = document.createDocumentFragment();
  let last = 0;
  const foundMatches = [];

  for (const m of matches) {
    const start = m.index;
    const end = start + m[0].length;

    if (start > last)
      frag.appendChild(document.createTextNode(text.slice(last, start)));

    const mark = document.createElement('mark');
    mark.className = className;
    mark.textContent = m[0];
    frag.appendChild(mark);
    
    foundMatches.push(m[0]);

    last = end;
  }

  if (last < text.length)
    frag.appendChild(document.createTextNode(text.slice(last)));

  textNode.parentNode.replaceChild(frag, textNode);

  return foundMatches;
}

function walkAndHighlight(root, regex = currencyRegex) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  const allMatches = [];

  while ((node = walker.nextNode())) {
    const matches = highlightMatchesInTextNode(node, regex);
    allMatches.push(...matches);
  }

  return allMatches;
}
