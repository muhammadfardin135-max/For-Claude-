# For-Claude-

The owner's Claude Code setup. Two things live here:

## 1. Explain-simply

The communication rules that stop Claude from answering in jargon. The owner is
not a developer and doesn't want to learn how software works internally — these
files make explanations come out understandable the first time.

- `explain-simply/CLAUDE-snippet.md` — the rules themselves. The root
  `CLAUDE.md` imports it, so any session in this repo picks it up automatically.
- `explain-simply/project-instructions.md` — the same idea for a Project on
  claude.ai, for pasting in screenshots and errors from elsewhere.
- `explain-simply/README.md` — which one to use where, and how to install them.

Four phrases steer it once installed: **"go deeper"**, **"why?"**,
**"shorter"**, **"normal mode"**.

## 2. A working browser

A real headless Chromium the agent can drive, so it can read pages that plain
web-fetching can't. It starts automatically at the beginning of a session.

- `.claude/hooks/session-start.sh` — installs `browser-use`, launches Chromium
  with remote debugging, exports `BU_CDP_URL`. Idempotent and safe to re-run.
- `scripts/launch-chrome-cdp.sh` — the launcher.
- `docs/browser-use-setup.md` — what was tried, what broke, and why the TLS
  setting is the way it is.

Limits worth knowing: the browser is signed out and forgets everything when the
session ends. CAPTCHAs, SMS and email verification codes, and sites that block
data-centre IPs don't work here.

## Ground rules the agent follows

Set in `CLAUDE.md`, applied every session:

- Claims about this repo come from checking, not from expectation — a
  prediction is never written as a fact
- Nothing is "done" until it's done for the user, not just in the agent's
  container; a step the user has to take is stated up front, never offered
- No fabricated statistics, case studies, names, or results — `[INSERT: ...]`
  markers instead
- Public, free, or officially released material only — or files you supply
