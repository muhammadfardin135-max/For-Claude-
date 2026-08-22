# Sales corpus agent

An agent that learns sales from **resources you choose**, then writes your
scripts from those and only those.

## The problem this solves

Ask any LLM for a sales script and you get the average of everything it read —
brilliant material and garbage blended into one confident, generic voice. You
cannot tell which part came from a proven method and which came from a
content-farm blog post.

This repo separates the two steps that normally get collapsed:

```
  YOU NAME THE SOURCES
          ↓
  [ INGEST ]  agent finds them, reads them, extracts operating instructions
          ↓
  corpus/notes/  ←── the durable asset: frameworks, verbatim language,
          ↓                              prohibitions, context limits
  [ WRITE  ]  agent builds your asset — every technique line cited to a note
          ↓
  output/     ←── clean version + annotated version showing every move
```

Grounding is enforced, not requested. Anything in a draft that doesn't trace to
a note gets marked `[UNSOURCED]` and reported to you. If the corpus has nothing
for a stage, the agent says so instead of quietly filling the gap with training
data — which is the exact failure mode you're trying to escape.

## Use it in three steps

**1. Tell it what to read.**
```
/sales-ingest Straight Line Persuasion, Alex Hormozi's free sales trainings, $100M Offers
```
It searches for each, reads what's publicly available, and writes a structured
note per resource. It reports honestly on what it could and couldn't access.

Paid material? Drop your own copy in `corpus/raw/` and it reads that. It will
not route around a paywall, and it will tell you when that's the blocker.

**2. Tell it about your business.**
```bash
cp templates/business-context.md context/business.md
```
Fill it in. Price point, buyer, channel, what's currently failing. The writer
reads this first and will ask rather than invent.

**3. Ask for the asset.**
```
/sales-write a cold call script for my agency
/sales-write a 5-email follow-up sequence
/sales-write an objection sheet for "it's too expensive"
```

You get two versions: the clean script to read off the screen, and an annotated
one showing which source each move came from and why it works. The second one
is how you learn the material instead of just renting it.

**Also:** `/sales-audit` grades a script you already have against the corpus —
prohibition violations, unfounded claims, and the moves the corpus teaches that
your draft is missing.

## Why the notes are structured the way they are

`templates/resource-note.md` is the design decision that makes this work. It
doesn't ask for a summary. It extracts:

- **Verbatim language** — the exact words the source scripts. This is what a
  general model reproduces worst and what carries the most value.
- **Procedures with triggers** — "when the prospect says X, do Y, because Z" —
  not "build rapport."
- **Prohibitions** — what the source forbids. These become hard constraints the
  writer and auditor enforce absolutely.
- **Context limits** — price point, channel, era. A 2005 phone-sales technique
  is not wrong, but it ports differently, and the agent needs to know that
  before applying it to your LinkedIn DMs.

## When sources disagree

They will. Recorded in `corpus/playbook/conflicts.md`, never averaged. Two good
sources contradicting each other usually means they sell different things to
different buyers — and figuring out which side matches *your* business is most
of the value here.

## Layout

| Path | What it is |
|---|---|
| `corpus/sources.yaml` | Reading list + ingest status |
| `corpus/notes/` | One note per resource — the durable asset |
| `corpus/playbook/` | Cross-source principles, conflicts, prohibitions |
| `corpus/raw/` | Source files you supply |
| `context/business.md` | Your business — read before any generation |
| `output/` | Generated assets |
| `.claude/skills/` | `/sales-ingest`, `/sales-write`, `/sales-audit` |
| `.claude/agents/` | Hunter (locates) and reader (extracts) subagents |

## Ground rules the agent follows

Set in `CLAUDE.md`, applied every session:

- Notes come from reading, not from memory — recognizing a book doesn't license
  writing about it
- No fabricated statistics, case studies, or client names, ever — you get
  `[INSERT: ...]` markers instead
- Gaps stay visible: "coverage: partial" and "the corpus doesn't cover this"
  are correct answers
- Public, free, or officially released material only — or files you supply
