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

## Slide order

| # | Slide | # | Slide |
|---|---|---|---|
| 1 | Cover — "The POS knows what you sold. Not what it cost you." | 9 | Consulting: the process flow as mapped |
| 2 | Who we are — Gerab Group since 1977 | 10 | The same eight points, handled |
| 3 | References | 11 | BC sits behind the counter, not in front |
| 4 | "Do those two numbers agree?" | 12 | Choosing a partner |
| 5 | The broken trail — the missing document | 13 | Rollout, keyed to the central kitchen |
| 6 | Eight things behind the till | 14 | Six numbers, before and after |
| 7 | Expiry | 15 | Next step + contact |
| 8 | Reverse calculation from POS | | |

## Before presenting — check these

- **Slide 8 numbers are illustrative.** 120 portions, 38.4 kg theoretical vs 44.0 kg issued,
  AED 14/kg. The slide says so in the caption. Swap in a real item and a real week if you have
  one — the argument lands much harder with their own figures.
- **Slide 15 contact is Hans Hameed**, carried over from the Al Nimr deck. Change it if you are
  presenting.
- **Slide 11 claims** Business Central "has been integrated with the common UAE restaurant POS
  products". Confirm that is true for their specific POS before saying it out loud.
- **Slide 7 dates** (12 Aug / 19 Aug / expires 26 Aug) are an illustration, not their data.
- **Slide 2 stats** (1977, 850+, AED 1Bn+, 550+, 95%+) are taken verbatim from the Al Nimr deck.
