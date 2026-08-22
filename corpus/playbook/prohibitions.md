# Hard constraints on generated output

Aggregated from section 5 of every corpus note, plus `context/business.md` §7.
These are absolute — `/sales-write` and `/sales-audit` treat a violation as
blocking, not as a style note.

## Universal

| Prohibition | Source | Stated reason |
|---|---|---|
| Never fabricate statistics, case studies, client names, or results | project rule | Legal and reputational risk; destroys trust on contact with a real prospect |
| Never pitch on first touch | `gong-cold-email-data`, `josh-braun` | Cuts reply rates by as much as 57% (G); the goal is a conversation, not a pitch (JB) |

## Subject lines

| Prohibition | Source | Stated reason |
|---|---|---|
| No questions | `lavender-benchmarks`, `gong-cold-email-data` | −56% open rate (L) |
| No numbers | `lavender-benchmarks`, `gong-cold-email-data` | −46.33% open rate (L) |
| No punctuation (? !) | `lavender-benchmarks` | −36% open rate |
| No recipient first name | `lavender-benchmarks` | −12% replies |
| Always title case | `lavender-benchmarks` | Dropping it costs −30% opens |
| No emojis, commands, superlatives, clichés | `lavender-benchmarks` | Trips the mental spam filter |
| No marketing language, no AI mentions | `gong-cold-email-data` | Pattern-matches to bulk send |
| No social proof in the subject line | `gong-cold-email-data` | Underperforms in this position (body is fine) |
| Keep to 1–3 words | `lavender-benchmarks` | Two→four words costs −17.5% replies |

## Body copy

| Prohibition | Source | Stated reason |
|---|---|---|
| No industry buzzwords — "TCO", "MTTR", "all-in-one", "single pane of glass" | `gong-cold-email-data` | "you're not fooling anyone"; up to −17.9% opens |
| No "strategic revenue enablement", "rigor", "world-class", "cutting-edge" | `lavender-benchmarks` | Obscures value in the <6 seconds you get |
| No technical jargon even with engineers | `lavender-benchmarks` | Jargon "turns engineers away" — they want clear use cases |
| No ROI promises like "10x return" | `gong-cold-email-data` | Reads as marketing |
| Do not talk about AI | `gong-cold-email-data` | Competitors have saturated the topic |
| No "save money" or stock benefit language | `josh-braun` | Puts the prospect straight into the Zone of Resistance |
| No educating / informative tone | `lavender-benchmarks` | "Perfectly inverse correlation with your reply rate" |
| No large paragraphs — format for mobile | `lavender-benchmarks` | Opened on phones 8x more than computers; mobile formatting = +83% replies |
| No leading questions when poking the bear | `josh-braun` | A leading question reads as a pitch and triggers resistance |
| No vague CTAs like "learn more" | `lavender-benchmarks` | Names no action; fails with technical buyers |

## Opening and closing clichés

| Prohibition | Source |
|---|---|
| "Hope you're doing well" / "I hope this finds you well" | `josh-braun`, `lavender-benchmarks` (exact overlap) |
| "I know you're super busy, so I'll keep this brief" | `josh-braun` |
| "Just bumping this to the top of your inbox" | `josh-braun` |
| "following up" / "checking in" / "touching base" | `josh-braun` |
| "Let's find 15 minutes" | `lavender-benchmarks` |
| Name introductions as the opener | `lavender-benchmarks` |

## Audience-specific

| Prohibition | Source | Applies to |
|---|---|---|
| No hype, no excessive name-dropping | `lavender-benchmarks` | Finance |
| No over-excitement | `lavender-benchmarks` | Researchers |
| No transactional tone | `lavender-benchmarks` | HR (wants warm/friendly) |
| No warmth or casual register | `lavender-benchmarks` | Technical executives (want direct and credible) |

## Numbers that must NOT be cited as benchmarks

Recorded here so they don't leak into output as if verified:

| Number | Why not |
|---|---|
| Josh Braun's "35% cold email response rate" | Article body was CAPTCHA-blocked; the conditions behind it are unknown |
| Outbound Squad's "23.9% average open rate for a cold call" | Wording is incoherent (open rate is an email metric) and context was inaccessible |
| Lavender's "6% reply rate is worse than 4%" | Genuinely interesting but the explanation was never read |
