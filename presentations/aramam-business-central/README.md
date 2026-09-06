# Aramam — Microsoft Dynamics 365 Business Central proposal deck

23-slide pitch deck for the Aramam restaurant group, built on the same structure as the
Gerab SharePoint/DMS deck (who we are → the problem → the solution → capabilities →
credentials → next steps).

- `Aramam_BusinessCentral_Proposal.pptx` — the deck. Open in PowerPoint, drop in the images, present.
- `Aramam_BusinessCentral_Proposal.pdf` — flattened backup, in case the venue laptop misbehaves.
- `build.js` — the generator (pptxgenjs). Re-run to rebuild after editing copy:
  `npm i pptxgenjs react react-dom react-icons sharp && node build.js out.pptx`

## Placeholders to fill before presenting

| Slide | Placeholder | What to drop in |
|---|---|---|
| 1 | Full-bleed background rectangle | Right-click → Format Shape → Picture fill. A warm restaurant interior or a plated dish works best. A dark scrim sits above it, so the headline stays readable. Delete the small note bottom-right afterwards. |
| 1 | Gerab logo (top left), Aramam logo (top right) | Company logos |
| 3 | Photo placeholder | Gerab office / delivery team, landscape |
| 3 | Pill cards | Replace with real credentials if you have them — years in the UAE, team size, number of BC implementations |
| 5 | 8 client logo boxes | DWTC, Petrofac, ASG, Total Security Solutions, VIVA, AAB, ASCO, + one |
| 10 | Microsoft / D365 logo | Top right |
| 12 | Screenshot placeholder | Business Central item availability by location, or the purchase order list |
| 14 | Screenshot placeholder | Power BI management dashboard or a BC role centre |
| 17 | Photo placeholder | Cloud kitchen / central production |
| 21 | `[Insert summary figure or leave for the commercial meeting.]` | Licence mix and fee, or delete the sentence |
| 23 | Full-bleed background rectangle + Gerab logo | Same treatment as slide 1 |
| 23 | `[Your name] · [email] · [mobile]` | Your contact details |

## Verify before you present

- **Slide 16 (compliance).** Do not quote a specific UAE e-invoicing mandate date from the
  slide — it deliberately says "phased, depends on the entity". Confirm Aramam's revenue
  band against the current MoF schedule if they push.
- **Slide 21 (licensing).** Confirm current Microsoft UAE list pricing before quoting
  per-user figures. The slide only describes the licence structure.
- **Slide 19 (roadmap).** Durations are marked indicative on the slide. Keep them that way
  until discovery.
- **Slide 6 (as-is flow).** This is your reading of their current setup. If they correct a
  step in the room, that is a good sign — take the note.

Speaker notes are attached to slides 1, 3, 6, 8, 13, 15, 16, 21 and 23.
