/* Aramam × Gerab System Solutions — Microsoft Dynamics 365 Business Central proposal deck */
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const Fa = require("react-icons/fa6");

const OUT = process.argv[2] || path.join(__dirname, "Aramam_BusinessCentral.pptx");

/* ---------------------------------------------------------------- palette */
const C = {
  ink: "1E1B18",
  ink2: "2B2621",
  ink3: "3B342D",
  body: "55504A",
  muted: "8C857C",
  faint: "B7AFA5",
  rule: "E2DCD4",
  card: "F5F2EE",
  white: "FFFFFF",
  accent: "C1562B",
  accentDk: "97401E",
  accentLt: "F3E3DA",
  gold: "D3A03C",
  teal: "2F6B60",
  tealLt: "E2ECEA",
  red: "B03A2B",
};

const F = { head: "Cambria", body: "Calibri" };
const W = 13.333, H = 7.5, M = 0.62, CW = W - M * 2;

/* ---------------------------------------------------------------- icons */
const iconCache = new Map();
async function icon(name, hex) {
  const key = name + hex;
  if (iconCache.has(key)) return iconCache.get(key);
  const Comp = Fa[name];
  if (!Comp) throw new Error("Missing react-icon: " + name);
  let svg = renderToStaticMarkup(React.createElement(Comp, { size: 512 }));
  svg = svg.split("currentColor").join("#" + hex);
  const buf = await sharp(Buffer.from(svg)).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const data = "image/png;base64," + buf.toString("base64");
  iconCache.set(key, data);
  return data;
}
const shadow = (o = {}) => ({ type: "outer", color: "1E1B18", blur: 10, offset: 2, angle: 90, opacity: 0.08, ...o });

/* ---------------------------------------------------------------- helpers */
let pres;
const slides = [];

function newSlide(bg) {
  const s = pres.addSlide();
  s.background = { color: bg || C.white };
  slides.push(s);
  return s;
}

function kicker(s, text, color) {
  s.addText(text.toUpperCase(), {
    x: M, y: 0.44, w: CW, h: 0.26, isTextBox: true, margin: 0,
    fontFace: F.body, fontSize: 10.5, bold: true, charSpacing: 2.2,
    color: color || C.accent, valign: "middle",
  });
}

function heading(s, title, sub, opts = {}) {
  const w = opts.w || CW;
  // Cambria bold runs ~0.0082in per point per character; shrink so the title stays on one line
  let size = opts.size || 31;
  while (size > 21 && title.length * size * 0.0082 > w) size -= 1;
  s.addText(title, {
    x: M, y: 0.7, w, h: 0.66, isTextBox: true, margin: 0,
    fontFace: F.head, fontSize: size, bold: true, color: opts.color || C.ink, valign: "middle",
  });
  if (sub) {
    s.addText(sub, {
      x: M, y: 1.4, w: opts.subW || Math.min(w, 10.6), h: 0.62, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 13.5, color: opts.subColor || C.body, lineSpacingMultiple: 1.15, valign: "top",
    });
  }
}

function footer(s, n, dark) {
  s.addShape(pres.ShapeType.line, {
    x: M, y: 6.86, w: CW, h: 0,
    line: { color: dark ? "413A33" : C.rule, width: 0.75 },
  });
  s.addText("Gerab System Solutions  ·  Microsoft Dynamics 365 Business Central for Aramam", {
    x: M, y: 6.96, w: CW - 0.7, h: 0.28, isTextBox: true, margin: 0,
    fontFace: F.body, fontSize: 9, color: dark ? C.faint : C.muted, valign: "middle",
  });
  s.addText(String(n), {
    x: W - M - 0.7, y: 6.96, w: 0.7, h: 0.28, isTextBox: true, margin: 0,
    fontFace: F.body, fontSize: 9, color: dark ? C.faint : C.muted, align: "right", valign: "middle",
  });
}

function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: opts.fill || C.card },
    line: opts.line === null ? { type: "none" } : { color: opts.line || C.rule, width: 0.75 },
    shadow: opts.shadow ? shadow() : undefined,
  });
}

/* dashed placeholder frame the user replaces with a real image */
function imagePH(s, x, y, w, h, label, opts = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: opts.fill || (opts.dark ? "312A24" : "EFEBE5") },
    line: { color: opts.dark ? "6E6157" : C.faint, width: 1, dashType: "dash" },
  });
  s.addText(label, {
    x: x + 0.18, y: y + h / 2 - 0.45, w: w - 0.36, h: 0.9, isTextBox: true, margin: 0,
    fontFace: F.body, fontSize: opts.fontSize || 10.5, color: opts.dark ? C.faint : C.muted,
    align: "center", valign: "middle", lineSpacingMultiple: 1.2, italic: true,
  });
}

function logoPH(s, x, y, w, h, label, dark) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: dark ? "312A24" : C.white },
    line: { color: dark ? "6E6157" : C.faint, width: 1, dashType: "dash" },
  });
  s.addText(label, {
    x: x + 0.08, y, w: w - 0.16, h, isTextBox: true, margin: 0,
    fontFace: F.body, fontSize: 8.5, color: dark ? C.faint : C.muted,
    align: "center", valign: "middle", italic: true,
  });
}

async function iconCircle(s, x, y, d, iconName, opts = {}) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: { color: opts.bg || C.accentLt },
    line: { type: "none" },
  });
  s.addImage({
    data: await icon(iconName, opts.color || C.accent),
    x: x + d * 0.27, y: y + d * 0.27, w: d * 0.46, h: d * 0.46,
  });
}

/* icon + heading + body, used in card grids */
async function iconCard(s, x, y, w, h, o) {
  card(s, x, y, w, h, { fill: o.fill, line: o.line, shadow: o.shadow });
  const d = 0.44;
  await iconCircle(s, x + 0.28, y + 0.24, d, o.icon, { bg: o.iconBg, color: o.iconColor });
  s.addText(o.title, {
    x: x + 0.84, y: y + 0.2, w: w - 1.12, h: 0.52, isTextBox: true, margin: 0,
    fontFace: F.body, fontSize: 12.5, bold: true, color: o.titleColor || C.ink,
    valign: "middle", lineSpacingMultiple: 0.98,
  });
  s.addText(o.text, {
    x: x + 0.28, y: y + 0.82, w: w - 0.56, h: h - 1.02, isTextBox: true, margin: 0,
    fontFace: F.body, fontSize: 11, color: o.textColor || C.body, lineSpacingMultiple: 1.18, valign: "top",
  });
}

/* simple styled bullet block */
function bullets(s, x, y, w, h, items, opts = {}) {
  const base = {
    fontFace: F.body,
    fontSize: opts.fontSize || 11.5,
    color: opts.color || C.body,
    paraSpaceAfter: opts.gap === undefined ? 7 : opts.gap,
    lineSpacingMultiple: 1.1,
  };
  const objs = [];
  items.forEach((t, i) => {
    const last = i === items.length - 1;
    if (typeof t === "object") {
      objs.push({ text: t.label + "  ", options: { ...base, bullet: { code: "2022" }, breakLine: false, bold: true, color: opts.labelColor || C.ink } });
      objs.push({ text: t.text, options: { ...base, breakLine: !last } });
    } else {
      objs.push({ text: t, options: { ...base, bullet: { code: "2022" }, breakLine: !last } });
    }
  });
  s.addText(objs, { x, y, w, h, isTextBox: true, margin: 0, valign: "top" });
}

