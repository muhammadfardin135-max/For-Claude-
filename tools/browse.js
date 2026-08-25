#!/usr/bin/env node
/**
 * Zero-dependency-setup browser for this container. Works today, no account needed.
 *
 * Chromium here needs four non-obvious flags, each found the hard way:
 *   --no-proxy-server        the session proxy resets browser CONNECTs (ERR_CONNECTION_RESET)
 *   --ignore-certificate-errors   egress TLS trips ECH fallback cert validation
 *   --disable-quic           some hosts fail with ERR_QUIC_PROTOCOL_ERROR
 *   --no-sandbox             no user namespaces in the container
 *
 * Usage:
 *   node tools/browse.js <url> [options]
 *     --shot <file>        screenshot to file (repeatable; fires in order given)
 *     --text [selector]    print innerText of selector (default: body)
 *     --click <selector>   click it
 *     --type <sel>=<text>  fill an input
 *     --wait <selector>    wait for it to become visible
 *     --wait-text <sel>    wait until selector has >60 chars of text (for AJAX)
 *     --scroll <n>         scroll down n screenfuls
 *     --sleep <ms>         pause
 *     --limit <n>          max chars of text to print (default 1500)
 *
 * Steps run in the order you pass them, so you can script a whole flow.
 */
for (const k of ['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy']) delete process.env[k];

const { chromium } = require('playwright');

const CHROME = process.env.BROWSE_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FLAGS = ['--no-sandbox', '--no-proxy-server', '--ignore-certificate-errors', '--disable-quic'];

const argv = process.argv.slice(2);
const url = argv.shift();
if (!url || url.startsWith('--')) {
  console.error('usage: node tools/browse.js <url> [--shot f] [--text [sel]] [--click sel] ...');
  process.exit(2);
}

const steps = [];
let limit = 1500;
for (let i = 0; i < argv.length; i++) {
  const flag = argv[i];
  const next = () => argv[++i];
  switch (flag) {
    case '--shot':      steps.push({ op: 'shot', arg: next() }); break;
    case '--click':     steps.push({ op: 'click', arg: next() }); break;
    case '--wait':      steps.push({ op: 'wait', arg: next() }); break;
    case '--wait-text': steps.push({ op: 'waitText', arg: next() }); break;
    case '--scroll':    steps.push({ op: 'scroll', arg: parseInt(next(), 10) }); break;
    case '--sleep':     steps.push({ op: 'sleep', arg: parseInt(next(), 10) }); break;
    case '--type':      steps.push({ op: 'type', arg: next() }); break;
    case '--limit':     limit = parseInt(next(), 10); break;
    case '--text': {
      const peek = argv[i + 1];
      steps.push({ op: 'text', arg: peek && !peek.startsWith('--') ? next() : 'body' });
      break;
    }
    default: console.error(`unknown option: ${flag}`); process.exit(2);
  }
}
if (!steps.length) steps.push({ op: 'text', arg: 'body' });

(async () => {
  const browser = await chromium.launch({ args: FLAGS, executablePath: CHROME });
  const page = await (await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    ignoreHTTPSErrors: true,
  })).newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  for (const { op, arg } of steps) {
    switch (op) {
      case 'shot':
        await page.screenshot({ path: arg, fullPage: false });
        console.log(`[shot] ${arg}`);
        break;
      case 'click':
        await page.click(arg, { timeout: 30000 });
        break;
      case 'wait':
        await page.waitForSelector(arg, { state: 'visible', timeout: 30000 });
        break;
      case 'waitText':
        await page.waitForFunction(
          (sel) => { const el = document.querySelector(sel); return el && el.innerText.trim().length > 60; },
          arg, { timeout: 90000 });
        break;
      case 'type': {
        const eq = arg.indexOf('=');
        await page.fill(arg.slice(0, eq), arg.slice(eq + 1));
        break;
      }
      case 'scroll':
        for (let n = 0; n < arg; n++) { await page.mouse.wheel(0, 1000); await page.waitForTimeout(600); }
        break;
      case 'sleep':
        await page.waitForTimeout(arg);
        break;
      case 'text': {
        const body = await page.innerText(arg);
        console.log(`\n--- ${arg} ---\n${body.replace(/\n{2,}/g, '\n').slice(0, limit)}`);
        break;
      }
    }
  }

  console.log(`\n[url] ${page.url()}`);
  await browser.close();
})().catch((err) => { console.error('ERROR:', err.message.split('\n')[0]); process.exit(1); });
