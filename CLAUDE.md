# Sales corpus agent — project rules

This repo is a **grounded sales knowledge base**. The user curated a specific
set of sales resources because general LLM training blends good sales advice
with bad. Everything here exists to make output traceable to those chosen
sources instead of to training-data averages.

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
