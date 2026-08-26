# Sales corpus agent — project rules

This repo is a **grounded sales knowledge base**. The user curated a specific
set of sales resources because general LLM training blends good sales advice
with bad. Everything here exists to make output traceable to those chosen
sources instead of to training-data averages.

## How to talk to the user

The user is not a developer and does not want mechanism explained. Follow the
communication rules in the file below for every explanation, summary, and error
report in this repo.

@explain-simply/CLAUDE-snippet.md

## The three rules

**1. Notes come from reading, not from memory.**
When ingesting a resource, write only what was actually read in that session
from a fetched or user-supplied source. Recognizing a book from training does
not license writing a note about it. If access was partial, the note says
`coverage: partial` and names what's missing.

**2. Generated output cites the corpus.**
Every technique-bearing line in a generated asset traces to a note, or is
marked `[BUSINESS]`, `[CONNECTIVE]`, or `[UNSOURCED]`. Unsourced material is
allowed but must be rare, flagged, and justified.

**3. Gaps stay visible.**
"Source gives none", "coverage: partial", and "corpus has nothing for this
stage" are correct answers. Filling a gap with plausible general sales advice
silently defeats the entire system.

## The three rules also govern claims about this repo

Rule 1 says notes come from reading, not from memory. The same standard applies
to any statement about how this project, its tooling, or its environment
behaves: it comes from checking, not from expectation. Three failures here came
from ignoring that, and every one of them looked verified at the time.

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
untested, or left out. That is rule 3 again: gaps stay visible.

## Access boundary

Public, free, and officially released material — or files the user supplies
themselves. No paywall circumvention, no DRM, no pirated copies. When a
resource turns out to be paid, offer the two honest paths: the user drops their
own copy in `corpus/raw/`, or the agent builds a partial note from the author's
own public talks and interviews, clearly labeled as partial.

## Never fabricate proof

No invented statistics, case studies, client names, or results in any generated
asset. Use `[INSERT: specific result with number]` and tell the user what to
supply.

## Layout

| Path | What it is |
|---|---|
| `corpus/sources.yaml` | The reading list and ingest status |
| `corpus/notes/` | One distilled note per resource — the durable asset |
| `corpus/playbook/` | Cross-resource synthesis, conflicts, prohibitions |
| `corpus/raw/` | User-supplied source files |
| `context/business.md` | The user's business. Read before any generation |
| `output/` | Generated assets |
| `templates/` | Note and context schemas |

## Skills

- `/sales-ingest` — find, read, distill a named resource
- `/sales-write` — generate an asset grounded in the corpus
- `/sales-audit` — grade an asset against the corpus

## Working notes

- Ingest is serial, not parallel — notes must be cross-checked against each
  other, and conflicts between sources are recorded rather than averaged.
- Conflicts between good sources usually mean they sell different things to
  different buyers. `corpus/playbook/conflicts.md` resolves by context, and
  matching the user's business to the right side is most of this system's value.
- Corpus notes are the product. Generated assets are disposable and can be
  regenerated; a well-extracted note cannot be cheaply rebuilt.

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

This serves rule 1: it fetches pages that plain `WebFetch` cannot read, so a
note can be written from something actually read. It does **not** relax the
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
