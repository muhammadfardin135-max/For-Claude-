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

---

## E. Platform policy constraint — WhatsApp (read before writing any WhatsApp DM)

Read 2026-08-22 from the primary source: **https://whatsappbusiness.com/policy/**
(and Meta's opt-in documentation). This is not a corpus source — it is a
platform rule that overrides message quality entirely. A perfect message on a
banned number delivers nothing.

**The rule, quoted:**
> "You may only contact people on WhatsApp if: (a) they have given you their
> mobile phone number; and (b) you have received opt-in permission from the
> recipient confirming that they wish to receive subsequent messages or calls
> from you."

**Therefore: fully cold WhatsApp outreach — messaging people who have not given
you their number and opted in — is a direct policy violation**, regardless of
how good the copy is.

Also documented:
- Inbound-initiated conversations open a **24-hour customer care window**;
  outside it, business-initiated messages need prior opt-in and approved
  templates.
- Reported enforcement escalates: warnings → messaging limits → temporary
  restriction → permanent ban. Quoted: *"we may prohibit you and your
  organization from all future use of WhatsApp products and services."*
- Numbers accumulating negative feedback (blocks, reports) get quality-tiered
  down and restricted.
- Widely reported thresholds: no promotional messages to users who haven't
  interacted in 30 days; no more than 3 business-initiated conversations to the
  same user per 24h.

**Consequence for a team sending cold at volume:** this is the exact profile
enforcement targets. Recipient blocks are the trigger, and a team sending the
same cold template at volume generates blocks fast.

### The three compliant paths

1. **Convert cold → inbound.** Drive people to message you first (ad with a
   "Click to WhatsApp" button, link in bio, QR code, website widget). Their
   inbound message opens the 24-hour window legitimately, and the DM template
   becomes a *reply* template. **This is the highest-leverage fix and changes
   the asset only slightly** — the corpus's nine portable rules apply the same.
2. **Collect opt-in elsewhere first**, then message. Slower, fully compliant.
3. **Use a channel where cold contact is permitted.** Facebook/Instagram DM and
   LinkedIn have their own limits but do not require prior opt-in the way
   WhatsApp Business does. Cold is a normal use of those channels.

### Effect on generated assets

Any WhatsApp asset this corpus produces should be written as **either** an
opt-in/inbound reply flow, **or** carry an explicit warning that sending it cold
risks the number. Do not generate a cold WhatsApp sequence and present it as
routine.
