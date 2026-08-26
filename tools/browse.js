#!/usr/bin/env node
/**
 * browse.js - open a real web page, act on it, and save what it looks like.
 *
 * Usage:
 *   node tools/browse.js <url> [--search "words"] [--click "link text"]
 *                              [--wait 5000] [--out name] [--full]
 *
 * Saves a screenshot and the page's readable text into ./browse-output/.
 *
 * IMPORTANT (learned the hard way, 2026-08-26):
 * This sandbox inspects outgoing encrypted traffic and drops Chromium's
 * TLS 1.3 handshakes, which shows up as ERR_CONNECTION_RESET on EVERY site.
 * Capping at TLS 1.2 fixes it. Do not remove that launch flag.
 */
const fs = require('fs');
const path = require('path');

function loadPlaywright() {
  try { return require('playwright'); } catch (_) {}
  const globalDir = '/opt/node22/lib/node_modules';
  try { return require(path.join(globalDir, 'playwright')); } catch (_) {}
  console.error('Playwright is not installed. Run: npm install -g playwright');
  process.exit(1);
}

function findChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (!fs.existsSync(base)) return undefined;
  const hit = fs.readdirSync(base)
    .filter(n => n.startsWith('chromium-'))
    .map(n => path.join(base, n, 'chrome-linux', 'chrome'))
    .find(p => fs.existsSync(p));
  return hit;                       // undefined => let Playwright decide
}

/**
 * Pick the box that is actually the search field. Scores every visible text
 * input by how search-like its attributes look, rather than trusting order.
 */
async function pickSearchBox(page) {
  const inputs = await page.$$('input:visible, textarea:visible');
  let best = null, bestScore = -1;
  for (const el of inputs) {
    const info = await el.evaluate(e => ({
      type: (e.getAttribute('type') || 'text').toLowerCase(),
      name: (e.getAttribute('name') || '').toLowerCase(),
      id: (e.getAttribute('id') || '').toLowerCase(),
      ph: (e.getAttribute('placeholder') || '').toLowerCase(),
      aria: (e.getAttribute('aria-label') || '').toLowerCase(),
      role: (e.getAttribute('role') || '').toLowerCase(),
    }));
    if (['hidden', 'checkbox', 'radio', 'submit', 'file', 'password'].includes(info.type)) continue;

    const blob = [info.name, info.id, info.ph, info.aria, info.role].join(' ');
    let score = 0;
    if (info.type === 'search') score += 10;
    if (/search|query|keyword/.test(blob)) score += 6;
    if (/\u0628\u062D\u062B|\u0643\u0644\u0645\u0629/.test(blob)) score += 6;  // Arabic: search / word
    if (info.name === 'q' || info.id === 'q') score += 5;
    if (info.type === 'text') score += 1;
    if (/email|mail|user|login|phone|zip|postal/.test(blob)) score -= 8;

    if (score > bestScore) { bestScore = score; best = el; }
  }
  return best;
}

function parseArgs(argv) {
  const out = { url: null, wait: 6000, name: 'page', full: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--search') out.search = argv[++i];
    else if (a === '--click') out.click = argv[++i];
    else if (a === '--wait') out.wait = parseInt(argv[++i], 10) || 6000;
    else if (a === '--out') out.name = argv[++i];
    else if (a === '--full') out.full = true;
    else if (!out.url) out.url = a;
  }
  return out;
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url) {
    console.error('Usage: node tools/browse.js <url> [--search "words"] [--click "text"]');
    process.exit(1);
  }

  const { chromium } = loadPlaywright();
  const outDir = path.resolve('browse-output');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: findChromium(),
    args: ['--no-sandbox', '--disable-gpu', '--ssl-version-max=tls1.2'],
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

    console.log(`opening ${args.url}`);
    await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(args.wait);

    if (args.search) {
      const handle = await pickSearchBox(page);
      if (!handle) throw new Error('could not find a search box on this page');
      await handle.click();
      await handle.type(args.search, { delay: 120 });
      const before = page.url();
      await page.keyboard.press('Enter');
      console.log(`typed "${args.search}" into the search box and pressed Enter`);
      await page.waitForTimeout(args.wait + 3000);

      // Some sites ignore Enter and need their button clicked instead.
      if (page.url() === before) {
        const btn = page.locator(
          'button[type=submit]:visible, input[type=submit]:visible, ' +
          '[role=button]:visible'
        ).first();
        if (await btn.count()) {
          await btn.click({ timeout: 5000 }).catch(() => {});
          console.log('page did not move on Enter - clicked the search button');
          await page.waitForTimeout(args.wait);
        }
      }
    }

    if (args.click) {
      await page.getByText(args.click, { exact: false }).first().click();
      console.log(`clicked "${args.click}"`);
      await page.waitForTimeout(args.wait);
    }

    const shot = path.join(outDir, `${args.name}.png`);
    const textFile = path.join(outDir, `${args.name}.txt`);
    await page.screenshot({ path: shot, fullPage: args.full });

    const text = (await page.locator('body').innerText()).replace(/\n{3,}/g, '\n\n');
    fs.writeFileSync(textFile, text);

    console.log(`final address: ${page.url()}`);
    console.log(`screenshot:    ${shot}`);
    console.log(`page text:     ${textFile}  (${text.length} characters)`);
    console.log('\n----- first part of the page text -----\n');
    console.log(text.slice(0, 1500));
  } finally {
    await browser.close();
  }
})().catch(err => { console.error('FAILED:', err.message); process.exit(1); });
