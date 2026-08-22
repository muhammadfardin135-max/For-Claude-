# Cross-source principles

Claims that more than one ingested source independently supports. These carry
the most weight in generation — independent agreement between separately
curated sources is the strongest signal this corpus produces.

Sources: `josh-braun` (JB, partial), `gong-cold-email-data` (G, full),
`lavender-benchmarks` (L, partial), `outbound-squad` (OS, stub),
`hormozi-100m-leads` (H, partial).

---

## 1. Do not pitch on first touch
- **G:** pitching cuts reply rates by **as much as 57%**; "never pitch the
  platform directly."
- **JB:** "the goal of sending cold emails is to start a conversation, not to
  make a sales pitch."
- **OS:** "make strategic 'gives' to buyers early and often to earn their time"
  — value before the ask.
- **Strength:** three sources, one with a hard number. Treat as the corpus's
  strongest rule.

## 2. Cut buzzwords and jargon — including with technical buyers
- **G:** buzzwords and numbers cost up to **17.9%** of open rate; names "TCO",
  "MTTR", "all-in-one", "single pane of glass".
- **L:** names "strategic revenue enablement", "rigor", "world-class",
  "cutting-edge"; and the counterintuitive finding that technical jargon
  **"turns engineers away"** — engineers want clear use cases, not vocabulary.
- **Strength:** two sources, both with data. The engineer finding is the
  non-obvious part — do not "sound technical" to technical buyers.

## 3. Open with an observation about them, not a statement about you
- **JB:** the **Truth** step — "what is true about this person that you can
  observe, and that traces back to how you can potentially help?"
- **L:** good personalization = you observed X, therefore you suspect
  challenge Y; the observation must connect to the whole message.
- **Strength:** two sources describing the same move in different vocabulary.
  This is the structural core of a first line.

## 4. Brevity, bounded by stage
- **L:** 25–50 words first touch; readers spend **11 seconds**; **<6 seconds**
  to convey value.
- **G:** 100 words or fewer; 3–4 sentences best.
- See `conflicts.md` → "Email length" and "First-touch length vs. follow-up
  length". Follow-ups invert the rule.

## 5. Stock sales phrases trigger automatic resistance
- **JB:** the Zone of Resistance — "'Save money' automatically puts prospects
  in the Zone of Resistance because that's what salespeople always say."
  Prohibits "Hope you're doing well", "I know you're super busy", "just
  bumping this", "following up", "checking in", "touching base".
- **L:** clichés are one of the six reasons no one reads your email — names
  "I hope this finds you well", name introductions, "Let's find 15 minutes".
- **Strength:** two sources, overlapping specific phrase lists. The overlap on
  "hope this finds you well" is exact.

## 6. Match the message to the recipient, not to your product
- **L:** "Align the value to the altitude" — C-suite gets strategy/revenue/
  cost/risk, managers get tactics, ICs get their own KPIs. Plus per-department
  tone rules.
- **G:** use "priority-based language" in the buyer's own terminology; build
  subject lines from the buyer's priorities.
- **JB:** tailoring messages by job title and switching risk (named in the
  podcast show notes; mechanics not recovered).
- **Strength:** three sources. Lavender is the only one with the data to say
  *how* it varies, so it leads on execution.

## 7. Subject lines: flat, short, and boring
- **L:** 1–3 words, 2 optimal; title case; neutral, factual; "think like
  internal workplace emails — short, descriptive, and boring". Questions
  **-56% opens**, numbers **-46.33%**, punctuation **-36%**, no title case
  **-30%**, first name **-12% replies**.
- **G:** avoid marketing language, numbers, questions, AI mentions; social
  proof underperforms here.
- **Strength:** two sources agreeing closely, Lavender supplying the numbers.
  Note this is the exact inverse of the body rule — see `conflicts.md`
  → "Questions".

## 8. Persuasion works by letting the prospect reach the conclusion
- **JB:** "The best way to persuade is to let other people persuade
  themselves"; poke the bear with a **neutral**, not leading, question.
- **OS:** "Provoke — engage buyers with a strong point of view on their problem
  that compels action now."
- **Strength:** two sources, but note they differ in flavour: Braun's move is a
  neutral question that lets them conclude; Outbound Squad's is asserting a
  point of view. Braun is the better-documented of the two here and OS is a
  stub — prefer Braun's formulation until OS is properly ingested.

---

## Where the corpus is currently silent

No ingested source covers, with usable detail:
- **Discovery calls** — question sequences beyond Braun's poke-the-bear opener
- **Pitch / presentation structure**
- **Objection handling** — Braun's position is "go upstream and poke the bear
  instead", but his actual objection responses were not recovered; no other
  source addresses objections at all
- **Closing** — no source in the corpus covers the close
- **Pricing conversations / negotiation**
- **Follow-up cadence** — only two data points exist: Lavender's "4+ sentences,
  15x more meetings" and Hormozi's "2–3 attempts before abandoning"

Generating for these stages will produce heavily `[UNSOURCED]` output. Ingest
something that covers them first.
