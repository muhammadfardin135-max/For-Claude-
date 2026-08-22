---
name: sales-audit
description: Grade an existing sales script, email, or pitch against the ingested corpus — find ungrounded claims, violated prohibitions, and missing moves the corpus teaches. Use when the user asks to review, critique, check, or improve a sales asset they already have, or to verify a generated one.
---

# Audit a sales asset against the corpus

Grade what's in front of you against what the corpus actually teaches — not
against your own sales instincts.

## Input
Either a file the user names, a pasted draft, or the most recent file in
`output/`. If it's their own pre-existing script, that's the most valuable case
— be direct about what's wrong.

## Load
`context/business.md`, `corpus/INDEX.md`, the relevant notes, and
`corpus/playbook/prohibitions.md`.

## Produce five findings sections, in this order

### 1. Prohibition violations — blocking
Anything the corpus explicitly says never to do, or that violates
`context/business.md` §7. Quote the offending line, name the source and its
stated reason, give the replacement.

### 2. Unfounded claims — blocking
Statistics, results, guarantees, or case studies with no backing in
`context/business.md`. These are legal and reputational risk, not style notes.
Flag every one.

### 3. Missing moves — high value
Things the corpus teaches for this stage that the draft simply doesn't do.
This is usually where the biggest gains are. For each: name the move, the
source, and where in the draft it belongs.

### 4. Weak execution
Places where the draft attempts a corpus technique but does it in a way the
source warns against — the framework's own documented failure mode. Cite the
note's failure-mode line.

### 5. Off-corpus material
Passages built on sales advice the corpus doesn't teach. Not automatically
wrong — flag it, say what it appears to be, and let the user decide whether to
ingest a source that covers it or cut it.

## Scoring

Give a per-stage score (opener / discovery / pitch / objection / close /
follow-up) as `grounded / partial / ungrounded`, plus the single highest-impact
fix. Do not give a numeric overall score — it invites optimizing the number
instead of the script.

## Tone
Be blunt. A soft audit that lets a broken script go live costs the user real
money. If the draft is fundamentally built on the wrong framework for their
channel and price point, lead with that rather than fixing commas.
