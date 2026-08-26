# Explain-simply setup

Two files here. They're the same idea in two places, doing two different jobs.

## The short answer: do both, they don't overlap

| | `CLAUDE-snippet.md` | `project-instructions.md` |
|---|---|---|
| Goes in | Claude Code's `CLAUDE.md` | A Project on claude.ai |
| Job | Changes how Claude talks to you **while it's building** | Explains things you **paste in from somewhere else** |
| Use it when | You're working, and Claude explains what it did | You have a screenshot, an error, a wall of text |

The CLAUDE.md one is the more important of the two, because it fixes the problem
at the source. Right now the sequence is: Claude explains something in jargon →
you get confused → you go somewhere else to get it translated. With the snippet
installed, it just comes out understandable the first time and there's nothing
to translate.

The Project is the backup for everything that didn't come from your own Claude
Code session — a screenshot on your phone, something a colleague sent, an old
explanation you saved and still don't understand.

## Where to paste each one

**CLAUDE-snippet.md — pick based on how you use Claude Code:**

- **Desktop or terminal app** → paste it into `~/.claude/CLAUDE.md`. That's your
  personal file, and it applies to **every project, forever**. This is the one
  you want. Create the file if it isn't there.
- **Claude Code on the web** → the container is wiped after every session, so a
  personal file won't survive. It has to live in the repo instead: paste it into
  the `CLAUDE.md` at the top of whichever repo you're working in.

This repo already has it wired in — the root `CLAUDE.md` imports it, so any
session here picks it up automatically.

**project-instructions.md:** claude.ai → Projects → new project → name it
something like "Explain it simply" → paste everything below the `---` line into
the custom instructions box. Then just paste your screenshots into it.

## Your hypothesis — is it right?

You said: *to use Claude Code effectively I don't actually need to understand
this stuff.* You're right, with one exception, and the exception is the reason
the "Never skip" section exists in both files.

**Right about:** how MCP works, what a server is, why the code is shaped that
way, what the command does, how a bug got fixed. None of it changes what you do.
You were spending real time learning things that were never going to pay off.
Stop.

**The exception:** you still need enough to make **decisions** — when something
costs money, when something can't be undone, when your accounts or private data
are involved, and when Claude asks you to choose between options. That's not
technical understanding, it's understanding consequences. Both files force Claude
to always give you that part in plain language, no matter how simple the rest
gets.

So the rule isn't "explain less." It's **explain the consequences, skip the
mechanism.**

## Steering it

Four phrases, once it's installed:

- **"go deeper"** — you actually want the technical version
- **"why?"** — one level deeper, still plain
- **"shorter"** — cut to two lines
- **"normal mode"** — turn the style off for this session

That last one matters. If it ever feels *too* dumbed-down, you're one phrase away
from turning it off — so there's no risk in trying it.
