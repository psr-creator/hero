import json, csv

ROWS = [
 # name, industry, activity, confidence, source, status, group/parent
 ("AUTOPRO GLOBAL L.L.C- FZCO","Automotive Parts Trading",
  "Importer & distributor of genuine Toyota/Nissan/Mitsubishi/Hyundai/Mazda/Isuzu spare parts (JAFZA)",
  "High","Web-verified","NEW COMPANY",""),
 ("PADEL KINGDOM SPORTS & RECREATIONAL CLUB LLC","Sports & Recreation",
  "Padel club operator - indoor courts, coaching, tournaments, proshop (Dubai/Abu Dhabi/Bahrain)",
  "High","Web-verified","NEW COMPANY","Yateem family (contact via hr@yateemgroup.ae)"),
 ("TRUENORTH FOUNDATION","Unclassified",
  "Searched - no public UAE record found; personal Gmail contact only",
  "Low","Web-verified","NEW COMPANY",""),
 ("ABDULWAHED BIN SHABIB FOR TRADING AND SERVICES LLC","Trading & Distribution",
  "General trading & services arm",
  "Medium","Name-derived","NEW ENTITY of existing customer","Abdulwahed Bin Shabib Group (19 entities already in list)"),
 ("AQUAPLEX TRADING CO. WLL","Trading & Distribution",
  "Trading entity",
  "Medium","Name-derived","NEW ENTITY of existing customer","Aquaplex (AQUAPLEX FZE, AQUAPLEX TRADING WLL)"),
 ("COOL LINE EXPRESS COMPANY FOR AUTO PARTS AND ACCESSORIES","Automotive Parts Trading",
  "Auto parts & accessories - Kuwait entity (accounts.kwt@coolline-group.com)",
  "High","Name-derived","NEW ENTITY of existing customer","Coolline Group (2 entities already in list)"),
 ("COOLLINE RADIATORS AND AC SPARE PARTS TRADING W.L.L","Automotive Parts Trading",
  "Radiators & AC spare parts - WLL entity",
  "High","Name-derived","NEW ENTITY of existing customer","Coolline Group (2 entities already in list)"),
 ("NEW REVIVE GREEN TECHNOLOGY WATER PURIFICATION LLC","Water Treatment",
  "Water purification systems; all contacts on @meftinternational.net",
  "High","Name-derived","NEW ENTITY of existing customer","MEF International (MEF TECHNICAL SERVICES L.L.C)"),
 ("TEE DEE STEEL & METALS FZE","Manufacturing - Metals",
  "Steel & metals",
  "Medium","Name-derived","NEW ENTITY of existing customer","Tee Dee Group (5 entities already in list)"),
 ("VTS MEA AIR SYSTEM SERVICES L.L.C","HVAC Services",
  "Air handling / ventilation system service arm of VTS Group",
  "High","Name-derived","NEW ENTITY of existing customer","VTS Group (VTS CLIMA WLL, VTS MEA AIR CONDITION TRADING CO LLC)"),
 ("WORLEYPARSONS ENGINEERING CONSULTANCIES CO.","Engineering Consultancy",
  "Engineering consultancy entity",
  "Medium","Name-derived","NEW ENTITY of existing customer","Worley / WorleyParsons (6 entities already in list)"),
]

recs = json.load(open('new_contacts.json', encoding='utf-8'))
by = {}
for r in recs:
    by.setdefault(r['PARTYMST_DESC'], []).append(r)

HDR = ["New Account","Status","Parent Group (if any)","Industry","Activity",
       "Confidence","Source","Contact Name","Designation","Email","Phone"]

with open('/home/user/hero/data/new_accounts_vs_baseline.csv','w',newline='',encoding='utf-8') as f:
    w = csv.writer(f); w.writerow(HDR)
    for name, ind, act, conf, src, status, grp in ROWS:
        for c in by[name]:
            w.writerow([name,status,grp,ind,act,conf,src,
                        (c.get('ACCONDET_NAME') or '').strip(),
                        (c.get('ACCONDET_DESIGNATION') or '').strip(),
                        (c.get('ACCONDET_EMAIL') or '').strip(),
                        (c.get('CONTACT_NUMBER') or '').strip()])
print("rows:", sum(len(by[r[0]]) for r in ROWS))
json.dump(ROWS, open('new_rows.json','w'))
