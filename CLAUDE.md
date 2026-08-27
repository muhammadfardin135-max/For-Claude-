# Project rules

This repo holds the owner's Claude Code setup: the communication rules that
govern how Claude explains things, and a working browser the agent can drive.

## How to talk to the user

The user is not a developer and does not want mechanism explained. Follow the
communication rules in the file below for every explanation, summary, and error
report in this repo.

@explain-simply/CLAUDE-snippet.md

## Claims about this repo come from checking, not from expectation

Any statement about how this project, its tooling, or its environment behaves is
something to verify before writing it down. Four failures here came from
ignoring that, and every one of them looked verified at the time.

**Never record a cause without testing its absence.** The agent proxy CA was
documented as required because HTTPS started working once it was imported.
Removing it and retesting showed pages load fine without it — the certificate
errors had come from unrelated background requests. *"It worked after I did X"*
is not evidence that X was needed. Take X away and retest before writing it
down.

**A test that resembles the real conditions has not tested them.** The
session-start hook passed when run from an interactive shell, then silently
failed when the harness ran it for real — a hook runs as a process-group
leader, and the shell test did not. Reproduce the actual invocation, not the
convenient approximation, before calling something validated.

**Never write a prediction as a fact, and never let an instruction depend on
one.** This file once asserted that `browser-use` "should just work" and told
the reader not to re-install it. When the hook did not fire, that sentence
blocked the one action that would have fixed it. Anything about future state is
a claim to be checked at the time — so write the check, and a fallback for when
it fails.

**Report observation and inference in different voices.** "Verified from cold:
6 seconds" and "should be fine next session" are different kinds of statement
and must never be delivered in the same tone. An untested claim is labelled
untested, or left out. Gaps stay visible.

**Never call work done at the edge of your own actions.** The explain-simply
setup was reported as "already wired up" because the files were written,
committed and pushed — every action available had succeeded. It changed nothing
for the user: the branch was unmerged, so the next session would still read the
old file. Completion is measured at the user's next session, not at the agent's
last command. This container is discarded and an unmerged branch is invisible to
every session that follows, so state where the work is live, where it is not,
and what the user must do to close the gap — before saying done.

**A step the user must take is never phrased as an offer.** The merge was
mentioned, last, as "say the word if you want one", and so read as optional.
That is worse than omitting it: it looks like the user was told. Requirements
are stated as requirements, up front. The same failure in other clothes —
"installed" for something living only in this container, "connected" for a
session-scoped connection, "passing" for tests run only here — is the same
root: reporting the agent's workspace as the user's world.

## Access boundary

Public, free, and officially released material — or files the user supplies
themselves. No paywall circumvention, no DRM, no pirated copies. When something
turns out to be paid, say so plainly rather than working around it.

## Never fabricate

No invented statistics, case studies, names, or results in anything generated
here. Use `[INSERT: specific detail]` and tell the user what to supply.

## Layout

| Path | What it is |
|---|---|
| `explain-simply/` | The communication rules, and where to install them |
| `scripts/` | Browser launcher |
| `docs/` | Setup notes for the browser |
| `.claude/hooks/` | Session-start setup |

## Browsing the web

A real browser is available and starts automatically. The owner is not a
developer and works from a phone — do the browser work and report what
happened rather than explaining how to do it.

`.claude/hooks/session-start.sh` normally runs at session start and installs
the `browser-use` CLI on Python 3.12, registers its skill, launches headless
Chromium with remote debugging on `127.0.0.1:9222`, and exports `BU_CDP_URL`.

**Do not assume it ran.** The hook has been observed not firing, and when that
happens `browser-use` is simply absent. Before browser work, check, and set it
up yourself if it is missing — the script is idempotent and safe to re-run:

```bash
command -v browser-use >/dev/null 2>&1 || \
  env CLAUDE_CODE_REMOTE=true CLAUDE_PROJECT_DIR="$PWD" \
      ./.claude/hooks/session-start.sh
export BU_CDP_URL="http://127.0.0.1:9222"
```

That takes under a minute from cold. Running it is always preferable to
telling the owner the browser is unavailable.

It fetches pages that plain `WebFetch` cannot read. It does **not** relax the
access boundary above — no paywall circumvention, no DRM, no pirated copies.
A page a browser can technically render is not thereby permitted material.

### The working recipe

```bash
browser-use <<'PY'
ensure_real_tab()
goto_url("https://example.com")
wait_for_load()
print(page_info())
print(js("document.body.innerText")[:500])
PY
```

Filling a form is the same shape, with `fill_input("input[name=x]", "value")`
and `press_key("Enter")`.

Four rules decide whether this works:

- **Always `wait_for_load()` after navigating.** Calling `page_info()` straight
  after a navigation raises `TypeError: Cannot read properties of null (reading
  'scrollWidth')` because the new document does not exist yet. Add `wait(2)` for
  pages that render client-side.
- **There is no `get_text()`.** Calling a helper that does not exist makes the
  CLI print its help text instead of running the script, which reads like a
  crash. Use `js("document.body.innerText")`; `browser-use skill show` lists the
  real helpers.
- **Prefer `ensure_real_tab()` + `goto_url()` over repeated `new_tab()`**, which
  leaves the daemon attached to an orphaned tab.
- **A `TimeoutError` from `_ipc.py` on the first call after a daemon start is
  normal.** The action usually still happened — re-run it.

When it hangs or the `scrollWidth` error repeats, the daemon is on a dead tab:
run `browser-use --reload`, then `ensure_real_tab()`. `browser-use --doctor`
shows what is alive. Logs: `/tmp/browser-use-setup.log`,
`/tmp/browser-use-chrome.log`.

If the browser itself is not running, start it with `setsid --fork` — plain
`setsid` will not survive, because a caller that is already a process-group
leader makes setsid exec in place instead of forking:

```bash
setsid --fork nohup ./scripts/launch-chrome-cdp.sh \
  >/tmp/browser-use-chrome.log 2>&1 </dev/null
```

An empty `/tmp/browser-use-chrome.log` plus nothing on port 9222 is that exact
failure — the browser was reaped before it wrote a line.

### Do not change the TLS setting

`scripts/launch-chrome-cdp.sh` passes `--ssl-version-max=tls1.2` because the
session's egress proxy resets Chromium's TLS 1.3 ClientHello, breaking every
HTTPS page. It caps the version only and leaves certificate verification on —
never substitute `--ignore-certificate-errors`. See
`docs/browser-use-setup.md` for what else was tried.

Beware `pkill -f` with a pattern matching this repo's paths: it can match the
shell running it and kill the tool call (exit 144). Use `pkill -f "chrom[i]um"`
and keep the literal browser path out of that same command.

### The browser has no memory

It is a fresh, signed-out Chromium, discarded when the session ends — no
logins, no cookies, no extensions. A task needing an account requires signing
in during that session. Say so plainly rather than guessing, and never store
passwords in this repo.

CAPTCHAs, SMS and email verification codes, and sites that block data-centre
IPs will not work here; say so outright instead of working around them.
Automated signups hit all three and may breach a site's terms — ask before
assuming one is wanted.
