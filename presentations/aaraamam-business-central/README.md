# Aaraamam — Business Central proposal deck

HTML scroll-snap deck, built on the same template as the Al Nimr Steel Yard WMS deck
(same chrome, palette, slide types and headline voice). Present it in a browser:
arrow keys / space to move, or the pager bottom-right. Click the process-flow diagram
on slide 9 to enlarge it.

Published: https://claude.ai/code/artifact/aaf8f2d3-6508-4b4e-aef6-4ec9cf024823

## Files

- `deck.html` — the deck. Single self-contained file, all images embedded. Open it anywhere.
- `body-template.html` — the deck markup with `{{TOKEN}}` placeholders for the images.
- `head.html` — the stylesheet, lifted verbatim from the Al Nimr deck.
- `build.py` — inlines `assets/` into the tokens and writes `deck.html`. Run `python3 build.py`.
- `assets/` — Gerab logo, Aaraamam logo and storefront, the process flow (inline + full res),
  and the 14 client reference logos.

Edit copy in `body-template.html`, then re-run `build.py`. Editing `deck.html` directly works
too, but the next build overwrites it.

## Scope

Phase 1 is what the deck proposes: get the numbers right. Receiving at the accepted
quantity, batch and expiry, transfers with a receipt leg (including outlet-to-outlet
loans), waste with reason codes, a daily ordering cut-off, and consumption
reverse-calculated from the POS file. Phases 2 and 3 appear only as a two-cell band on
the rollout slide — deliberately light on detail.

Parked, not in the deck: the free-rice / zero-price POS capture (pending POS vendor
confirmation) and any framing around whether Aaraamam preps to a sheet today.

## Slide order

| # | Slide | # | Slide |
|---|---|---|---|
| 1 | Cover — "The POS knows what you sold. Not what it cost you." | 10 | Outlet to outlet is a loan, not a transfer |
| 2 | Who we are — Gerab Group since 1977 | 11 | Consulting: the process flow as mapped |
| 3 | References | 12 | The same eight points, handled |
| 4 | "Do those two numbers agree?" | 13 | BC sits behind the counter, not in front |
| 5 | Eight things behind the till | 14 | Choosing a partner |
| 6 | The receiving gate — the delivery note vs the scale | 15 | Rollout + Phase 2 / 3 band |
| 7 | Expiry | 16 | Six numbers, before and after |
| 8 | Naming the gap — waste with reason codes | 17 | Next step + contact |
| 9 | Reverse calculation from POS | | |

## Before presenting — check these

- **Every figure in the diagrams is illustrative** and each caption says so: slide 6
  (40.0 / 38.6 / 1.2 / 37.4 / 2.6 kg), slide 8 (the 5.6 kg split), slide 9 (120 portions,
  38.4 vs 44.0 kg at AED 14/kg), slide 10 (2 kg, 12 Aug). Swap in one real item and one real
  week if you can — the argument lands much harder on their own numbers.
- **Slide 17 contact is Hans Hameed**, carried over from the Al Nimr deck. Change it if you are
  presenting.
- **Slide 7 dates** (12 Aug / 19 Aug / expires 26 Aug) are an illustration, not their data.
- **The discipline is not the software.** Weighing at the door, coding every throw-away,
  receipting every transfer — these are staff behaviours. Worth saying in the room: the system
  makes them possible, visible and auditable; it does not create them.
- **Slide 2 stats** (1977, 850+, AED 1Bn+, 550+, 95%+) are taken verbatim from the Al Nimr deck.
