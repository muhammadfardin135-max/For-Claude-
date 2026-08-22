# Porting the corpus from cold email to DM

Every source in this corpus studied **cold email**. The requested deliverable is
a **DM template** (LinkedIn / Instagram / X / etc.). This file records which
findings are channel-independent, which are email-mechanics that do not port,
and which are simply unknown for DM.

This distinction exists so that generated DMs don't silently inherit rules that
were only ever measured on email.

---

## A. Ports cleanly — the mechanism is psychological, not channel-specific

| Rule | Source | Why it ports |
|---|---|---|
| Do not pitch on first touch | `gong`, `josh-braun` | The 57% collapse is about the reader's reaction to being sold to, not about the medium. If anything the reflex is stronger in a DM, which feels more personal. |
| Cut buzzwords and jargon | `gong`, `lavender` | Same reader, same <6-second judgement. |
| Open with an observation about them | `josh-braun` (Truth), `lavender` | This is the core of the first line in any channel. On social platforms the observable surface is richer (their posts, comments, bio) than in email. |
| Question-led body / poke the bear | `josh-braun` | Neutral question → self-persuasion. Channel-independent. |
| No stock sales clichés | `josh-braun`, `lavender` | "Hope you're doing well" is if anything more conspicuous in a DM. |
| Align value to the altitude | `lavender` | Seniority determines what someone cares about regardless of where you say it. |
| No educating / informative tone | `lavender` | "Perfectly inverse correlation with reply rate" is about register, not medium. |
| Specific ask, soft timing | `josh-braun` + `lavender` (see `conflicts.md`) | Same resistance mechanics. |
| Proof as BAR narrative, not name-dropping | `lavender` | Channel-independent. |

**These nine are the backbone of any DM this corpus produces.**

---

## B. Does NOT port — email mechanics with no DM equivalent

| Rule | Source | Why it doesn't port |
|---|---|---|
| All subject-line rules (1–3 words, title case, no questions/numbers/punctuation, −56%/−46%/−36%/−30%/−12%) | `lavender`, `gong` | **DMs have no subject line.** Every one of these penalties was measured on an email subject field that does not exist here. Do not apply them. |
| "344 cold emails per meeting" | `gong` | An email-volume benchmark. Meaningless as a DM benchmark. |
| Reply-rate benchmarks (5.2% technical, 3.4% HR, 5.4% ops, etc.) | `lavender` | Measured on email in ~50,000 inboxes. **Do not quote these as DM expectations.** |
| Deliverability / spam-filter framing | `lavender` | DMs aren't filtered the same way. |

**Partial port:** the *logic* behind the subject-line rules — be neutral, boring
and non-salesy in the first thing they see — does transfer to the **DM preview
line**, since most platforms show the first ~40 characters as the notification.
The specific word counts and penalties do not.

---

## C. Unknown for DM — flag as `[UNSOURCED]` if used

| Question | Status |
|---|---|
| Optimal DM length | **No source.** Lavender's 25–50 words is email. DM norms are widely believed shorter, but this corpus has no data. Any specific DM word count is an extrapolation and must be marked. |
| DM follow-up cadence | **No source.** Lavender's "4+ sentences, 15x" is email follow-up; Hormozi's "2–3 attempts" is generic outreach and low-confidence. |
| Whether "boring and neutral" applies to DM register | **No source.** Social DMs run warmer than email. Lavender's "boring" finding was measured on subject lines specifically. Genuine open question. |
| Connection-request vs. direct-message differences | **No source.** |
| Voice notes, media, emoji in DM | **No source.** Lavender bans emoji in *subject lines* only. |

---

## D. Practical consequence

A DM built from this corpus is **grounded on structure and prohibitions**
(section A) and **unsourced on channel mechanics** (section C). That is an
honest and usable position — the psychology is well-evidenced, the formatting
is not.

**To close section C**, ingest a DM-native source. The corpus needs one; none
of the five resources so far covers it.
