# browser-use setup

Notes from setting up `browser-use` in a Claude Code remote (cloud) session.

## Install

```bash
uv tool install --python 3.12 --upgrade browser-use
browser-use skill install
```

Installed:

| Component | Version |
| --- | --- |
| `browser-use` library | 0.13.8 |
| `browser-use` / `browser-harness` CLI | 0.1.9 |
| Python | 3.12.3 |

`browser-use skill install` self-upgrades the library and writes `SKILL.md` into
every agent skills directory it knows about (`~/.claude/skills/browser-use/`,
`~/.agents/`, `~/.codex/`, `~/.cursor/`, `~/.gemini/`, and others).

Executables installed: `browser-use`, `browser`, `browseruse`, `bu`,
`browser-use-tui`.

## Connecting to a browser

`browser-use` attaches to a running Chromium-family browser over CDP. Its default
discovery scans the standard Chrome profile directories for a `DevToolsActivePort`
file, then falls back to probing ports 9222/9223.

That discovery does not find a browser launched with a non-standard
`--user-data-dir`, so point the daemon at the endpoint explicitly:

```bash
export BU_CDP_URL=http://127.0.0.1:9222
```

Start the browser with `./scripts/launch-chrome-cdp.sh`, then verify:

```bash
browser-use --doctor
browser-use <<'PY'
new_tab("https://example.com"); print(page_info())
PY
```

The first call after a daemon restart can time out while the daemon boots; the
navigation still happens. Re-run and it responds normally.

## Two gotchas behind the agent proxy

Both produce failures that look like the browser is broken rather than the
network being restricted.

### 1. The proxy CA is not in Chromium's trust store

The session's agent proxy re-terminates TLS, so its CA must be trusted. The
NSS store Chromium reads (`~/.pki/nssdb`) existed but was empty, giving
`net_error -202` (`ERR_CERT_AUTHORITY_INVALID`) on every HTTPS page:

```bash
apt-get update && apt-get install -y libnss3-tools
certutil -d sql:"$HOME/.pki/nssdb" -A -t "C,," \
         -n "CCR Agent Proxy CA" -i /root/.ccr/agent-proxy-ca.crt
```

### 2. TLS 1.3 ClientHello gets reset

With the CA trusted, HTTPS still failed with `ERR_CONNECTION_RESET` while
`curl` to the same host through the same proxy returned 200, and a hand-rolled
`CONNECT` + Python TLS 1.3 handshake through the proxy also succeeded — so the
proxy itself was fine and the problem was specific to Chromium's ClientHello.

Disabling the post-quantum key agreement did **not** help. None of these changed
the result:

- `--disable-features=PostQuantumKyber`
- `--disable-features=X25519MLKEM768`
- `--disable-features=PostQuantumKyber,X25519MLKEM768,PostQuantumKeyAgreement,TLS13KyberX25519`
- `PostQuantumKeyAgreementEnabled: false` via managed policy in
  `/etc/chromium/policies/managed/`

The only setting that worked is capping the TLS version:

```
--ssl-version-max=tls1.2
```

This caps the negotiated TLS version only. Certificate verification stays fully
enabled — do not substitute `--ignore-certificate-errors`.

The root cause was not isolated further; TLS 1.2 is a workaround, not a fix.

## Scope limit: this is not your local browser

This runs in an ephemeral cloud container. The browser it drives is the
container's headless Chromium — a clean profile with no logins, cookies, or
extensions. `browser-use` cannot reach a browser on your own machine from here;
nothing in the container can open a connection to your laptop.

To drive your own logged-in browser, run `browser-use` locally on that machine.
For an isolated cloud browser instead, `browser-use auth login` plus
`start_remote_daemon(name)` uses Browser Use Cloud (a paid, billed-while-running
service) — left unconfigured here.

Everything in this container is discarded when the session ends, including the
installed tool, the NSS trust change, and the browser profile.
