#!/usr/bin/env node
// List the interactive elements on a page, so a selector is looked up, not guessed.
// Usage: node browser/inspect.mjs https://example.com
import { Browser } from './cdp.mjs';
const b = await Browser.connect();
await b.goto(process.argv[2]);
await new Promise(r => setTimeout(r, 2500));
console.log('TITLE:', await b.title());
console.log('URL:  ', await b.url());
console.log(await b.eval(`JSON.stringify(
  [...document.querySelectorAll('input,textarea,button,select,[contenteditable],a[href]')]
    .filter(el => { const r = el.getBoundingClientRect();
                    const cs = getComputedStyle(el);
                    return r.width > 0 && r.height > 0 &&
                           cs.visibility !== 'hidden' && cs.display !== 'none'; })
    .slice(0, 40)
    .map(el => ({ tag: el.tagName.toLowerCase(), type: el.type || '',
                  name: el.name || '', id: el.id || '',
                  placeholder: el.placeholder || '',
                  aria: el.getAttribute('aria-label') || '',
                  text: (el.innerText || '').trim().slice(0, 40) })), null, 1)`));
b.close();
