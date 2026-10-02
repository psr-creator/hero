# UAE Customer Industry Classification

Industry classification for the customer list in `Column1.PARTYMST_DESC`
(3,358 rows / **1,292 unique companies**, mostly UAE with some GCC, India,
Europe and Africa entities).

## What's here

| File | Purpose |
|---|---|
| `data/UAE_Customer_Industry_Classification.xlsx` | Main deliverable — 4 sheets |
| `data/company_industry_lookup.csv` | One row per unique company (VLOOKUP source) |
| `data/company_industry_full_list.csv` | All 3,358 rows in original order, industry appended |
| `data/source_party_list.txt` | The source list as supplied |
| `scripts/` | The classifier, verified-company overrides, and workbook builder |

### Workbook sheets

1. **Industry Summary** — 127 industries, unique-company count, row count, % of base
2. **Company Lookup** — company → industry → sub-activity → confidence → source
3. **Full List (original order)** — paste-back-ready against the original column
4. **Needs Review** — the 123 Low-confidence / Unclassified names, for manual cleanup

## Method

Trade-licence names in the UAE are largely self-describing ("... Foodstuff
Trading LLC", "... Electromechanical Contracting LLC"), so classification is
name-based, with two layers on top:

- **Explicit overrides** for ~450 recognisable companies — multinationals
  (AAK, ASSA ABLOY, Denso, KONE, Bulgari, Lufthansa, Worley, Weir, Rittal,
  Phoenix Contact, Nikon, Bose, Sucden, Shapoorji Pallonji, Multiplex, Mace,
  Currie & Brown) and known UAE names (Masafi, Kibsons, Emirates Gold,
  Malabar Gold, Al Rostamani, Azizi, Mohebi Logistics, Jubaili Bros,
  Neuro Spinal Hospital, Ansar Mall, IMG, RAK Properties, Saqr Port).
- **49 individually web-searched companies** whose names carry no industry
  signal. Marked `Web-verified` in the Source column. Examples:

  | Company | Found to be |
  |---|---|
  | Rolman World FZE | Bearings & industrial/auto spare parts (NSK master distributor) |
  | Kleev Middle East FZE | Instrumentation valves, manifolds & gauges manufacturer |
  | BDH Middle East LLC | Laboratory chemicals, glassware & lab fit-out |
  | Link Middle East FZE | Wire, perimeter fencing, gabions & guard rails |
  | Triton Middle East LLC | Sealants & waterproofing manufacturer |
  | Prime Middle East FZE | Industrial, refrigerant & medical gases |
  | Metro International LLC | Drum/can closures & packaging components |
  | Orient Links Co. LLC | Paper & board trading across MEA |
  | RSG Global LLC | Frozen-foodstuff cold storage & warehousing |
  | White Label L.L.C | F&B group (Billionaire Mansion, Epicure Catering) |
  | Procon Emirates LLC | Fireproofing contracting (Muehlhan Group) |
  | Technical Resources LLC | Equipment sales & plant hire (Albwardy Group) |

- **Sibling inference** where an opaque name has a self-describing affiliate
  elsewhere in the same list (e.g. Al Rawabit International → Recruitment).

## Confidence

| Level | Unique companies | Meaning |
|---|---|---|
| High | 651 | Named activity, known brand, or web-verified |
| Medium | 518 | Clear keyword signal in the trade name |
| Low | 123 | Generic name; industry is a best guess |

29 names remain **Unclassified** — mostly initialisms and personal-name
accounts (`HATCO`, `ICEM`, `CIMAC`, `PANAGIA`, `TJJ & Co.`, `QASSIM`,
`CASH CUSTOMER`). Searched where searchable; nothing conclusive was found.

## Caveats

- "General Trading LLC" is a real UAE licence category that permits almost
  anything. 232 companies fall under **Trading & Distribution** because the
  licence name genuinely does not narrow further — not because they were skipped.
- Group holding entities (`... Investment Group LLC`, `... Group of Companies`)
  are tagged **Diversified Group**; the operating subsidiary usually appears
  separately in the same list with its real activity.
- Duplicate rows are transaction-level repeats of the same party, kept as-is.
  `Rows in source list` shows how often each company appears.

## Update — new-account diff (2026-10-02)

A second export (contact-level, 3,387 rows / 1,302 distinct `PARTYMST_DESC`) was
compared against the baseline list of 1,292 names.

**11 new accounts.** Only 3 are genuinely new companies; the other 8 are
additional legal entities of groups already in the customer base.

| New account | Status | Industry |
|---|---|---|
| AUTOPRO GLOBAL L.L.C- FZCO | New company | Automotive Parts Trading |
| PADEL KINGDOM SPORTS & RECREATIONAL CLUB LLC | New company | Sports & Recreation |
| TRUENORTH FOUNDATION | New company | Unclassified (no public record) |
| ABDULWAHED BIN SHABIB FOR TRADING AND SERVICES LLC | New entity | Trading & Distribution |
| AQUAPLEX TRADING CO. WLL | New entity | Trading & Distribution |
| COOL LINE EXPRESS COMPANY FOR AUTO PARTS AND ACCESSORIES | New entity | Automotive Parts Trading |
| COOLLINE RADIATORS AND AC SPARE PARTS TRADING W.L.L | New entity | Automotive Parts Trading |
| NEW REVIVE GREEN TECHNOLOGY WATER PURIFICATION LLC | New entity (MEF International) | Water Treatment |
| TEE DEE STEEL & METALS FZE | New entity | Manufacturing - Metals |
| VTS MEA AIR SYSTEM SERVICES L.L.C | New entity | HVAC Services |
| WORLEYPARSONS ENGINEERING CONSULTANCIES CO. | New entity | Engineering Consultancy |

Other movement: `ABDUL WAHED BIN SHABIB TRADING L.L.C` dropped out (4 rows), and
4 extra contacts were added at 3 existing accounts (Malta Auto Spare Parts +2,
Mahaseel Investment +1, Safe Line Electrical & Mechanical +1).
Row reconciliation: 3,358 − 4 + 29 + 4 = 3,387.

Outputs: `data/New_Accounts_vs_Baseline.xlsx`, `data/new_accounts_vs_baseline.csv`,
`data/new_party_list_unique.txt`.
