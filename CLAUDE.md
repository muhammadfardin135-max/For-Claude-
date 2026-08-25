# Web browsing is set up in this repo

This repo is configured so a browser is ready to drive as soon as a session
starts. The owner is not a developer and works entirely from a phone — prefer
doing the browser work and reporting what happened over explaining how to do it.

## What the session-start hook already did

`.claude/hooks/session-start.sh` runs automatically and:

1. installs the `browser-use` CLI on Python 3.12,
2. runs `browser-use skill install` to register the browser-use skill,
3. starts headless Chromium with remote debugging on `127.0.0.1:9222`,
4. exports `BU_CDP_URL=http://127.0.0.1:9222` into the session.

So `browser-use` should just work. Do not re-install it.

## The working recipe

This sequence was tested end to end in this container. Follow it:

```bash
browser-use <<'PY'
ensure_real_tab()
goto_url("https://example.com")
wait_for_load()
print(page_info())
print(js("document.body.innerText")[:500])
PY
```

Filling a form works the same way:

```bash
browser-use <<'PY'
ensure_real_tab()
goto_url("https://httpbin.org/forms/post")
wait_for_load(); wait(1)
fill_input("input[name=custname]", "some value")
press_key("Enter")
PY
```

Four rules that make the difference between this working and not:

- **Always `wait_for_load()` after navigating.** Calling `page_info()` straight
  after a navigation raises `TypeError: Cannot read properties of null (reading
  'scrollWidth')` because the new document does not exist yet. Add `wait(2)` as
  well for pages that render client-side.
- **There is no `get_text()`.** Calling a helper that does not exist makes the
  CLI print its help text instead of running your script, which looks like a
  crash. Read page text with `js("document.body.innerText")`. Run
  `browser-use skill show` for the real list.
- **Prefer `ensure_real_tab()` + `goto_url()` over repeated `new_tab()`.**
  Stacking new tabs leaves the daemon attached to an orphaned one.
- **`TimeoutError` from `_ipc.py` on the first call after a daemon start is
  normal.** The action usually still happened. Re-run rather than concluding the
  setup is broken.

### When it gets stuck

A `scrollWidth` null error that repeats, or a hang, usually means the daemon is
attached to a dead tab. Recover with:

```bash
browser-use --reload
browser-use <<'PY'
ensure_real_tab()
print(page_info())
PY
```

`browser-use --doctor` shows whether the browser and daemon are alive. Setup
logs are at `/tmp/browser-use-setup.log` and `/tmp/browser-use-chrome.log`.

## Do not change the TLS setting

`scripts/launch-chrome-cdp.sh` passes `--ssl-version-max=tls1.2` because the
session's egress proxy resets Chromium's TLS 1.3 ClientHello, producing
`ERR_CONNECTION_RESET` on every HTTPS page. Disabling post-quantum key
agreement does not help — see `docs/browser-use-setup.md` for what was tried.
It caps the TLS version only and leaves certificate verification enabled; never
substitute `--ignore-certificate-errors`.

If the browser is not running at all:

```bash
setsid nohup ./scripts/launch-chrome-cdp.sh >/tmp/browser-use-chrome.log 2>&1 &
```

**Beware `pkill -f` with a pattern matching this repo's paths** — the pattern
can match the shell running it and kill the tool call (exit code 144). Use a
bracket in the pattern, e.g. `pkill -f "chrom[i]um"`, and keep the literal
browser path out of that same command.

## The browser has no memory

It is a fresh, signed-out Chromium with a clean profile, discarded when the
session ends. Nothing persists: no logins, no cookies, no extensions.

If a task needs a signed-in account, the sign-in has to happen inside that
browser during the session. Tell the owner plainly when a task needs
credentials rather than guessing, and never store passwords in this repo.

Some things genuinely will not work here and should be said outright rather
than worked around: CAPTCHA challenges, SMS or email verification codes, and
sites that block data-centre IP addresses. Signing up for accounts often hits
all three, and may breach the site's terms of service — check with the owner
before automating a signup rather than assuming it is wanted.
