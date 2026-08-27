// Zero-dependency Chrome DevTools Protocol driver (Node 22 native WebSocket).
const CDP_HTTP = 'http://127.0.0.1:9222';

async function targetWs() {
  const r = await fetch(`${CDP_HTTP}/json/list`);
  const targets = await r.json();
  let page = targets.find(t => t.type === 'page');
  if (!page) {
    await fetch(`${CDP_HTTP}/json/new?about:blank`, { method: 'PUT' });
    page = (await (await fetch(`${CDP_HTTP}/json/list`)).json()).find(t => t.type === 'page');
  }
  return page.webSocketDebuggerUrl;
}

export class Browser {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.events = []; }

  static async connect() {
    const url = await targetWs();
    const ws = new WebSocket(url);
    const b = new Browser(ws);
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && b.pending.has(msg.id)) {
        const { resolve, reject } = b.pending.get(msg.id);
        b.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) b.events.push(msg);
    };
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    await b.send('Page.enable');
    await b.send('Runtime.enable');
    await b.send('DOM.enable');
    await b.setViewport(1280, 900);
    return b;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride',
      { width, height, deviceScaleFactor: 1, mobile: false });
  }

  // Resolve a selector to the FIRST VISIBLE match, not just the first match.
  async findVisible(selector) {
    return this.eval(`(() => {
      const els = [...document.querySelectorAll(${JSON.stringify(selector)})];
      const i = els.findIndex(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
      });
      return i; })()`);
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); reject(new Error(`timeout: ${method}`)); } }, 30000);
    });
  }

  async eval(expr) {
    const r = await this.send('Runtime.evaluate', {
      expression: expr, returnByValue: true, awaitPromise: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval error');
    return r.result.value;
  }

  async goto(url) {
    const r = await this.send('Page.navigate', { url });
    if (r.errorText) throw new Error(`navigation failed: ${r.errorText}`);
    await this.waitForLoad();
    return r;
  }

  async waitForLoad(timeout = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try { if (await this.eval('document.readyState') === 'complete') return true; } catch {}
      await new Promise(r => setTimeout(r, 200));
    }
    return false;
  }

  async text() { return this.eval('document.body ? document.body.innerText : ""'); }
  async title() { return this.eval('document.title'); }
  async url() { return this.eval('location.href'); }

  // --- Human-like input via real input events (not JS value assignment) ---
  async click(selector) {
    const box = await this.eval(`(() => {
      const els = [...document.querySelectorAll(${JSON.stringify(selector)})];
      const el = els.find(e => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
      });
      if (!el) return null;
      el.scrollIntoView({block:'center'});
      const r = el.getBoundingClientRect();
      return {x: r.x + r.width/2, y: r.y + r.height/2};
    })()`);
    if (!box) throw new Error(`click: selector not found: ${selector}`);
    for (const type of ['mousePressed', 'mouseReleased']) {
      await this.send('Input.dispatchMouseEvent', {
        type, x: box.x, y: box.y, button: 'left', clickCount: 1,
      });
    }
    return box;
  }

  // Click the first visible element whose trimmed text matches -- the way a
  // person says "click the Qatar link" rather than naming a CSS selector.
  async clickText(text, tag = 'a') {
    const box = await this.eval(`(() => {
      const want = ${JSON.stringify(text)}.toLowerCase();
      const el = [...document.querySelectorAll(${JSON.stringify(tag)})].find(e => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 &&
               (e.innerText || '').trim().toLowerCase() === want;
      });
      if (!el) return null;
      el.scrollIntoView({block:'center'});
      const r = el.getBoundingClientRect();
      return {x: r.x + r.width/2, y: r.y + r.height/2, href: el.href || ''};
    })()`);
    if (!box) throw new Error(`clickText: no visible <${tag}> with text "${text}"`);
    for (const type of ['mousePressed', 'mouseReleased'])
      await this.send('Input.dispatchMouseEvent',
        { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
    return box;
  }

  async links(limit = 20) {
    return this.eval(`JSON.stringify([...document.querySelectorAll('a[href]')]
      .filter(a => { const r = a.getBoundingClientRect(); return r.width>0 && r.height>0; })
      .slice(0, ${limit})
      .map(a => ({ text: (a.innerText||'').trim().slice(0,50), href: a.href })))`);
  }

  async type(selector, value, { delay = 30 } = {}) {
    await this.click(selector);
    for (const ch of value) {
      await this.send('Input.dispatchKeyEvent', { type: 'keyDown', text: ch });
      await this.send('Input.dispatchKeyEvent', { type: 'keyUp', text: ch });
      if (delay) await new Promise(r => setTimeout(r, delay));
    }
  }

  async press(key) {
    const map = { Enter: { windowsVirtualKeyCode: 13, text: '\r', key: 'Enter' },
                  Tab: { windowsVirtualKeyCode: 9, text: '\t', key: 'Tab' } };
    const k = map[key] || { key };
    await this.send('Input.dispatchKeyEvent', { type: 'keyDown', ...k });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', ...k });
  }

  async screenshot(path) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    const fs = await import('node:fs');
    fs.writeFileSync(path, Buffer.from(data, 'base64'));
    return path;
  }

  close() { this.ws.close(); }
}
