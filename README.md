# Browser capability setup

Two browsing paths live in this repo. One works right now with no account;
the other needs ~2 minutes of your time and then works far better.

---

## Path A — works today, nothing to set up

`tools/browse.js` drives the Chromium already installed in this container.

```bash
node tools/browse.js https://example.com --text
```

A full scripted flow in one command — this is a real search on shamela.ws:

```bash
node tools/browse.js "https://shamela.ws/" \
  --click "i.fa-search" --sleep 1200 \
  --click "text=بحث في كل الكتب" --sleep 1000 \
  --type "#fld_srchAll=الزكاة" \
  --click "#bu_srchAll" \
  --wait-text "#srch_res" \
  --text "#srch_res" --shot results.png
```

Steps execute in the order given, so `--click`, `--type`, `--wait-text`,
`--scroll`, `--shot` and `--text` compose into one pass.

### Container-specific flags

The script hardcodes four launch flags. Each one is required here, and none
are obvious — they cost about a dozen failed runs to find:

| Flag | Fixes |
| --- | --- |
| `--no-proxy-server` (+ unsetting `HTTPS_PROXY`) | The session proxy resets browser `CONNECT`s → `ERR_CONNECTION_RESET` on *every* site |
| `--ignore-certificate-errors` | Egress TLS trips `ERR_ECH_FALLBACK_CERTIFICATE_INVALID` |
| `--disable-quic` | Some hosts fail with `ERR_QUIC_PROTOCOL_ERROR` |
| `--no-sandbox` | No user namespaces in the container |

**Limits:** every run is a cold browser with no memory of the last one. No
saved logins, no CAPTCHA handling, no stealth fingerprint, and no live view
for you to watch. Scripts are written blind and debugged by re-running.

---

## Path B — Browserbase (recommended)

Uses Browserbase's **hosted** MCP server. Compared to the self-hosted `npx`
route this needs no Node process, no `mcp-remote`, and **no Gemini API key**
— Browserbase covers the model cost for the hosted server.

`.mcp.json` is already written and committed:

```json
{
  "mcpServers": {
    "browserbase": {
      "type": "http",
      "url": "https://mcp.browserbase.com/mcp?browserbaseApiKey=${BROWSERBASE_API_KEY}&browserbaseProjectId=${BROWSERBASE_PROJECT_ID}"
    }
  }
}
```

Credentials are `${VAR}` references, not literals — Claude Code expands
environment variables in all MCP configs, so nothing secret is in git.

### The three steps only you can do

**1. Get credentials (~2 min).** Sign up at
[browserbase.com](https://www.browserbase.com), then from Settings copy your
**API Key** and **Project ID**. The free tier is enough to try this.

**2. Set them as environment variables on your Claude Code environment.**
Add `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` in your environment's
settings — see the
[Claude Code on the web docs](https://code.claude.com/docs/en/claude-code-on-the-web).

> Use the environment settings, **not** a `.env` file. This container is
> ephemeral and wiped between sessions; only committed files and
> environment-level variables survive. `.env.example` shows the names and is
> gitignored in its filled-in form.

**3. Start a new session.** MCP servers are loaded at startup, so
`.mcp.json` takes effect on the *next* session, not this one. Approve the
`browserbase` server when prompted.

### Verify it worked

```bash
bash tools/verify-browserbase.sh
```

Opens a real Browserbase session and prints `OK`, or tells you exactly what
failed (`401 Unauthorized` means the key or project ID is wrong).

### What you get

Six tools — `start`, `end`, `navigate`, `act`, `observe`, `extract` — backed
by Stagehand. `act` takes plain instructions ("click the search icon, search
for X") instead of CSS selectors, against a *persistent* session, so each
step gets real feedback instead of a blind script rerun. Plus managed egress,
CAPTCHA handling, stealth fingerprints, saved login contexts, a live view
URL, and session replay.

---

## Which to use

Path A for quick public-page reads. Path B for anything logged-in,
CAPTCHA-guarded, or repeated. Path A keeps working after B is set up, so
this is additive.
