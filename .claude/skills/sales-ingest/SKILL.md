---
name: sales-ingest
description: Find, read, and distill named sales resources into the corpus. Use when the user names sales books, courses, videos, or trainings they want the agent to learn from — e.g. "ingest <name>", "read <name> and add it", "here are the resources", or gives a list of sales material to study. Also use to re-read or deepen an existing corpus note.
---

# Ingest a sales resource into the corpus

You are building a curated knowledge base. The user's whole point is that a
general LLM blends good and bad sales advice. Your job is to make the good
material **retrievable and citable** so later generation can be grounded in it
rather than in training-data averages.

## Non-negotiable rule

**Never write a note from memory.** If you already "know" the book, that
knowledge is exactly what the user is trying to route around. A note may only
contain what you actually read in this session from a real source you fetched
or the user supplied. If you could not access the material, the note stays
`coverage: partial` and you say so out loud.

## Procedure

### Step 1 — Register the request
For each resource the user names, append a row to `corpus/sources.yaml` with
status `requested`. Do this first so nothing gets silently dropped from a long
list.

### Step 2 — Locate it
Use `WebSearch` to find where the material legitimately lives. Look for, in
this order of preference:

1. The author's or publisher's own free release (official site, their YouTube
   channel, a free PDF they published, a free course landing page).
2. A full transcript or full-text posting on a public site.
3. Substantial secondary coverage: long-form summaries, detailed reviews,
   lecture notes, published excerpts, interviews where the author explains the
   method themselves.

Record every URL you use in the note's frontmatter.

### Step 3 — Access boundary (read this, it matters)

**Do:** read anything publicly reachable — free courses, YouTube transcripts,
author blogs, official free PDFs, podcast transcripts, published excerpts,
open summaries and reviews.

**Do:** read files the user supplies themselves. If they own a copy, they can
drop it in `corpus/raw/` and you read it from disk. That is the cleanest path
for paid material and you should suggest it whenever a resource turns out to be
paywalled.

**Do not:** circumvent a paywall, DRM, or login. Do not hunt for pirated copies
of a paid book or course. If the material is paid and the user hasn't supplied
it, say so plainly and offer the two honest alternatives: (a) they supply the
file, or (b) you build a `coverage: partial` note from legitimate public
material — the author's own talks, interviews, and free content — and label it
as such.

A partial note built from the author explaining their own method in public is
genuinely useful. Do not pretend it is the full text.

### Step 4 — Read for extraction, not for summary

Fetch with `WebFetch`. For a long resource, fetch across several passes rather
than one — a course index page, then the individual lessons; a video series,
then each transcript.

As you read, you are hunting for four things, in priority order:

1. **Verbatim language** — the actual words the source puts in your mouth.
   Openers, transitions, framing questions, closes. Quote them exactly. This is
   the single highest-value thing in the corpus and the thing a general model
   reproduces worst.
2. **Procedures with trigger conditions** — not "build rapport" but "when the
   prospect does X, say Y, because Z."
3. **Prohibitions** — what the source says never to do. These become hard
   constraints on generated output later, and they are what actually separates
   a good source from generic advice.
4. **Context limits** — what this source assumes about price point, channel,
   era, buyer sophistication.

Skim past: the author's biography, motivational filler, upsells for their
higher tier, testimonials.

### Step 5 — Write the note

Copy `templates/resource-note.md` to `corpus/notes/<id>.md` and fill every
section. Rules:

- Section 3 (verbatim language) and section 5 (prohibitions) are mandatory. A
  note without them is not done.
- Where the source gives no data for a section, write "Source gives none" —
  never fill a gap with your own sales knowledge. A visible gap is information;
  a plausible invention is contamination.
- Quote rather than paraphrase whenever the exact wording carries the
  technique.
- Keep quotes to what is needed to convey the technique — short excerpts, not
  reproduced chapters.

### Step 6 — Reconcile against the existing corpus

Read `corpus/playbook/principles.md`. If this new source **contradicts** an
existing one, do not average them and do not silently overwrite. Add the
disagreement to `corpus/playbook/conflicts.md`:

```
## <topic>
- **<source A>** says: <position>. Context: <price point / channel / era>.
- **<source B>** says: <position>. Context: <...>.
- **Resolution rule:** <which applies when — usually context decides>
```

Conflicts are valuable. Two good sources disagreeing usually means they sell
different things to different buyers, and knowing which one matches the user's
business is most of the value this system provides.

### Step 7 — Update the index

Update `corpus/INDEX.md` with the resource, its coverage level, which sales
stages it covers, and a one-line "reach for this when…". Set its status in
`corpus/sources.yaml` to `ingested` or `partial`.

### Step 8 — Report honestly

Tell the user, per resource:
- what you actually got access to, and via what route
- coverage: full or partial, and what's missing
- the 2-3 most distinctive things this source teaches that generic advice does not
- anything it contradicts in the existing corpus

If you could not access something, say so in the same breath. A quiet gap in
the corpus becomes a confident hallucination three prompts later.

## Batching

If the user hands you a long list, work through them one at a time and report
after each. Do not spawn parallel agents unless the user asks — corpus notes
need cross-checking against each other, which is serial work.
