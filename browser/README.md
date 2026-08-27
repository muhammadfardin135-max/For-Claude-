# Driving a browser with no installs

The container already ships a real Chromium binary at `/opt/pw-browsers/chromium`,
and Node 22 has a built-in `WebSocket`. That is everything needed to drive a
browser over the Chrome DevTools Protocol — no `pip install`, no `npm install`,
no session-start hook.

## Use

```bash
./browser/launch.sh                              # start Chromium on 127.0.0.1:9222
node browser/inspect.mjs https://example.com     # see what is actually on the page
```

Then write a short script:

```js
import { Browser } from './browser/cdp.mjs';

const b = await Browser.connect();
await b.goto('https://en.wikipedia.org/wiki/Main_Page');
await b.type('input[name=search]', 'Doha');   // real keystrokes
await b.press('Enter');
await b.waitForLoad();
console.log(await b.title());
await b.clickText('Qatar', 'a');              // click by visible text
await b.screenshot('page.png');
b.close();
```

## API

| Method | Does |
| --- | --- |
| `Browser.connect()` | attach to the running browser, viewport 1280x900 |
| `goto(url)` | navigate and wait for load |
| `text()` / `title()` / `url()` | read the page |
| `eval(js)` | run JavaScript in the page, get the value back |
| `type(sel, str)` | click the field, then send real key events per character |
| `click(sel)` | real mouse press/release at the element's centre |
| `clickText(text, tag)` | click the first visible element with that exact text |
| `press('Enter')` | send a key |
| `links(n)` | list visible links |
| `screenshot(path)` | PNG of the viewport |
| `setViewport(w, h)` | resize |

## Four things that actually caused failures here

1. **Guessing selectors.** `input[name=q]` was wrong on DuckDuckGo (it is a
   `textarea`). Run `inspect.mjs` and read the real one instead of guessing.
2. **Default viewport is tiny.** Wikipedia's responsive layout collapsed its
   search box to `0x0`, so typing went nowhere and the field stayed empty.
   `Browser.connect()` now sets 1280x900 up front.
3. **`querySelector` finds hidden elements.** Several pages have more than one
   match for the same selector, and the first is invisible. `click` and `type`
   pick the first *visible* match.
4. **Client-rendered pages need a wait.** `document.readyState === 'complete'`
   fires before an SPA has painted results; add an explicit sleep before
   reading text.

## What this cannot do

Bot detection. A search on DuckDuckGo typed and submitted correctly, and the
site answered with a "select all squares containing a duck" CAPTCHA — headless
Chromium on a datacenter IP is recognisable. No amount of driver code fixes
that, and it is not specific to this approach.

## TLS note

`--ssl-version-max=tls1.2` is deliberate: the session's egress proxy resets
Chromium's TLS 1.3 ClientHello. It caps the negotiated version only and leaves
certificate verification fully on.
