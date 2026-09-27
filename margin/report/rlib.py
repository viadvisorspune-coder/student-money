"""Shared layout helpers for the Margin report builders (design system components as HTML)."""
import html
import math
import re


# ------------------------------------------------------------------ text

def t(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = s.replace("[VERIFY]", '<span class="vtag">Verify</span>')
    s = s.replace("[QUOTE]", '<span class="vtag">Quote</span>')
    return s


def tx(*paras, cls=""):
    return f'<div class="tx {cls}">' + "".join(f"<p>{t(p)}</p>" for p in paras) + "</div>"


def ul(items, cls=""):
    return f'<div class="tx {cls}"><ul>' + "".join(f"<li>{t(i)}</li>" for i in items) + "</ul></div>"


LBL = {}
for _k, _names in {
    "ev": ["Participant statements", "Other statements", "Participant statement", "Other participant statement", "Participant reflection", "Evidence",
           "Evidence from the research record", "Behavioural context", "Existing financial behaviour", "V1 prototype session", "V2 prototype session",
           "Six-day self-observation", "During the observation", "Before the observation: at least twice a day"],
    "fi": ["Insight", "Interpretation", "Key statement", "Key finding", "Working statement", "Critical distinction", "Key tension", "Important distinction",
           "What this showed", "Key pattern", "Interpretation: a purchase can be", "Interpretation: three problems converge", "Pattern", "Diagnosis",
           "Important distinction: behaviour change is not always", "Behaviour"],
    "im": ["Design implication", "Research implication", "Open question", "Behavioural implication", "Design opportunity", "Product opportunity",
           "Working role of the product", "Desired process"],
    "re": ["Change", "Principle", "Prompt", "Revised interaction", "Design response"]}.items():
    for _n in _names:
        LBL[_n] = _k
LBLNAME = {"ev": "Evidence", "fi": "Finding", "im": "Implication", "re": "Response", "br": "Break"}


def lbl(kind):
    return f'<span class="lbl lbl--{kind}">{LBLNAME[kind]}</span>'


def kk(s, tone=""):
    if s in LBL:
        return lbl(LBL[s])
    return f'<span class="kk {tone}">{t(s)}</span>'


def hx(s, cls=""):
    return f'<p class="hx {cls}">{t(s)}</p>'


def chips(items, tone=""):
    return '<div class="words">' + "".join(f'<span class="m-chip {tone}">{t(i)}</span>' for i in items) + "</div>"


def frost(items, tone=""):
    return '<div class="words">' + "".join(f'<span class="fr {tone}">{t(i)}</span>' for i in items) + "</div>"


def pn(inner, tone="", cls="", style=""):
    tone = " ".join(f"pn--{x}" for x in tone.split()) if tone else ""
    return f'<div class="pn {tone} {cls}" style="{style}">{inner}</div>'


def gr(*cells, cols="2", cls="", style=""):
    return f'<div class="gr gr-{cols} {cls}" style="{style}">' + "".join(cells) + "</div>"


def col(*parts, gap="4mm", style=""):
    return f'<div style="display:flex;flex-direction:column;gap:{gap};{style}">' + "".join(parts) + "</div>"


def ins(s, label="Finding", blue=False, cls="push"):
    return f'<div class="ins2 {"ins2--b" if blue else ""} {cls}">{lbl("fi")}<p>{t(s)}</p></div>'


def rq(s, cite=None, cls=""):
    c = f"<cite>{t(cite)}</cite>" if cite else ""
    return f'<div class="m-pullquote {cls}"><p class="q">{t(s)}</p>{c}</div>'


def qcards(quotes, cols=2, tone="", big=False, cite=None, cls=""):
    qcls = f"qc {'qc--' + tone if tone else ''} {'qc--big' if big else ''}"
    c = f"<cite>{t(cite)}</cite>" if cite else ""
    return f'<div class="qg {cls}" style="grid-template-columns:repeat({cols},1fr)">' + "".join(
        f'<div class="{qcls}">{t(q)}{c}</div>' for q in quotes) + "</div>"


def rh(steps, key=None, ghost=(), cols=None):
    """Horizontal route. steps: (title, detail) or title."""
    n = len(steps)
    out = []
    for s in steps:
        title, detail = s if isinstance(s, tuple) else (s, "")
        cls = "key" if title == key else ("ghost" if title in ghost else "")
        d = f"<small>{t(detail)}</small>" if detail else ""
        out.append(f'<div class="{cls}"><b>{t(title)}</b>{d}</div>')
    return f'<div class="rh2" style="grid-template-columns:{cols or f"repeat({n},1fr)"}">' + "".join(out) + "</div>"


def rv(steps):
    """Vertical route. steps: title | (title, detail) | (title, detail, chips, cls)."""
    out = []
    for s in steps:
        if isinstance(s, str):
            s = (s,)
        title = s[0]
        detail = s[1] if len(s) > 1 else ""
        words = s[2] if len(s) > 2 else None
        cls = s[3] if len(s) > 3 else ""
        d = f"<small>{t(detail)}</small>" if detail else ""
        w = chips(words) if words else ""
        out.append(f'<li class="{cls}"><b>{t(title)}</b>{d}{w}</li>')
    return '<ul class="rv">' + "".join(out) + "</ul>"


def eq(items):
    """items: ('op', '+') or (label, value, 'res'?)"""
    out = []
    for it in items:
        if it[0] == "op":
            out.append(f'<span class="op">{t(it[1])}</span>')
        else:
            res = " res" if len(it) > 2 else ""
            lab = f"<small>{t(it[0])}</small>" if it[0] else ""
            out.append(f'<div class="it{res}">{lab}<b>{t(it[1])}</b></div>')
    return '<div class="eq2">' + "".join(out) + "</div>"


def vs(a, b, cls=""):
    return f'<div class="vs2 {cls}">{a}<span class="v">vs</span>{b}</div>'


def chk(items, open_=False, cols=1):
    return f'<ul class="chk {"chk--open" if open_ else ""}" style="grid-template-columns:repeat({cols},1fr)">' + "".join(f"<li>{t(i)}</li>" for i in items) + "</ul>"


MARK = {"●": '<i class="mk mk--full"></i>', "○": '<i class="mk"></i>', "—": '<i class="mk mk--none"></i>'}


def cell(c):
    return MARK.get(c, t(c)) if isinstance(c, str) else c


def tgrow(tbl):
    return f'<div class="tgrow">{tbl}</div>'


def table(head, rows, cls="", widths=None, raw=False):
    ths = "".join(f'<th{f" style=width:{widths[i]}" if widths and widths[i] else ""}>{t(h)}</th>' for i, h in enumerate(head))
    trs = "".join("<tr>" + "".join(f"<td>{c if raw and isinstance(c, str) and c.startswith('<') else cell(c)}</td>" for c in r) + "</tr>" for r in rows)
    return f'<table class="m-table {cls}"><thead><tr>{ths}</tr></thead><tbody>{trs}</tbody></table>'


def codes(s):
    """'P03, P04' to code circles."""
    return "".join(f'<span class="cd-s">{c.strip()}</span>' for c in s.split(","))


def phone(src, cap, w="100%"):
    return f'<div style="width:{w}"><div class="ph"><img src="shots/{src}" alt=""></div><p class="ph-cap">{t(cap)}</p></div>'


# ------------------------------------------------------------------ data from the master copy

PATTERNS = ["Social context", "Future commitments", "Calculation effort", "Value judgement", "Accumulation", "Automation", "Agency"]
M = {"P01": "●○○●○—●", "P02": "○○○●——●", "P03": "○●○○——●", "P04": "●●—○——●", "P05": "●●●○—●●",
     "P06": "—○—●——●", "P07": "○●●○○●●", "P08": "○●○○●●●", "P09": "————●—○", "P10": "●●●○○●●"}
STAGE = {"P01": "Baseline", "P02": "Baseline", "P03": "Baseline", "P04": "Baseline", "P05": "Baseline", "P06": "Baseline",
         "P07": "V1 prototype", "P08": "Prototype", "P09": "Six-day observation", "P10": "V2 prototype"}
BEHAV = {"P01": "Socially influenced spending", "P02": "Post-purchase value evaluation", "P03": "Mental allocation",
         "P04": "Future commitment not active", "P05": "Calculation effort", "P06": "Value-led purchase",
         "P07": "Prototype decision support", "P08": "Existing payment tracking", "P09": "Repeated small spending", "P10": "Decision moment unclear"}


def profile(code):
    cells = "".join(f"<div>{MARK[m]}<span>{t(p)}</span></div>" for m, p in zip(M[code], PATTERNS))
    return f'<div class="prof-q"><span class="kk" style="color:var(--m-blue);opacity:0.6">Pattern profile, page 43</span><div class="prof">{cells}</div></div>'


def pid(code, title, small=False):
    if small:
        return f'<div class="pid pid--s"><span class="cd">{code}</span><h1 class="h1 m-display-xl">{t(title)}</h1></div>'
    meta = f'<span class="tagc tagc--blue">{t(STAGE[code])}</span>'
    return (f'<div class="pid"><span class="cd">{code}</span><div><span class="eyebrow m-kicker" style="margin:0 0 1.4mm">04 / Participant evidence</span>'
            f'<h1 class="h1 m-display-xl">{t(title)}</h1><div class="meta">{meta}</div></div></div>')


# ------------------------------------------------------------------ svg charts (1 unit = 1 mm)

def svg(w, h, body, style=""):
    return f'<svg viewBox="0 0 {w} {h}" style="width:{w}mm;height:{h}mm;display:block;overflow:visible;{style}">{body}</svg>'


def stext(x, y, s, size=3, weight=600, fill="#2E36A1", anchor="start", fam="'Nunito Sans'"):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="font:{weight} {size}px {fam};fill:{fill}">{t(s)}</text>'


def waterfall(rows, w=100, h=70):
    """rows: (label, value, kind) kind in start, minus, end."""
    mx = max(abs(v) for _, v, _ in rows)
    base = h - 12
    sc = (base - 8) / mx
    bw = (w - 6) / len(rows) - 5
    out, level = [], 0
    for i, (lab, v, kind) in enumerate(rows):
        x = 3 + i * (bw + 5)
        if kind == "start" or kind == "end":
            top, hh, col = base - v * sc, v * sc, "#2E36A1"
            level = v
        else:
            top, hh, col = base - level * sc, -v * sc, "#F33F31"
            level += v
        out.append(f'<rect x="{x}" y="{top}" width="{bw}" height="{hh}" rx="1.4" fill="{col}"/>')
        val = ("− " if v < 0 else "") + f"₹{abs(v):,}"
        out.append(stext(x + bw / 2, top - 2, val, 4.76, 400, "#2E36A1", "middle", "'Cal Sans'"))
        for k, line in enumerate(lab.split(" ", 1)):
            out.append(stext(x + bw / 2, base + 5 + k * 3.8, line, 3, 600, "#F33F31", "middle"))
        if i < len(rows) - 1:
            ny = base - level * sc
            out.append(f'<line x1="{x + bw}" y1="{ny}" x2="{x + bw + 5}" y2="{ny}" stroke="#C3C7D1" stroke-width="0.3" stroke-dasharray="1 1"/>')
    out.append(f'<line x1="0" y1="{base}" x2="{w}" y2="{base}" stroke="#2E36A1" stroke-width="0.3"/>')
    return svg(w, h, "".join(out))


def stackbar(total, parts, w=170):
    """parts: (label, value, colour)"""
    out, x = [], 0
    for lab, v, c in parts:
        ww = w * v / total
        out.append(f'<rect x="{x}" y="10" width="{ww - 1}" height="16" rx="2" fill="{c}"/>')
        out.append(stext(x + 3, 20.6, f"₹{v:,}", 4.76, 400, "#FFFFFF" if c != "#FFDD50" else "#302D40", "start", "'Cal Sans'"))
        out.append(stext(x, 32, lab, 3, 600, "#F33F31"))
        x += ww
    out.append(f'<path d="M0 6 V3 H{w - 1} V6" fill="none" stroke="#2E36A1" stroke-width="0.3"/>')
    out.append(stext(0, 1.6, f"Current account ₹{total:,}", 3, 600, "#2E36A1"))
    return svg(w, 36, "".join(out))


def area_pair(a, b, la, lb, w=170, h=66):
    rb = 30
    ra = rb * math.sqrt(a / b)
    cx_b = w - rb - 2
    out = [f'<circle cx="{cx_b}" cy="{h / 2}" r="{rb}" fill="#2E36A1"/>',
           stext(cx_b, h / 2 + 1.5, f"₹{b:,}", 4.76 * 16.5 / 13.5, 400, "#FFFFFF", "middle", "'Cal Sans'"),
           stext(cx_b, h / 2 + 7, lb, 3, 600, "#FFDD50", "middle"),
           f'<circle cx="20" cy="{h / 2}" r="{ra}" fill="#F33F31"/>',
           stext(20, h / 2 - ra - 3, f"₹{a:,}", 4.76, 400, "#2E36A1", "middle", "'Cal Sans'"),
           stext(20, h / 2 + ra + 5, la, 3, 600, "#F33F31", "middle"),
           f'<line x1="{26}" y1="{h / 2}" x2="{cx_b - rb - 4}" y2="{h / 2}" stroke="#F33F31" stroke-width="0.6" stroke-dasharray="0 2.6" stroke-linecap="round"/>']
    return svg(w, h, "".join(out))


def loop(labels, r=30, w=86, h=80, key=None):
    cx, cy = w / 2, h / 2
    out = [f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#F33F31" stroke-width="1"/>']
    n = len(labels)
    for i, lab in enumerate(labels):
        a = -math.pi / 2 + i * 2 * math.pi / n
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        fill = "#FFDD50" if lab == key else "#FFFFFF"
        out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="3.2" fill="{fill}" stroke="#F33F31" stroke-width="0.8"/>')
        # arrowhead midway to next
        a2 = a + math.pi / n
        mx, my = cx + r * math.cos(a2), cy + r * math.sin(a2)
        ang = math.degrees(a2) + 90
        out.append(f'<path d="M-1.6 -1.8 L1.2 0 L-1.6 1.8" transform="translate({mx:.2f},{my:.2f}) rotate({ang:.1f})" fill="none" stroke="#F33F31" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>')
        lx, ly = cx + (r + 8) * math.cos(a), cy + (r + 8) * math.sin(a)
        anchor = "middle" if abs(math.cos(a)) < 0.3 else ("start" if math.cos(a) > 0 else "end")
        lines = lab.split("\n")
        for k, line in enumerate(lines):
            out.append(stext(lx, ly + 1.6 + (k - (len(lines) - 1) / 2) * 5, line, 4.76, 400, "#2E36A1", anchor, "'Cal Sans'"))
    return svg(w, h, "".join(out))


def venn3(labels, center, w=100, h=86):
    r = 26
    pts = [(38, 30), (62, 30), (50, 51)]
    fills = ["#2E36A1", "#45A2FB", "#FFDD50"]
    out = []
    for (x, y), f in zip(pts, fills):
        out.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{f}" fill-opacity="0.72" style="mix-blend-mode:multiply"/>')
    out += [stext(22, 22, labels[0], 4.76, 400, "#FFFFFF", "middle", "'Cal Sans'"),
            stext(78, 22, labels[1], 4.76, 400, "#302D40", "middle", "'Cal Sans'"),
            stext(50, 70, labels[2], 4.76, 400, "#302D40", "middle", "'Cal Sans'"),
            f'<circle cx="50" cy="38" r="3" fill="#F33F31"/>',
            stext(50, 45, center, 3, 600, "#FFFFFF", "middle")]
    return svg(w, h, "".join(out))


# ------------------------------------------------------------------ working data (client revision)
YN = {"Yes": '<span class="yn yn--y">Yes</span>', "No": '<span class="yn yn--n">No</span>', "Conditional": '<span class="yn">Conditional</span>'}


def yn_table(rows, head=("Field", "Working value")):
    return table(list(head), [[t(a), YN.get(b, t(b))] for a, b in rows], "dense", [None, "30mm"], raw=True)


def units(have, allp=None):
    allp = allp or [f"P{i:02d}" for i in range(1, 11)]
    return "".join(f'<span class="cd-s {"" if p in have else "cd-o"}">{p[1:]}</span>' for p in allp)


def work(s="Working inference"):
    return f'<span class="wtag">{t(s)}</span>'


# ------------------------------------------------------------------ pages

PAGES = []


def page(sec, *parts):
    PAGES.append(f'<section class="pg" data-sec="{sec}"><div class="ct v2">' + "".join(parts) + "</div></section>")


def head(title, eyebrow=None, deck=None):
    e = f'<span class="eyebrow m-kicker" style="margin:0">{t(eyebrow)}</span>' if eyebrow else ""
    d = f'<p class="deck">{t(deck)}</p>' if deck else ""
    return f'<div class="hd">{e}<h1 class="h1 m-display-xl">{t(title)}</h1>{d}</div>'


def band(eyebrow, title, deck=None, extra=""):
    d = f'<p class="deck">{t(deck)}</p>' if deck else ""
    return (f'<div class="band"><span class="fr" style="align-self:flex-start">{t(eyebrow)}</span>'
            f'<h1 class="h1 m-display-xl" style="max-width:150mm">{t(title)}</h1>{d}{extra}</div>')


