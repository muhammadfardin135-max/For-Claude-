---
name: sales-write
description: Write a sales asset — call script, cold email, DM sequence, discovery framework, objection sheet, pitch deck narrative, follow-up cadence — grounded strictly in the ingested corpus. Use when the user asks for a sales script, sales copy, outreach, pitch, or any selling asset for their business. Do not use for ingesting new resources.
---

# Write a sales asset from the corpus

The user built this corpus specifically so that output does NOT come from your
general training. Honor that. Your default sales instincts are the thing being
filtered out here.

## Step 1 — Load the ground truth

Read, in this order:
1. `context/business.md` — the user's business
2. `corpus/INDEX.md` — what's available
3. The specific notes in `corpus/notes/` relevant to the asset and stage
4. `corpus/playbook/conflicts.md` — where sources disagree
5. `corpus/playbook/prohibitions.md` — the hard constraints

If `context/business.md` is unfilled, stop and ask for it. Writing a script
without knowing the price point, buyer, and channel produces generic output —
exactly what the user is trying to escape.

If the corpus is empty or has nothing covering the requested stage, say so
before writing. Offer to ingest something that covers it.

## Step 2 — Select the sources that actually fit

Do not use every note. Match on:
- **Channel** — a cold-call framework does not port to LinkedIn DMs unchanged
- **Price point** — a $50 close and a $50k close are different motions
- **Buyer** — SMB owner vs. enterprise committee
- **Sales cycle length** — one-call close vs. six-touch cycle

State your selection to the user before writing, in one or two lines: "Using
<A> for the opener and discovery because it's built for cold B2B phone at this
price point; using <B> for objections; not using <C> because it assumes
in-person retail."

When notes conflict, apply the resolution rule in `conflicts.md` and say which
side you took and why.

## Step 3 — Write

Build the asset from the corpus's own frameworks and language. Adapt the
verbatim patterns to the user's product — keep the structure and the
psychological move, change the nouns.

**Citation discipline (this is the mechanism):**

Every technique-bearing move in the draft carries an inline marker to its
source note: `[straight-line §3]`, `[challenger-sale §2.1]`.

Anything you cannot cite is one of three things, and you must mark it:
- `[BUSINESS]` — comes from `context/business.md` (their product, price, proof)
- `[CONNECTIVE]` — ordinary connecting language carrying no technique
- `[UNSOURCED]` — you added a sales move the corpus does not teach

`[UNSOURCED]` is allowed but must be rare, flagged in your summary, and
justified. If you find yourself writing several, that is a signal the corpus
has a gap — say so and name what to ingest to fill it.

**Hard constraints:** every prohibition in the notes' section 5, plus every
constraint in `context/business.md` §7, applies absolutely. A prohibition from
a source you're drawing on is not a suggestion.

**Never fabricate proof.** No invented case studies, client names, statistics,
or results. If the script needs social proof, insert `[INSERT: specific result
with number]` and tell the user what to supply. A script with a fake stat in it
is worse than no script.

## Step 4 — Deliver in two layers

Write to `output/<asset>-<date>.md` with two parts:

**Part A — the asset, clean.** Ready to use. No citation markers, no
commentary. This is what they read off the screen on a call.

**Part B — the annotated version.** Same asset with every citation marker, and
after each block, one line on what the move is doing and why the source says it
works. This is the training layer — it is how the user learns the material
rather than just renting it.

Then, in chat: what you used, what you deliberately left out, any `[UNSOURCED]`
lines, and every `[INSERT: ...]` the user has to fill.

## Step 5 — Offer the test

Real scripts fail at contact with real prospects. Offer to:
- run `/sales-audit` on the draft
- role-play the prospect against it, using the objection tables from the notes
- write the branch for the two most likely places it breaks down

## What not to do

- Do not smooth corpus language into generic marketing voice. The specificity
  is the value.
- Do not pad. A 200-word script that follows one source's structure exactly
  beats 900 words of blended advice.
- Do not hedge every claim into meaninglessness. These sources are direct; the
  output should be too.
- Do not import a technique because you know it works. If it's not in the
  corpus, it doesn't go in unmarked.