/* ================================================================ BUILD */
async function build() {
  pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Gerab System Solutions";
  pres.company = "Gerab System Solutions";
  pres.title = "Microsoft Dynamics 365 Business Central for Aramam";

  /* ---------------------------------------------------------- 1. TITLE */
  {
    const s = newSlide(C.ink);
    // full-bleed background image placeholder (replace fill with photo)
    s.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: W, h: H,
      fill: { color: "2A241F" },
      line: { color: "6E6157", width: 1, dashType: "dash" },
    });
    // scrim so the headline stays readable once a photo is dropped in
    s.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: W, h: H,
      fill: { color: C.ink, transparency: 42 },
      line: { type: "none" },
    });

    logoPH(s, M, 0.5, 2.0, 0.72, "GERAB LOGO", true);
    logoPH(s, W - M - 2.0, 0.5, 2.0, 0.72, "ARAMAM LOGO", true);

    s.addText("PROPOSAL  ·  DIGITAL TRANSFORMATION OF OPERATIONS & FINANCE", {
      x: M, y: 2.72, w: CW, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 11, bold: true, charSpacing: 2.4, color: C.gold, valign: "middle",
    });
    s.addText("Run the whole group\non one system.", {
      x: M, y: 3.08, w: 9.6, h: 1.75, isTextBox: true, margin: 0,
      fontFace: F.head, fontSize: 46, bold: true, color: C.white, lineSpacingMultiple: 1.02, valign: "top",
    });
    s.addText(
      "Microsoft Dynamics 365 Business Central for Aramam — outlet inventory and procurement, recipe-driven consumption from POS, and a finance function that closes on time.",
      {
        x: M, y: 4.92, w: 8.6, h: 0.8, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 14, color: "E7E1D9", lineSpacingMultiple: 1.2, valign: "top",
      }
    );
    s.addShape(pres.ShapeType.line, { x: M, y: 5.95, w: 3.2, h: 0, line: { color: C.accent, width: 2.25 } });
    s.addText("Prepared for  Aramam Restaurants\nPrepared by  Gerab System Solutions  ·  September 2026", {
      x: M, y: 6.12, w: 7.5, h: 0.7, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 11.5, color: "CFC7BC", lineSpacingMultiple: 1.25, valign: "top",
    });
    s.addText("↑ Full-bleed background image placeholder — right-click this rectangle → Format Shape → Picture fill, then delete this note.", {
      x: W - M - 5.6, y: 6.95, w: 5.6, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 8.5, italic: true, color: "9A8F83", align: "right", valign: "middle",
    });
    s.addNotes("Open on the ambition, not the software. Aramam is scaling — a cloud kitchen is coming — and the operating system underneath has to change before the volume arrives.");
  }

  /* ---------------------------------------------------------- 2. AGENDA */
  {
    const s = newSlide();
    kicker(s, "Agenda");
    heading(s, "What we will cover", "Roughly thirty minutes, then discussion. Stop us wherever it is useful.");

    const rows = [
      ["01", "Who we are", "Gerab System Solutions — what we do and who we do it for."],
      ["02", "Where Aramam is today", "The current operating and finance setup, and what it costs."],
      ["03", "Why Business Central", "The platform, and why it fits a growing restaurant group."],
      ["04", "The three focus areas", "Inventory & procurement · Recipe & consumption · Finance & MIS."],
      ["05", "Compliance and scale", "VAT, e-invoicing readiness, and the cloud kitchen."],
      ["06", "How we deliver", "Roadmap, responsibilities and next steps."],
    ];
    const y0 = 2.18, rh = 0.74;
    rows.forEach(([n, t, d], i) => {
      const y = y0 + i * rh;
      s.addText(n, {
        x: M, y, w: 0.72, h: rh - 0.08, isTextBox: true, margin: 0,
        fontFace: F.head, fontSize: 20, bold: true, color: C.accent, valign: "middle",
      });
      s.addText(t, {
        x: M + 0.8, y, w: 3.5, h: rh - 0.08, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 14, bold: true, color: C.ink, valign: "middle",
      });
      s.addText(d, {
        x: M + 4.4, y, w: CW - 4.4, h: rh - 0.08, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 12, color: C.body, valign: "middle",
      });
      if (i < rows.length - 1) {
        s.addShape(pres.ShapeType.line, { x: M, y: y + rh - 0.06, w: CW, h: 0, line: { color: C.rule, width: 0.75 } });
      }
    });
    footer(s, 2);
  }

  /* ---------------------------------------------------------- 3. WHO WE ARE */
  {
    const s = newSlide();
    kicker(s, "Who we are");
    heading(s, "Gerab System Solutions", null, { w: 7.2 });

    s.addText(
      "We are a UAE-based enterprise technology company. We design, implement and support the business systems that groups like yours run on — ERP, Microsoft 365 and SharePoint, Power Platform and business intelligence, infrastructure and cloud, and the managed support that keeps all of it running afterwards.\n\nWe are a Microsoft partner with delivery experience across construction, trading, manufacturing and services businesses in the UAE — the same operating realities as a multi-outlet restaurant group: many locations, tight margins, and a finance team that needs the numbers early.",
      {
        x: M, y: 1.5, w: 6.55, h: 2.6, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 12.5, color: C.body, lineSpacingMultiple: 1.28, valign: "top",
      }
    );

    imagePH(s, 7.55, 1.5, 5.16, 3.35, "PHOTO PLACEHOLDER\nGerab office / delivery team  ·  landscape 3:2");

    const pills = [
      ["Microsoft partner", "Dynamics 365, Microsoft 365 and Azure."],
      ["Single accountable partner", "Licensing, implementation and support in one contract."],
      ["UAE-based delivery", "Local consultants, local hours, on-site when it matters."],
      ["Post go-live support", "Managed services and an AMS desk after hypercare."],
    ];
    const pw = (CW - 0.36 * 3) / 4;
    for (let i = 0; i < pills.length; i++) {
      const x = M + i * (pw + 0.36);
      card(s, x, 5.06, pw, 1.56);
      s.addText(pills[i][0], {
        x: x + 0.24, y: 5.2, w: pw - 0.48, h: 0.52, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 12.5, bold: true, color: C.ink, valign: "top", lineSpacingMultiple: 0.98,
      });
      s.addText(pills[i][1], {
        x: x + 0.24, y: 5.74, w: pw - 0.48, h: 0.78, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 10.5, color: C.body, lineSpacingMultiple: 1.15, valign: "top",
      });
    }
    footer(s, 3);
    s.addNotes("Keep this short. Establish credibility, then move to their business. Insert real figures (years in the UAE, team size, number of implementations) before presenting.");
  }

  /* ---------------------------------------------------------- 4. WHAT WE DO */
  {
    const s = newSlide();
    kicker(s, "Our practice");
    heading(s, "What we deliver", "One partner across the stack — so the ERP, the reporting layer and the infrastructure underneath are not three different conversations.");

    const items = [
      ["FaGears", "ERP — Dynamics 365 Business Central", "Finance, inventory, purchasing, production and projects on Microsoft's cloud ERP."],
      ["FaFolderOpen", "Microsoft 365 & SharePoint", "Document management, records, intranet and collaboration."],
      ["FaChartColumn", "Power Platform & BI", "Power BI dashboards, Power Apps forms and Power Automate workflows."],
      ["FaCloud", "Cloud & infrastructure", "Azure, networking, servers and backup — designed, migrated and managed."],
      ["FaShieldHalved", "Security", "Identity, access control, endpoint and email security."],
      ["FaHeadset", "Managed services & support", "AMS desk, enhancements and version upgrades after go-live."],
    ];
    const cw = (CW - 0.36 * 2) / 3, ch = 2.05;
    for (let i = 0; i < items.length; i++) {
      const x = M + (i % 3) * (cw + 0.36);
      const y = 2.42 + Math.floor(i / 3) * (ch + 0.32);
      await iconCard(s, x, y, cw, ch, { icon: items[i][0], title: items[i][1], text: items[i][2] });
    }
    footer(s, 4);
  }

  /* ---------------------------------------------------------- 5. CLIENTS */
  {
    const s = newSlide();
    kicker(s, "Selected clients");
    heading(s, "Delivered in production, across sectors", "Portals, document management, workflow and business systems for organisations that cannot afford downtime.");

    const names = [
      ["Dubai World Trade Centre", "EVENTS & VENUES"],
      ["Petrofac — PetroNet", "OIL & GAS SERVICES"],
      ["ASG", "IT & BUSINESS SOLUTIONS"],
      ["Total Security Solutions", "SECURITY SERVICES"],
      ["VIVA", "AVIATION"],
      ["AAB", "DIVERSIFIED GROUP"],
      ["ASCO", "DISTRIBUTION"],
      ["Corporate Group Portal", "TRADING / SERVICES"],
    ];
    const cw = (CW - 0.32 * 3) / 4, ch = 1.96;
    names.forEach(([n, sec], i) => {
      const x = M + (i % 4) * (cw + 0.32);
      const y = 2.34 + Math.floor(i / 4) * (ch + 0.3);
      card(s, x, y, cw, ch, { fill: C.white, shadow: true });
      logoPH(s, x + 0.28, y + 0.2, cw - 0.56, 0.62, "CLIENT LOGO");
      s.addText(n, {
        x: x + 0.18, y: y + 0.9, w: cw - 0.36, h: 0.52, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 12, bold: true, color: C.ink, align: "center", valign: "middle", lineSpacingMultiple: 0.98,
      });
      s.addText(sec, {
        x: x + 0.14, y: y + 1.46, w: cw - 0.28, h: 0.3, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 8.5, bold: true, charSpacing: 1.1, color: C.accent, align: "center", valign: "middle",
      });
    });
    footer(s, 5);
  }

  /* ---------------------------------------------------------- 6. AS-IS FLOW */
  {
    const s = newSlide();
    kicker(s, "Where Aramam is today");
    heading(s, "How a sale becomes a number today", "As we understand it from our discussions. Correct us where we have it wrong — the detail matters.");

    const steps = [
      ["FaStore", "Outlets sell", "POS records the sale at each outlet."],
      ["FaFileExcel", "Monthly summary", "Sales consolidated by hand at month end."],
      ["FaUser", "One finance desk", "Everything lands with the central finance person."],
      ["FaKeyboard", "Re-keyed into Tally", "Ledgers entered manually, entry by entry."],
      ["FaFilePdf", "Reports, eventually", "MIS assembled in Excel, weeks after the fact."],
    ];
    const cw = (CW - 0.42 * 4) / 5, ch = 2.2, y = 2.34;
    for (let i = 0; i < steps.length; i++) {
      const x = M + i * (cw + 0.42);
      card(s, x, y, cw, ch, { fill: C.white, shadow: true });
      await iconCircle(s, x + cw / 2 - 0.28, y + 0.24, 0.56, steps[i][0], { bg: C.card, color: C.ink3 });
      s.addText(steps[i][1], {
        x: x + 0.14, y: y + 0.9, w: cw - 0.28, h: 0.46, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 12.5, bold: true, color: C.ink, align: "center", valign: "top", lineSpacingMultiple: 0.98,
      });
      s.addText(steps[i][2], {
        x: x + 0.16, y: y + 1.4, w: cw - 0.32, h: 0.7, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 10.5, color: C.body, align: "center", lineSpacingMultiple: 1.15, valign: "top",
      });
      if (i < steps.length - 1) {
        s.addText("→", {
          x: x + cw + 0.02, y: y + 0.32, w: 0.38, h: 0.4, isTextBox: true, margin: 0,
          fontFace: F.body, fontSize: 18, bold: true, color: C.faint, align: "center", valign: "middle",
        });
      }
    }

    card(s, M, 4.86, CW, 1.72, { fill: C.accentLt, line: "E8D3C6" });
    s.addText("Meanwhile, off the system entirely", {
      x: M + 0.34, y: 5.02, w: 4.4, h: 0.32, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 12.5, bold: true, color: C.accentDk, valign: "middle",
    });
    bullets(s, M + 0.34, 5.42, 5.6, 1.0, [
      "Purchases, GRNs and supplier prices tracked on spreadsheets and messages",
      "Outlet-to-outlet transfers agreed informally, rarely recorded",
    ], { fontSize: 11, color: C.ink3, gap: 5 });
    bullets(s, M + 6.3, 5.42, 5.5, 1.0, [
      "Recipes and portion costs held in people's heads, not in a system",
      "Closing stock arrived at by count and estimate, not by movement",
    ], { fontSize: 11, color: C.ink3, gap: 5 });

    footer(s, 6);
    s.addNotes("Say this back to them as their story, not as criticism. If they correct a step, that is a good sign — they are engaged.");
  }

  /* ---------------------------------------------------------- 7. PROBLEMS */
  {
    const s = newSlide();
    kicker(s, "The problem", C.red);
    heading(s, "Six things this setup cannot do", "None of these are people problems. They are what happens when a group's operations run on manual consolidation and a desktop ledger.");

    const items = [
      ["FaClockRotateLeft", "You find out a month late", "Sales reach finance as a monthly summary. By the time a problem is visible in the books, the month that caused it is already closed."],
      ["FaKeyboard", "Every number is typed twice", "Manual re-entry into Tally is slow, error-prone and unauditable — and it rests on one person. That is a single point of failure for the entire group."],
      ["FaBoxesStacked", "Stock visibility stops at the outlet door", "There is no live group-wide stock position, no controlled transfer between outlets, and no reliable answer to \"what do we actually hold right now?\""],
      ["FaCartShopping", "Buying without control", "No requisition-to-PO-to-GRN discipline, no approved supplier price lists, no price history — so purchase price creep goes unnoticed."],
      ["FaUtensils", "Food cost is estimated, not measured", "Without recipes linked to POS sales, theoretical consumption cannot be calculated — so wastage, over-portioning and pilferage stay invisible."],
      ["FaChartPie", "Reporting is a monthly craft project", "MIS is rebuilt by hand in Excel each month. Outlet-wise profitability, on demand, is not currently possible."],
    ];
    const cw = (CW - 0.36 * 2) / 3, ch = 2.08;
    for (let i = 0; i < items.length; i++) {
      const x = M + (i % 3) * (cw + 0.36);
      const y = 2.5 + Math.floor(i / 3) * (ch + 0.3);
      await iconCard(s, x, y, cw, ch, {
        icon: items[i][0], title: items[i][1], text: items[i][2],
        iconBg: "F6E4E0", iconColor: C.red,
      });
    }
    footer(s, 7);
  }

  /* ---------------------------------------------------------- 8. COST OF STAYING */
  {
    const s = newSlide(C.ink);
    kicker(s, "The cost of standing still", C.gold);
    heading(s, "And this is the base you are about to scale", "A cloud kitchen adds a production location, new SKUs, new transfer routes and new delivery-channel revenue — on top of a process that is already manual.", { color: C.white, subColor: "CFC7BC" });

    const stats = [
      ["~30 days", "between a sale happening and a reviewed, posted number"],
      ["1 person", "carrying the group's ledger — a single point of failure"],
      ["0", "live, system-held stock positions across outlets"],
      ["Unmeasured", "food cost variance — no theoretical vs actual to compare"],
    ];
    const cw = (CW - 0.36 * 3) / 4;
    stats.forEach(([big, small], i) => {
      const x = M + i * (cw + 0.36);
      s.addShape(pres.ShapeType.roundRect, {
        x, y: 2.62, w: cw, h: 1.9, rectRadius: 0.08,
        fill: { color: "2B2621" }, line: { color: "463E36", width: 0.75 },
      });
      s.addText(big, {
        x: x + 0.22, y: 2.8, w: cw - 0.44, h: 0.72, isTextBox: true, margin: 0,
        fontFace: F.head, fontSize: big.length <= 3 ? 34 : big.length <= 9 ? 24 : 20,
        bold: true, color: C.gold, valign: "middle",
      });
      s.addText(small, {
        x: x + 0.22, y: 3.56, w: cw - 0.44, h: 0.82, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 11, color: "CFC7BC", lineSpacingMultiple: 1.15, valign: "top",
      });
    });

    const risks = [
      ["FaFileInvoice", "Compliance is tightening", "The UAE is moving to mandatory e-invoicing. Manual ledgers and offline entry are the wrong starting point for that transition."],
      ["FaArrowUpRightDots", "Volume is about to jump", "New location, new channels, more transactions — the manual month-end does not scale linearly, it breaks."],
      ["FaEyeSlash", "Decisions run on stale data", "Menu, pricing and supplier decisions are being made on numbers that are already a month old."],
    ];
    const rw = (CW - 0.36 * 2) / 3;
    for (let i = 0; i < risks.length; i++) {
      const x = M + i * (rw + 0.36);
      await iconCard(s, x, 4.78, rw, 1.92, {
        icon: risks[i][0], title: risks[i][1], text: risks[i][2],
        fill: "241F1B", line: "463E36", iconBg: "3A322B", iconColor: C.gold,
        titleColor: C.white, textColor: "CFC7BC",
      });
    }
    footer(s, 8, true);
    s.addNotes("This is the pivot slide. Land the point that the problem is not today's pain — it is what today's pain becomes at twice the volume.");
  }

  /* ---------------------------------------------------------- 9. BEFORE / AFTER */
  {
    const s = newSlide();
    kicker(s, "What good looks like");
    heading(s, "The same business, running on evidence", "Nothing here is aspirational software talk — each row is a specific change in how a day at Aramam works.");

    const rows = [
      ["Sales reach finance", "Monthly, as a typed summary", "Daily, posted automatically from POS"],
      ["Stock position", "Counted, estimated, argued about", "Live by outlet, by item, by batch"],
      ["Buying", "Ad-hoc orders, prices unverified", "Requisition → approval → PO → GRN → invoice match"],
      ["Transfers between outlets", "Informal, largely unrecorded", "Transfer orders with in-transit visibility"],
      ["Food cost", "A number arrived at after the fact", "Recipe-driven theoretical vs actual, per dish, per outlet"],
      ["Management reporting", "Rebuilt in Excel each month", "Role-based dashboards, refreshed daily"],
    ];

    const lx = M, cwd = 2.85, colA = 3.6, colB = CW - 2.85 - 0.3 - 3.6 - 0.4;
    const hy = 2.32;
    s.addText("", { x: 0, y: 0, w: 0.1, h: 0.1, isTextBox: true });
    s.addText("TODAY", {
      x: lx + cwd + 0.3, y: hy, w: colA, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 10, bold: true, charSpacing: 1.6, color: C.red, valign: "middle",
    });
    s.addText("WITH BUSINESS CENTRAL", {
      x: lx + cwd + 0.3 + colA + 0.4, y: hy, w: colB, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 10, bold: true, charSpacing: 1.6, color: C.teal, valign: "middle",
    });

    const ry0 = 2.72, rh = 0.68;
    rows.forEach(([label, a, b], i) => {
      const y = ry0 + i * rh;
      if (i % 2 === 0) {
        s.addShape(pres.ShapeType.rect, { x: lx - 0.14, y: y - 0.04, w: CW + 0.28, h: rh - 0.04, fill: { color: "FAF8F6" }, line: { type: "none" } });
      }
      s.addText(label, {
        x: lx, y, w: cwd, h: rh - 0.08, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 12, bold: true, color: C.ink, valign: "middle",
      });
      s.addText(a, {
        x: lx + cwd + 0.3, y, w: colA, h: rh - 0.08, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 11.5, color: C.body, valign: "middle",
      });
      s.addText(b, {
        x: lx + cwd + 0.3 + colA + 0.4, y, w: colB, h: rh - 0.08, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 11.5, bold: true, color: C.teal, valign: "middle",
      });
    });
    footer(s, 9);
  }

  /* ---------------------------------------------------------- 10. WHY BC */
  {
    const s = newSlide();
    kicker(s, "The recommendation");
    heading(s, "Microsoft Dynamics 365 Business Central", "One cloud ERP covering finance, inventory, purchasing and production — not four disconnected tools stitched together with spreadsheets.", { w: 9.6, subW: 9.4 });

    const reasons = [
      ["FaLayerGroup", "One system, not four", "Finance, stock, purchasing and recipe costing share the same data. Post once, see it everywhere."],
      ["FaCloud", "Cloud, from Microsoft", "No servers to buy or patch. Updated twice a year, backed by Microsoft's SLA and security."],
      ["FaFileExcel", "Your team already knows it", "Native Excel, Outlook and Teams integration. Finance can still work in Excel — on live data."],
      ["FaMapLocationDot", "Built for many locations", "Locations, dimensions and inter-company are standard, not bolted on. Adding an outlet is configuration."],
      ["FaChartLine", "Power BI included in the story", "Role centres in the app, and full Power BI dashboards for management and owners."],
      ["FaScaleBalanced", "UAE-ready", "VAT handling, audit trail and a clear path to the UAE e-invoicing mandate through accredited providers."],
    ];
    const cw = (CW - 0.36 * 2) / 3, ch = 1.98;
    for (let i = 0; i < reasons.length; i++) {
      const x = M + (i % 3) * (cw + 0.36);
      const y = 2.62 + Math.floor(i / 3) * (ch + 0.3);
      await iconCard(s, x, y, cw, ch, { icon: reasons[i][0], title: reasons[i][1], text: reasons[i][2] });
    }
    logoPH(s, W - M - 2.3, 0.72, 2.3, 0.86, "MICROSOFT / D365 LOGO");
    footer(s, 10);
  }

  /* ---------------------------------------------------------- 11. SOLUTION MAP */
  {
    const s = newSlide();
    kicker(s, "Scope");
    heading(s, "Three focus areas, one foundation", "These are the three areas you asked us to solve. They are not three projects — they are three views of the same data.");

    const cols = [
      ["01", "FaBoxesStacked", "Inventory & procurement", [
        "Central store, outlet and cloud-kitchen locations",
        "Requisition → PO → GRN → invoice matching",
        "Outlet-to-outlet transfer orders",
        "Counts, batch and expiry, reorder points",
      ]],
      ["02", "FaUtensils", "Recipe & consumption", [
        "Recipe cards with yield and portion cost",
        "POS sales mapped to recipes automatically",
        "Theoretical consumption posted per outlet",
        "Theoretical vs actual variance and wastage",
      ]],
      ["03", "FaChartColumn", "Finance, dashboards & MIS", [
        "Automated posting from sales and purchases",
        "Outlet-wise P&L through dimensions",
        "VAT, AP/AR, banking, fixed assets, budgets",
        "Management dashboards and the monthly MIS pack",
      ]],
    ];
    const cw = (CW - 0.4 * 2) / 3, ch = 3.5, y = 2.32;
    for (let i = 0; i < cols.length; i++) {
      const [num, ic, title, list] = cols[i];
      const x = M + i * (cw + 0.4);
      card(s, x, y, cw, ch, { fill: C.white, shadow: true });
      await iconCircle(s, x + 0.32, y + 0.34, 0.62, ic, { bg: C.accentLt, color: C.accent });
      s.addText(num, {
        x: x + cw - 0.92, y: y + 0.3, w: 0.7, h: 0.5, isTextBox: true, margin: 0,
        fontFace: F.head, fontSize: 24, bold: true, color: "EBE5DD", align: "right", valign: "middle",
      });
      s.addText(title, {
        x: x + 0.32, y: y + 1.04, w: cw - 0.64, h: 0.56, isTextBox: true, margin: 0,
        fontFace: F.head, fontSize: 16.5, bold: true, color: C.ink, valign: "top", lineSpacingMultiple: 0.98,
      });
      bullets(s, x + 0.32, y + 1.66, cw - 0.64, ch - 1.86, list, { fontSize: 10.5, gap: 6 });
    }

    card(s, M, 6.0, CW, 0.72, { fill: C.ink, line: null });
    s.addText(
      [
        { text: "Shared foundation:  ", options: { bold: true, color: C.gold } },
        { text: "one chart of accounts · dimensions for Outlet, Brand and Cost centre · one item master · approval workflows · user roles and permissions", options: { color: "E7E1D9" } },
      ],
      { x: M + 0.34, y: 6.0, w: CW - 0.68, h: 0.72, isTextBox: true, margin: 0, fontFace: F.body, fontSize: 12, valign: "middle" }
    );
    footer(s, 11);
  }

  /* ---------------------------------------------------------- 12. FOCUS 1 */
  {
    const s = newSlide();
    kicker(s, "Focus area 1 of 3");
    heading(s, "Inventory and procurement across every outlet", "One item master, one stock ledger, and every movement recorded as a transaction — receipts, issues, transfers, wastage and counts.", { w: 11.6, subW: 11.0 });

    bullets(s, M, 2.36, 6.35, 4.2, [
      { label: "Item master with real units.", text: "Purchase in kg, box or crate; consume in grams or portions. Conversions handled once, centrally." },
      { label: "A location per outlet.", text: "Central store, each outlet and the cloud kitchen are separate locations with their own stock and their own reorder rules." },
      { label: "Procure-to-pay with control.", text: "Purchase requisition → approval → purchase order → goods receipt → three-way invoice match. Nothing is paid that was not received." },
      { label: "Supplier price lists and history.", text: "Approved prices per vendor, with variance flagged when an invoice does not match the order." },
      { label: "Transfer orders between outlets.", text: "Requested, approved, shipped and received — with in-transit stock visible, so nothing disappears between two branches." },
      { label: "Counts, batch and expiry.", text: "Cycle counts and full physical counts on a tablet; batch and expiry tracking for perishables." },
      { label: "Reorder points and replenishment.", text: "Minimum and maximum levels per item per location, with suggested purchase and transfer orders." },
    ], { fontSize: 11.5, gap: 9 });

    imagePH(s, 7.2, 2.36, 5.51, 2.55, "SCREENSHOT PLACEHOLDER\nBusiness Central — item availability by location\nor purchase order list  ·  16:9");

    const tiles = [
      ["Central store", C.ink],
      ["Outlet A", C.accent],
      ["Outlet B", C.accent],
      ["Cloud kitchen", C.teal],
    ];
    s.addText("ONE STOCK LEDGER, FOUR PLACES IT LIVES", {
      x: 7.2, y: 5.06, w: 5.51, h: 0.28, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 9.5, bold: true, charSpacing: 1.4, color: C.muted, valign: "middle",
    });
    const tw = (5.51 - 0.18 * 3) / 4;
    tiles.forEach(([t, col], i) => {
      const x = 7.2 + i * (tw + 0.18);
      s.addShape(pres.ShapeType.roundRect, {
        x, y: 5.42, w: tw, h: 0.62, rectRadius: 0.06,
        fill: { color: C.card }, line: { color: C.rule, width: 0.75 },
      });
      s.addText(t, {
        x: x + 0.06, y: 5.42, w: tw - 0.12, h: 0.62, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 9.5, bold: true, color: col, align: "center", valign: "middle",
      });
      if (i < 3) {
        s.addText("↔", {
          x: x + tw - 0.06, y: 5.42, w: 0.3, h: 0.62, isTextBox: true, margin: 0,
          fontFace: F.body, fontSize: 12, color: C.faint, align: "center", valign: "middle",
        });
      }
    });
    s.addText("Transfer orders move stock between locations with approval and in-transit tracking.", {
      x: 7.2, y: 6.12, w: 5.51, h: 0.5, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 10, italic: true, color: C.muted, lineSpacingMultiple: 1.15, valign: "top",
    });
    footer(s, 12);
  }

  /* ---------------------------------------------------------- 13. FOCUS 2 */
  {
    const s = newSlide();
    kicker(s, "Focus area 2 of 3");
    heading(s, "Recipes, and consumption driven by POS", "This is the piece that turns food cost from an opinion into a measurement. Every dish sold consumes its recipe, automatically.", { w: 11.6, subW: 11.0 });

    const flow = [
      ["FaCashRegister", "1  Dish sold", "POS records 12 × Chicken Mandi at Outlet A."],
      ["FaBookOpen", "2  Recipe applied", "Each dish is mapped to a recipe with exact quantities and yield."],
      ["FaCalculator", "3  Consumption calculated", "Theoretical raw-material usage is derived — rice, chicken, spice mix."],
      ["FaArrowTrendDown", "4  Stock reduced", "Inventory at that outlet is drawn down automatically. No manual issue notes."],
      ["FaMagnifyingGlassChart", "5  Variance exposed", "Theoretical vs counted actual shows exactly where wastage or loss sits."],
    ];
    const cw = (CW - 0.36 * 4) / 5, ch = 2.42, y = 2.4;
    for (let i = 0; i < flow.length; i++) {
      const x = M + i * (cw + 0.36);
      card(s, x, y, cw, ch, { fill: i === 4 ? C.tealLt : C.white, line: i === 4 ? "CBDCD8" : C.rule, shadow: i !== 4 });
      await iconCircle(s, x + 0.26, y + 0.26, 0.54, flow[i][0], {
        bg: i === 4 ? "D2E2DE" : C.accentLt, color: i === 4 ? C.teal : C.accent,
      });
      s.addText(flow[i][1], {
        x: x + 0.26, y: y + 0.86, w: cw - 0.52, h: 0.46, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 12.5, bold: true, color: i === 4 ? C.teal : C.ink, valign: "top", lineSpacingMultiple: 0.98,
      });
      s.addText(flow[i][2], {
        x: x + 0.26, y: y + 1.36, w: cw - 0.52, h: 0.94, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 10.5, color: C.body, lineSpacingMultiple: 1.18, valign: "top",
      });
      if (i < flow.length - 1) {
        s.addText("→", {
          x: x + cw + 0.01, y: y + 0.34, w: 0.34, h: 0.4, isTextBox: true, margin: 0,
          fontFace: F.body, fontSize: 17, bold: true, color: C.faint, align: "center", valign: "middle",
        });
      }
    }

    const extras = [
      ["FaLayerGroup", "Sub-recipes", "Sauces, marinades and bases are recipes in their own right, reused across dishes and costed once."],
      ["FaTag", "Live dish costing", "When a supplier price changes, every recipe using that item is re-costed — so menu margin is always current."],
      ["FaTrashCan", "Wastage & staff meals", "Recorded as their own transactions, so they are visible and controllable rather than hidden in variance."],
    ];
    const ew = (CW - 0.36 * 2) / 3;
    for (let i = 0; i < extras.length; i++) {
      await iconCard(s, M + i * (ew + 0.36), 5.02, ew, 1.68, {
        icon: extras[i][0], title: extras[i][1], text: extras[i][2],
      });
    }
    footer(s, 13);
    s.addNotes("If they push on POS integration feasibility, move straight to the architecture slide. Confirm the POS product and whether it exposes an API or scheduled export.");
  }

  /* ---------------------------------------------------------- 14. FOCUS 3 */
  {
    const s = newSlide();
    kicker(s, "Focus area 3 of 3");
    heading(s, "Finance that closes, MIS that arrives early", "Entries post themselves from the transactions that created them. Finance moves from data entry to review and analysis.", { w: 11.6, subW: 11.0 });

    s.addText("IN THE LEDGER", {
      x: M, y: 2.34, w: 6.1, h: 0.28, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 9.5, bold: true, charSpacing: 1.4, color: C.muted, valign: "middle",
    });
    bullets(s, M, 2.7, 6.1, 3.9, [
      { label: "Automated posting.", text: "Daily sales from POS and purchase invoices post to the GL without re-keying." },
      { label: "Dimensions, not sub-ledgers.", text: "Tag every entry with Outlet, Brand and Cost centre — outlet-wise P&L becomes a filter, not a rebuild." },
      { label: "AP, AR and banking.", text: "Supplier ageing, payment runs and bank reconciliation in one place." },
      { label: "VAT and returns.", text: "Tax posting groups configured for UAE VAT, with the return prepared from the ledger." },
      { label: "Budgets vs actual.", text: "Budget by outlet and by cost line, compared automatically each period." },
      { label: "Fixed assets.", text: "Kitchen equipment and fit-out tracked with depreciation schedules." },
      { label: "Approvals and audit trail.", text: "Nothing edits silently — every posted entry traces back to its source document." },
    ], { fontSize: 11.5, gap: 8 });

    imagePH(s, 7.0, 2.34, 5.71, 2.28, "SCREENSHOT PLACEHOLDER\nPower BI management dashboard\nor Business Central role centre  ·  16:9");

    s.addText("THE MONTHLY MIS PACK", {
      x: 7.0, y: 4.72, w: 5.71, h: 0.28, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 9.5, bold: true, charSpacing: 1.4, color: C.muted, valign: "middle",
    });
    const mis = [
      "Daily sales flash by outlet",
      "Outlet-wise P&L",
      "Food cost % vs target",
      "Dish margin — top and bottom",
      "Purchase price variance",
      "Stock ageing and wastage",
      "AP ageing and cash position",
      "Budget vs actual by outlet",
    ];
    const mw = (5.71 - 0.16) / 2, mh = 0.38;
    mis.forEach((t, i) => {
      const x = 7.0 + (i % 2) * (mw + 0.16);
      const y = 5.06 + Math.floor(i / 2) * (mh + 0.08);
      s.addShape(pres.ShapeType.roundRect, {
        x, y, w: mw, h: mh, rectRadius: 0.05,
        fill: { color: C.card }, line: { type: "none" },
      });
      s.addText(t, {
        x: x + 0.16, y, w: mw - 0.28, h: mh, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 10, color: C.ink3, valign: "middle",
      });
    });
    footer(s, 14);
  }

  /* ---------------------------------------------------------- 15. ARCHITECTURE */
  {
    const s = newSlide();
    kicker(s, "How it fits together");
    heading(s, "The solution architecture", "Your POS stays where it is. Business Central becomes the system of record behind it, and Power BI becomes the window onto both.");

    const layers = [
      ["Channels", "Outlet POS terminals (dine-in & takeaway)  ·  delivery aggregators  ·  cloud-kitchen ordering  ·  catering and events", C.card, C.ink],
      ["Integration layer", "Scheduled sales import or API connector  ·  menu-item to recipe mapping  ·  aggregator settlement reconciliation  ·  error and exception log", C.accentLt, C.accentDk],
      ["Dynamics 365 Business Central", "Finance & GL  ·  Inventory & locations  ·  Purchasing  ·  Assembly / production for recipes  ·  Fixed assets  ·  VAT  ·  Approvals", C.ink, C.white],
      ["Insight", "Power BI management dashboards  ·  Business Central role centres  ·  refreshable Excel reports  ·  scheduled MIS distribution", C.tealLt, C.teal],
      ["Microsoft platform", "Azure cloud hosting  ·  Microsoft Entra ID single sign-on and MFA  ·  encryption in transit and at rest  ·  backup and Microsoft SLA", C.card, C.ink],
    ];
    const y0 = 2.3, lh = 0.78, gap = 0.11;
    layers.forEach(([name, detail, bg, fg], i) => {
      const y = y0 + i * (lh + gap);
      const isCore = i === 2;
      s.addShape(pres.ShapeType.roundRect, {
        x: M, y, w: CW, h: lh, rectRadius: 0.07,
        fill: { color: bg },
        line: isCore ? { type: "none" } : { color: bg === C.card ? C.rule : "E0D2C8", width: 0.75 },
        shadow: isCore ? shadow({ opacity: 0.16, blur: 12 }) : undefined,
      });
      s.addText(name, {
        x: M + 0.3, y, w: 3.35, h: lh, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: isCore ? 14 : 12.5, bold: true, color: fg, valign: "middle",
      });
      s.addText(detail, {
        x: M + 3.75, y, w: CW - 4.05, h: lh, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 11, color: isCore ? "E7E1D9" : C.body, valign: "middle", lineSpacingMultiple: 1.12,
      });
    });
    footer(s, 15);
    s.addNotes("Reassure them: we are not asking them to replace the POS. Integration is scoped in discovery once we confirm the POS product and its export or API options.");
  }

  /* ---------------------------------------------------------- 16. COMPLIANCE */
  {
    const s = newSlide();
    kicker(s, "Compliance");
    heading(s, "Ready for what the UAE is asking for next", "The move to structured, system-generated invoicing is not a reason to change ERP on its own — but it makes a manual desktop ledger an expensive place to be standing.");

    const items = [
      ["FaReceipt", "UAE VAT", "Tax posting groups, tax invoice formats and the VAT return prepared directly from the ledger rather than reconstructed."],
      ["FaFileInvoiceDollar", "E-invoicing readiness", "Business Central supports structured electronic invoicing and integrates with accredited service providers for the UAE's phased mandate."],
      ["FaBuildingColumns", "Corporate tax ready books", "A clean, dimension-tagged audit trail and consistent period close — the foundation any corporate tax computation needs."],
      ["FaFingerprint", "A real audit trail", "Posted entries cannot be silently edited. Every figure traces to a source document, a user and a timestamp."],
    ];
    const cw = (CW - 0.36 * 3) / 4, ch = 2.42;
    for (let i = 0; i < items.length; i++) {
      await iconCard(s, M + i * (cw + 0.36), 2.62, cw, ch, {
        icon: items[i][0], title: items[i][1], text: items[i][2], fill: C.white, shadow: true,
      });
    }

    card(s, M, 5.34, CW, 1.26, { fill: C.accentLt, line: "E8D3C6" });
    s.addText(
      [
        { text: "Worth saying plainly:  ", options: { bold: true, color: C.accentDk } },
        { text: "e-invoicing obligations in the UAE are being introduced in phases, and the applicable date depends on the entity. We will confirm Aramam's position with you in discovery — but a system that produces structured invoices natively is a far easier place to comply from than manual entry into a desktop ledger.", options: { color: C.ink3 } },
      ],
      { x: M + 0.34, y: 5.34, w: CW - 0.68, h: 1.26, isTextBox: true, margin: 0, fontFace: F.body, fontSize: 12, valign: "middle", lineSpacingMultiple: 1.2 }
    );
    footer(s, 16);
    s.addNotes("Do not quote a specific mandate date unless you have verified Aramam's revenue band and the current MoF phase schedule. Keep it as a readiness argument.");
  }

  /* ---------------------------------------------------------- 17. CLOUD KITCHEN */
  {
    const s = newSlide();
    kicker(s, "Built for what is coming");
    heading(s, "The cloud kitchen, from day one", "The hardest time to put a system in is after the new site opens. Doing it now means the cloud kitchen launches onto a platform that already works.", { w: 8.6, subW: 8.4 });

    const items = [
      ["FaMapPin", "A new site is configuration, not a project", "Add a location, assign users, inherit the item master and the approval rules. Days, not months."],
      ["FaKitchenSet", "Central production, distributed outlets", "Produce in the cloud kitchen, transfer to outlets on transfer orders, and keep one accurate stock position across both."],
      ["FaMotorcycle", "Delivery channels tracked separately", "Aggregator and direct-delivery revenue posted to their own dimensions, with commission and settlement visible."],
      ["FaCoins", "Channel-level profitability", "See what a dish actually earns on delivery versus dine-in, once commission and packaging are in the cost."],
      ["FaUserPlus", "Licensing follows users, not sites", "Opening another location does not multiply the licence cost — you add the users who need access."],
      ["FaRotate", "One process, repeated", "The SOPs, approvals and reports built in this project apply to the next site unchanged."],
    ];
    const cw = (CW - 0.36 * 2) / 3, ch = 2.0;
    for (let i = 0; i < items.length; i++) {
      const x = M + (i % 3) * (cw + 0.36);
      const y = 2.56 + Math.floor(i / 3) * (ch + 0.3);
      await iconCard(s, x, y, cw, ch, {
        icon: items[i][0], title: items[i][1], text: items[i][2],
        iconBg: C.tealLt, iconColor: C.teal,
      });
    }
    imagePH(s, 9.42, 0.62, 3.29, 1.62, "PHOTO PLACEHOLDER\ncloud kitchen / central production", { fontSize: 9.5 });
    footer(s, 17);
  }

  /* ---------------------------------------------------------- 18. DELIVERY MODEL */
  {
    const s = newSlide();
    kicker(s, "Our delivery model");
    heading(s, "Product capability + Gerab expertise = your solution", "Microsoft supplies a world-class platform. What makes it work at Aramam is the configuration, the recipes, the integration and the training around it.");

    const bands = [
      ["YOUR SOLUTION", "A working system configured to your outlets, your menu, your suppliers and your approval rules.", C.accent, C.white, 3.0],
      ["GERAB CONSULTING, CONFIGURATION & INDUSTRY EXPERTISE", "Process design, POS integration, recipe and data migration, training, and support after go-live.", C.ink, C.white, 4.6],
      ["PRODUCT CAPABILITY — MICROSOFT DYNAMICS 365 BUSINESS CENTRAL", "Finance, inventory, purchasing, production, security and reporting — maintained by Microsoft.", C.card, C.ink, 6.2],
    ];
    let y = 2.42;
    bands.forEach(([title, text, bg, fg, wBand], i) => {
      const w = [5.2, 8.4, 11.6][i];
      const x = M + (CW - w) / 2;
      s.addShape(pres.ShapeType.roundRect, {
        x, y, w, h: 1.28, rectRadius: 0.08,
        fill: { color: bg },
        line: bg === C.card ? { color: C.rule, width: 0.75 } : { type: "none" },
        shadow: bg === C.card ? undefined : shadow({ opacity: 0.14 }),
      });
      s.addText(title, {
        x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.36, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 11.5, bold: true, charSpacing: 1.1, color: fg, align: "center", valign: "middle",
      });
      s.addText(text, {
        x: x + 0.4, y: y + 0.58, w: w - 0.8, h: 0.56, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 11, color: fg === C.white ? "E7E1D9" : C.body, align: "center", valign: "top", lineSpacingMultiple: 1.15,
      });
      y += 1.44;
    });
    footer(s, 18);
  }

  /* ---------------------------------------------------------- 19. ROADMAP */
  {
    const s = newSlide();
    kicker(s, "How we deliver");
    heading(s, "An indicative implementation roadmap", "Sequenced so the highest-pain areas — stock control and the finance close — come under control first. Durations are confirmed after discovery.");

    const phases = [
      ["01", "Discovery & blueprint", "2–3 weeks", ["Process study: outlets, store, finance", "Chart of accounts & dimensions", "Item, supplier & recipe templates", "POS integration assessment"]],
      ["02", "Configure & build", "4–6 weeks", ["Company, locations & approvals", "Purchasing, transfers & inventory", "Recipes & production setup", "POS connector & Power BI"]],
      ["03", "Data migration", "2 weeks, parallel", ["Item, supplier & customer masters", "Opening balances from Tally", "Opening stock by location", "Reconciliation & sign-off"]],
      ["04", "UAT & training", "2–3 weeks", ["Scenario testing with your team", "Training: outlet, store, finance", "SOP documentation", "Go-live readiness checklist"]],
      ["05", "Go-live & hypercare", "4 weeks", ["Cutover over a weekend", "On-site support in week one", "First month-end close, supported", "Handover to the AMS desk"]],
    ];
    const cw = (CW - 0.3 * 4) / 5, y = 2.42, ch = 3.76;
    phases.forEach(([n, t, dur, list], i) => {
      const x = M + i * (cw + 0.3);
      card(s, x, y, cw, ch, { fill: C.white, shadow: true });
      s.addShape(pres.ShapeType.ellipse, {
        x: x + 0.24, y: y + 0.24, w: 0.46, h: 0.46,
        fill: { color: i < 2 ? C.accent : C.ink }, line: { type: "none" },
      });
      s.addText(n, {
        x: x + 0.24, y: y + 0.24, w: 0.46, h: 0.46, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 11.5, bold: true, color: C.white, align: "center", valign: "middle",
      });
      s.addText(t, {
        x: x + 0.24, y: y + 0.78, w: cw - 0.48, h: 0.52, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 12.5, bold: true, color: C.ink, valign: "top", lineSpacingMultiple: 0.98,
      });
      s.addText(dur, {
        x: x + 0.24, y: y + 1.3, w: cw - 0.48, h: 0.26, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 10, bold: true, charSpacing: 0.8, color: C.accent, valign: "middle",
      });
      bullets(s, x + 0.24, y + 1.64, cw - 0.48, ch - 1.82, list, { fontSize: 10, gap: 6 });
    });
    s.addText("Indicative only. The sequence and durations are confirmed in the discovery phase and agreed with you before we commit to a plan.", {
      x: M, y: 6.4, w: CW, h: 0.34, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 10, italic: true, color: C.muted, valign: "middle",
    });
    footer(s, 19);
  }

  /* ---------------------------------------------------------- 20. RESPONSIBILITIES */
  {
    const s = newSlide();
    kicker(s, "Working together");
    heading(s, "What each side brings", "Implementations fail on availability, not on software. Being explicit about this now is the cheapest insurance in the project.");

    const cols = [
      ["Gerab delivers", C.accent, C.accentLt, [
        "Solution design and system configuration",
        "POS and aggregator integration build",
        "Data migration tooling and load",
        "Recipe and costing setup with your chefs",
        "Power BI dashboards and the MIS pack",
        "Role-based training and SOP documentation",
        "Go-live cutover, hypercare and ongoing AMS",
      ]],
      ["Aramam provides", C.teal, C.tealLt, [
        "An executive sponsor who can unblock decisions",
        "A process owner each for operations, store and finance",
        "Cleaned item, supplier and recipe data in our templates",
        "Access to the POS vendor for the integration",
        "Availability of outlet and store staff for UAT and training",
        "Timely sign-off at each phase gate",
        "Agreement on the cutover weekend",
      ]],
    ];
    const cw = (CW - 0.5) / 2, ch = 4.0, y = 2.44;
    for (let i = 0; i < cols.length; i++) {
      const [title, col, bg, list] = cols[i];
      const x = M + i * (cw + 0.5);
      card(s, x, y, cw, ch, { fill: C.white, shadow: true });
      s.addShape(pres.ShapeType.roundRect, {
        x, y, w: cw, h: 0.74, rectRadius: 0.08,
        fill: { color: bg }, line: { type: "none" },
      });
      s.addText(title, {
        x: x + 0.34, y, w: cw - 0.68, h: 0.74, isTextBox: true, margin: 0,
        fontFace: F.head, fontSize: 17, bold: true, color: col, valign: "middle",
      });
      bullets(s, x + 0.34, y + 1.0, cw - 0.68, ch - 1.2, list, { fontSize: 12, gap: 10 });
    }
    footer(s, 20);
  }

  /* ---------------------------------------------------------- 21. LICENSING */
  {
    const s = newSlide();
    kicker(s, "Commercials");
    heading(s, "How Business Central is licensed", "Named users on a monthly subscription, plus a one-time implementation and an annual support agreement. No server hardware, no perpetual licence.");

    const tiers = [
      ["Essentials", "For most of the group", ["Finance and GL", "Inventory and locations", "Purchasing and approvals", "Sales and receivables", "Project and job costing", "Warehouse basics"], false],
      ["Premium", "Where production is needed", ["Everything in Essentials", "Manufacturing and production orders", "Assembly and recipe BOMs", "Service management", "Recommended for kitchen production users"], true],
      ["Team Members", "For light, read-mostly users", ["Read all data", "Approve and enter time", "Update existing records", "Suited to outlet managers who consume reports", "Lowest cost per user"], false],
    ];
    const cw = (CW - 0.4 * 2) / 3, ch = 3.1, y = 2.5;
    tiers.forEach(([name, note, list, hi], i) => {
      const x = M + i * (cw + 0.4);
      card(s, x, y, cw, ch, { fill: hi ? C.ink : C.white, line: hi ? null : C.rule, shadow: !hi });
      s.addText(name, {
        x: x + 0.32, y: y + 0.26, w: cw - 0.64, h: 0.42, isTextBox: true, margin: 0,
        fontFace: F.head, fontSize: 19, bold: true, color: hi ? C.white : C.ink, valign: "middle",
      });
      s.addText(note, {
        x: x + 0.32, y: y + 0.68, w: cw - 0.64, h: 0.3, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 10.5, italic: true, color: hi ? C.gold : C.accent, valign: "middle",
      });
      bullets(s, x + 0.32, y + 1.1, cw - 0.64, ch - 1.3, list, {
        fontSize: 11, gap: 7, color: hi ? "E7E1D9" : C.body,
      });
    });

    card(s, M, 5.82, CW, 0.86, { fill: C.card });
    s.addText(
      [
        { text: "Commercial proposal:  ", options: { bold: true, color: C.ink } },
        { text: "user counts, licence mix, implementation fee and annual support are set out in the separate commercial document. [Insert summary figure or leave for the commercial meeting.]", options: { color: C.body } },
      ],
      { x: M + 0.34, y: 5.82, w: CW - 0.68, h: 0.86, isTextBox: true, margin: 0, fontFace: F.body, fontSize: 11.5, valign: "middle", lineSpacingMultiple: 1.15 }
    );
    footer(s, 21);
    s.addNotes("Do not quote per-user pricing from memory — confirm current Microsoft UAE list pricing before the meeting, or defer to the commercial document.");
  }

  /* ---------------------------------------------------------- 22. WHY BC / WHY GERAB */
  {
    const s = newSlide();
    kicker(s, "The case for this approach");
    heading(s, "Why Business Central, and why Gerab", null);

    const cols = [
      ["Why Business Central", "PLATFORM STRENGTHS", C.accent, [
        "Microsoft's ERP for mid-sized business — proven, current, and not going anywhere",
        "Finance, stock, purchasing and production in one data model",
        "Multi-location and multi-company are standard capability",
        "Native Excel, Outlook, Teams and Power BI integration",
        "Cloud-delivered: no servers, automatic updates, Microsoft SLA",
        "Structured invoicing and a clean audit trail for UAE compliance",
        "Wide skills availability — you are not locked to one consultant",
      ]],
      ["Why Gerab System Solutions", "DELIVERY STRENGTHS", C.teal, [
        "Microsoft partner delivering Dynamics 365 and the wider Microsoft stack",
        "UAE-based consultants who understand local compliance and local operations",
        "Experience across construction, trading, manufacturing and services groups",
        "Integration capability — POS, aggregators and third-party systems",
        "One partner for licensing, implementation, BI and ongoing support",
        "Power BI and SharePoint capability to extend the platform later",
        "A support desk after go-live, not a handover email",
      ]],
    ];
    const cw = (CW - 0.5) / 2, ch = 4.74, y = 1.66;
    cols.forEach(([title, sub, col, list], i) => {
      const x = M + i * (cw + 0.5);
      card(s, x, y, cw, ch, { fill: C.white, shadow: true });
      s.addText(title, {
        x: x + 0.36, y: y + 0.3, w: cw - 0.72, h: 0.42, isTextBox: true, margin: 0,
        fontFace: F.head, fontSize: 18, bold: true, color: C.ink, valign: "middle",
      });
      s.addText(sub, {
        x: x + 0.36, y: y + 0.74, w: cw - 0.72, h: 0.28, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 9.5, bold: true, charSpacing: 1.4, color: col, valign: "middle",
      });
      bullets(s, x + 0.36, y + 1.14, cw - 0.72, ch - 1.36, list, { fontSize: 11, gap: 8 });
    });
    footer(s, 22);
  }

  /* ---------------------------------------------------------- 23. NEXT STEPS */
  {
    const s = newSlide(C.ink);
    s.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: W, h: H,
      fill: { color: "2A241F" }, line: { color: "6E6157", width: 1, dashType: "dash" },
    });
    s.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: W, h: H,
      fill: { color: C.ink, transparency: 30 }, line: { type: "none" },
    });

    s.addText("NEXT STEPS", {
      x: M, y: 1.1, w: CW, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 11, bold: true, charSpacing: 2.4, color: C.gold, valign: "middle",
    });
    s.addText("Let the detail decide it.", {
      x: M, y: 1.46, w: 9.5, h: 0.8, isTextBox: true, margin: 0,
      fontFace: F.head, fontSize: 40, bold: true, color: C.white, valign: "middle",
    });
    s.addText(
      "Before anyone signs anything, we would rather walk the floor. Two days with one outlet, the central store and the finance desk will tell us — and you — exactly what this project is.",
      {
        x: M, y: 2.36, w: 8.9, h: 0.86, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 14, color: "E7E1D9", lineSpacingMultiple: 1.25, valign: "top",
      }
    );

    const steps = [
      ["01", "Discovery walkthrough", "Half a day at one outlet and the central store, half a day with finance. No cost, no obligation."],
      ["02", "Scoped proposal", "A fixed scope, a phased plan and a commercial proposal built on what we saw — not on assumptions."],
      ["03", "Tailored demo", "Business Central shown with your menu, your outlets and your recipes — not a generic demo dataset."],
    ];
    const cw = (CW - 0.4 * 2) / 3;
    steps.forEach(([n, t, d], i) => {
      const x = M + i * (cw + 0.4);
      s.addShape(pres.ShapeType.roundRect, {
        x, y: 3.5, w: cw, h: 1.94, rectRadius: 0.08,
        fill: { color: "241F1B", transparency: 12 }, line: { color: "5A5048", width: 0.75 },
      });
      s.addText(n, {
        x: x + 0.3, y: 3.68, w: 1.2, h: 0.44, isTextBox: true, margin: 0,
        fontFace: F.head, fontSize: 20, bold: true, color: C.gold, valign: "middle",
      });
      s.addText(t, {
        x: x + 0.3, y: 4.14, w: cw - 0.6, h: 0.34, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 13.5, bold: true, color: C.white, valign: "middle",
      });
      s.addText(d, {
        x: x + 0.3, y: 4.5, w: cw - 0.6, h: 0.8, isTextBox: true, margin: 0,
        fontFace: F.body, fontSize: 10.5, color: "CFC7BC", lineSpacingMultiple: 1.18, valign: "top",
      });
    });

    s.addShape(pres.ShapeType.line, { x: M, y: 5.78, w: CW, h: 0, line: { color: "463E36", width: 0.75 } });
    s.addText(
      [
        { text: "[Your name]", options: { bold: true, color: C.white } },
        { text: "   ·   Business Development, Gerab System Solutions   ·   [email]   ·   [mobile]", options: { color: "CFC7BC" } },
      ],
      { x: M, y: 5.94, w: 8.6, h: 0.44, isTextBox: true, margin: 0, fontFace: F.body, fontSize: 12, valign: "middle" }
    );
    logoPH(s, W - M - 2.0, 5.86, 2.0, 0.66, "GERAB LOGO", true);
    s.addText("↑ Full-bleed background image placeholder — replace this rectangle's fill with a photo, then delete this note.", {
      x: W - M - 5.6, y: 6.86, w: 5.6, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F.body, fontSize: 8.5, italic: true, color: "9A8F83", align: "right", valign: "middle",
    });
    s.addNotes("Close by asking for the walkthrough, not for the decision. It is a small yes that puts you inside the operation.");
  }

  await pres.writeFile({ fileName: OUT });
  console.log("Wrote " + OUT + "  (" + slides.length + " slides)");
}

build().catch((e) => { console.error(e); process.exit(1); });
