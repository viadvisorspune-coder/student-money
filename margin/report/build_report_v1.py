"""Builds report.html from the client's master copy (P01 to P11).

Words are the client's, carried over as written. Layout, colour and type come
from the Margin design system (../css) and report.css. Charts are drawn only
from figures that appear in the master copy. Run:
    python3 margin/report/build_report.py
"""
import html
import math
import re
from pathlib import Path

OUT = Path(__file__).with_name("report.html")

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


S1, S2, S3, S4 = "01  From research to testing", "02  Testing framework", "03  Baseline behaviour", "04  Participant evidence"
S5, S6, S7, S8, S9 = "05  Cross-participant analysis", "06  Prototype breaks", "07  Iteration", "08  Synthesis", "09  Next test"
SA = "Appendix"

# ============ 03
page(S1,
     band("01 / From research to testing", "The project started with a tracking problem. The research found a decision problem underneath it.",
          "The original problem space was student spending."),
     gr(tx("The first instinct was to help students understand where their money goes, track expenses, identify patterns and manage their available money.",
           "The behavioural research showed that students were already using many forms of financial reasoning.",
           "The problem was not simply that financial information was missing. The problem was that the information did not always become part of the decision."),
        pn(kk("Students were already using") + chips(["Mental budgets", "Rough balances", "Future plans", "Spending limits", "Social expectations", "Perceived value", "Convenience", "Post-purchase reflection"], "m-chip--sky"), "", "", ""),
        cols="2"),
     gr(pn(kk("Could know") + hx("That a future expense was coming") + '<p class="tx" style="margin:2mm 0 0">and still spend differently today.</p>'),
        pn(kk("Could know") + hx("Their balance") + '<p class="tx" style="margin:2mm 0 0">and still not calculate the consequence of a purchase.</p>'),
        pn(kk("Could notice") + hx("They were spending frequently") + '<p class="tx" style="margin:2mm 0 0">and still decide that the experience was worth it.</p>'),
        cols="3", cls="gr-s grow"),
     '<p class="hx hx--xl">This shifted the problem from <span style="color:var(--m-route)">tracking</span> to <span style="color:var(--m-route)">consideration</span>.</p>',
     '<div class="push">' + kk("Working shift") + vs(pn(kk("Before") + hx("How do we help students track their money?"), "l"),
                                                   pn(kk("After", "kk--w") + hx("How do we make relevant financial information part of the spending decision?", "hx--w"), "b")) + "</div>")

# ============ 04
conditions = [("Social context", "Whether a purchase happened at all"), ("Future commitments", "Whether current spending felt affordable"),
              ("Convenience", "Whether a cheaper alternative was considered"), ("Time pressure", "Whether financial calculation happened"),
              ("Perceived value", "Whether an expensive purchase felt justified"), ("Mental budgeting", "How money was allocated across time"),
              ("Emotional state", "How much consideration happened before spending"), ("Accumulation", "Whether repeated small purchases became salient"),
              ("Responsibility", "Whether money was reserved for future or unexpected needs")]
page(S1,
     head("What earlier research revealed", "01 / From research to testing", "Student spending was shaped by multiple interacting conditions."),
     gr(col(table(["Behavioural condition", "What it affected"], conditions, "dense", ["44mm", None]),
            pn('<p class="hx" style="color:var(--m-ink)">The research therefore suggested that spending decisions were not purely financial decisions.</p>', "y")),
        pn(kk("Core behavioural model", "kk--w") + rv(["Immediate trigger", "Personal value", "Financial reality", ("Mental trade-off", "", None, "key"), "Decision", ("Reflection", "", None, "end")]), "b", "", "padding:6mm"),
        cols="73", cls="fill"))

# ============ 05
present = ["Friends", "Hunger", "Bad food", "Time", "Convenience", "Comfort", "Novelty", "Experience", "Social participation"]
background = ["Future dinner", "Monthly total", "Recent spending", "Planned budget", "Upcoming commitment"]
bg_pos = [(50, 3), (88, 22), (86, 76), (14, 76), (10, 22)]
target = ('<div style="position:relative;width:118mm;height:118mm;margin:0 auto">'
          '<div style="position:absolute;inset:0;border-radius:50%;background:var(--m-paper-deep)"></div>'
          '<div style="position:absolute;inset:6mm;border-radius:50%;border:0.3mm dashed var(--m-stone)"></div>'
          '<div style="position:absolute;left:24mm;top:24mm;width:70mm;height:70mm;border-radius:50%;background:var(--m-blue);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2mm;padding:9mm;box-sizing:border-box;text-align:center">'
          + kk("Immediately present", "kk--w") + frost(present).replace('class="words"', 'class="words" style="justify-content:center"') + "</div>"
          + "".join(f'<span class="m-chip" style="position:absolute;left:{x}%;top:{y}%;transform:translate(-50%,0);background:var(--m-paper);color:var(--m-blue);opacity:0.7">{t(b)}</span>' for b, (x, y) in zip(background, bg_pos))
          + "</div>")
page(S1,
     head("Information can exist without becoming part of the decision.", "01 / The behavioural gap"),
     gr(col(pn(kk("A student may already know") + chk(["how much money they have;", "how much they have spent;", "what they are planning to spend later;", "what they usually spend;", "what they can roughly afford."])),
            tx("But the active spending situation can be dominated by other information."),
            '<div style="display:flex;gap:3mm;align-items:center"><span style="width:10mm;height:10mm;border-radius:50%;background:var(--m-blue);flex:none"></span><span class="tx">What is immediately present</span></div>'
            '<div style="display:flex;gap:3mm;align-items:center"><span style="width:10mm;height:10mm;border-radius:50%;background:var(--m-paper-deep);flex:none"></span><span class="tx">What may remain in the background</span></div>'),
        target, cols="37"),
     ins("Bring personally relevant financial context into the room at the moment when the decision is still open.", "Design opportunity"))

# ============ 06
page(S1,
     head("From tracking to financial consciousness", "01 / From research to testing"),
     vs(pn(kk("The initial product question") + '<p class="q" style="margin:0">How do we help students understand their spending?</p>', "l"),
        pn(kk("The question after behavioural research", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">How do we help students become financially conscious of each spending decision?</p>', "b")),
     gr(col(kk("Working definition"),
            pn('<span class="num">Financial awareness</span>' + tx("Knowing what is happening to your money."), "", "", "flex:1;display:flex;flex-direction:column;justify-content:center"),
            pn('<span class="num">Financial consciousness</span>' + tx("Recognising how that information relates to the decision you are making."), "y", "", "flex:1;display:flex;flex-direction:column;justify-content:center"),
            pn(hx("The product does not need to make the decision for the user."), "l", "", "flex:1;display:flex;flex-direction:column;justify-content:center"),
            pn(hx("The product needs to make the consequence easier to see and consider.", "hx--w"), "b", "", "flex:1;display:flex;flex-direction:column;justify-content:center"), gap="4mm"),
        pn(kk("Working sequence") + rv(["See", "Understand", ("Consider", "", None, "key"), "Decide", ("Reflect", "", None, "end")]), "", "cfill", "padding:6mm"),
        cols="2", cls="grow"))

# ============ 07
secq = [("Timing", "When is financial information most relevant?"), ("Relevance", "Is the consequence of a proposed expense more useful than historical spending information?"),
        ("Cognitive effort", "How much work does the user have to do to understand their financial position?"), ("Context", "What happens when social or emotional context is stronger than financial context?"),
        ("Agency", "Do users want information, prompts and flags rather than enforced restriction?"), ("Persistence", "Does awareness carry into later decisions?")]
page(S2,
     band("02 / Testing framework", "What exactly were we testing?", None,
          '<div class="m-pullquote" style="margin-top:3mm"><p class="q">Can making financial consequences visible at the moment of spending make spending decisions more conscious?</p><cite>Research question</cite></div>'),
     kk("Secondary questions"),
     gr(*[pn(f'<span class="num">{i + 1:02d}</span>' + kk(a) + hx(b), "y" if i == 0 else "") for i, (a, b) in enumerate(secq)], cols="2", cls="fill gr-s"))

# ============ 08
page(S2,
     head("The target behaviour", "02 / Testing framework"),
     pn(kk("Target action", "kk--k") + '<p class="q" style="margin:0;color:var(--m-ink)">Before or during a discretionary spending decision, the participant notices relevant financial context, understands the likely consequence of the proposed expense, and uses that information as one input into the decision.</p>', "y", "", "padding:6mm 7mm"),
     gr(pn(kk("What counts as the behaviour") + rv([("Notice", "Looks at the financial information"), ("Understand", "Can explain what it means"), ("Connect", "Relates it to the proposed expense"),
                                                   ("Consider", "Mentions a consequence or trade-off", None, "key"), ("Decide", "Makes, maintains, modifies or delays the decision", None, "end")]), "", "cfill", "padding:6mm"),
        col(kk("Possible outcomes"), *[pn(hx(o), "l", "pn--s", "flex:1;display:flex;align-items:center") for o in ["Buy", "Buy less", "Delay", "Substitute", "Do not buy"]],
            pn(kk("Also a conscious outcome", "kk--w") + hx("Buy anyway, with awareness of the consequence", "hx--w"), "b", "", "flex:1.4;display:flex;flex-direction:column;justify-content:center"), gap="3mm"),
        cols="2", cls="grow"))

# ============ 09
page(S2,
     head("Success criteria", "02 / Testing framework"),
     gr(pn(kk("The success criterion was not defined as") + '<p class="hx hx--xl"><span class="m-strike">“Spend less”</span></p>', "l"),
        pn(kk("The desired behaviour was", "kk--k") + hx("Financial information enters the participant's reasoning before the decision closes.", "hx--k"), "y"), cols="37"),
     pn(kk("Evidence of consideration: a participant") + chk(["notices the financial information;", "understands the information;", "connects the information to the current expense;",
                                                               "mentions a consequence;", "compares the expense with another commitment;", "modifies or confirms the decision knowingly."], cols=2), "", "grow"),
     gr(col(kk("Important distinction"), tx("A participant who sees the consequence and still purchases has not necessarily failed the intervention.", "This still demonstrates that the consequence entered the decision.")),
        qcards(["I know this leaves me with less, but I still want to go."], 1, "r", True, "Example"), cols="37", cls="push"))

# ============ 10
risks = [("Showing financial impact will create consideration", "If information is seen but ignored, the intervention fails"),
         ("Users can understand the information quickly", "A decision may close before the calculation is complete"),
         ("Contextual information is more useful than generic totals", "If historical dashboards are enough, the new interaction adds little"),
         ("The intervention can influence reasoning without controlling the user", "Enforcement would change the role of the product"),
         ("The effect can carry into later decisions", "One successful interaction is not behaviour change"),
         ("Users will engage at the spending moment", "A useful feature that requires opening another app may not be used")]
page(S2,
     head("The riskiest assumptions", "02 / Testing framework"),
     gr(*[pn(f'<span class="num">{i + 1:02d}</span>' + hx(a) + f'<p class="tx" style="margin:2mm 0 0">{t(b)}</p>', "l" if i != 5 else "b") for i, (a, b) in enumerate(risks)], cols="2", cls="gr-s grow"),
     pn(kk("Primary risk", "kk--w") + '<p class="hx hx--xl hx--w">The information may be useful in theory but unavailable at the exact moment when the decision happens.</p>', "r", "push", "padding:7mm 6mm"))


PSET = [('P01', 'Behavioural observation', 'Social context, spontaneous spending', 'Direct contextual evidence'), ('P02', 'Behavioural observation', 'Value, post-purchase evaluation', 'Direct contextual evidence'), ('P03', 'Behavioural observation', 'Future allocation, buffer', 'Direct contextual evidence'), ('P04', 'Behavioural observation', 'Future commitment not salient at decision', 'Direct contextual evidence'), ('P05', 'Behavioural observation', 'Calculation effort, timing', 'Direct contextual evidence'), ('P06', 'Behavioural observation', 'Utility, novelty, perceived value', 'Direct contextual evidence'), ('P07', 'Prototype session', 'Consequence, potential spending, agency', 'Direct prototype evidence'), ('P08', 'Prototype session', 'Existing payment tracking, future planning', 'Direct prototype evidence'), ('P09', '6-day self-observation', 'Repeated small-spend awareness', 'Direct baseline evidence'), ('P10', 'V2 prototype session', 'Decision moment, friction, automation', 'Direct V2 evidence'), ('P11', 'Behavioural pattern inferred from available material', 'Low spontaneous engagement', 'Working inference only')]
STATUS_TONE = {'Direct contextual evidence': 'tagc', 'Direct prototype evidence': 'tagc tagc--blue', 'Direct baseline evidence': 'tagc tagc--yellow', 'Direct V2 evidence': 'tagc tagc--blue', 'Working inference only': 'wtag'}
page(S2,
     head("Participant set", "02 / Testing framework", "Eleven coded records across behavioural observation and prototype testing."),
     tgrow(table(["ID", "Primary evidence available", "Main behavioural signal", "Evidence status"],
                 [[f'<span class="cd-s{" cd-o" if c == "P11" else ""}">{c[1:]}</span>', t(a), t(b), f'<span class="{STATUS_TONE[d]}">{t(d)}</span>'] for c, a, b, d in PSET],
                 "dense", ["12mm", "46mm", None, "46mm"], raw=True)),
     pn(lbl("fi") + tx("The records do not all represent identical testing conditions; analysis therefore distinguishes contextual behavioural evidence from direct prototype evidence.",
                       "P11 remains a working inferred record and is not used for any quantitative claim unless its underlying session evidence is recovered."), "l"))

page(S2,
     head("Sessions and task", "02 / Testing framework"),
     gr(pn(kk("Overall testing period") + '<p class="hx hx--xl">September 2026</p>'),
        pn(kk("Baseline observation") + '<p class="hx hx--xl">6 days</p>'),
        pn(kk("P07, V1 session") + '<p class="hx hx--xl">~26 min</p>'),
        pn(kk("P10, V2 session") + '<p class="hx hx--xl">~10 min</p>'), cols="4", cls="gr-s"),
     pn(kk("Other participant sessions") + '<div style="display:flex;align-items:baseline;gap:4mm"><p class="hx hx--xl">15 to 20 min</p>' + work("Working estimate, not measured") + "</div>"
        + tx("The documented session durations vary by session. For the remaining sessions, the current archive does not preserve reliable duration measurements; the range is a working estimate based on the intended test structure rather than measured data.")),
     '<div>' + kk("Task, working reconstruction") + qcards(["Imagine that you are about to make a discretionary purchase. You already have some spending behind you and at least one future expense coming up. Work through the situation as you normally would and decide whether you would still make the purchase."], 1, "", True, "Task") + "</div>",
     gr(qcards(["You are deciding whether to spend on a social activity while already knowing that another expense is coming up later in the week. Use the prototype as you would if this were your own decision."], 1, "", False, "V1 scenario"),
        qcards(["You are about to spend money on an activity with a friend. You have a limited amount of money available and another expense coming up. Use the prototype to understand what the proposed purchase would leave you with, then decide whether you would still spend it."], 1, "", False, "V2 scenario"), cols="2"),
     f'<p class="small" style="margin:0">{work("Reconstructed")}&nbsp; These are reconstructed working task formulations, not verbatim records of the original facilitator script.</p>')

page(S2,
     head("Success criterion, working version", "02 / Testing framework", "The original pre-test numeric success criterion is not preserved. This is a retrospective analytical framework."),
     gr(pn(kk("A participant demonstrates the target behaviour when they can") + rv(["Identify their current financial position", "Identify the relevant future commitment",
                                                                                  ("Understand the consequence of the proposed expense", "", None, "key"), "Connect that consequence to the current decision",
                                                                                  ("Make or maintain the decision without the researcher deciding for them", "", None, "end")]), "", "cfill", "padding:6mm"),
        col(kk("Working threshold: 4 of 5 components"),
            pn('<p class="hx hx--xl">0 to 2 / 5</p><p class="tx" style="margin:1mm 0 0">Unsuccessful</p>', "", "", "flex:1"),
            pn('<p class="hx hx--xl">3 / 5</p><p class="tx" style="margin:1mm 0 0">Partial</p>', "", "", "flex:1"),
            pn('<p class="hx hx--xl hx--w">4 to 5 / 5</p><p class="tx" style="margin:1mm 0 0">Successful</p>', "b", "", "flex:1"), gap="3mm"), cols="2"),
     pn(f'{work("Retrospective")}' + '<p class="hx" style="margin-top:3mm">This scoring system is a retrospective analytical framework, not a recorded pre-test success criterion. It is not presented as though it was set before testing.</p>', "d"))

# ============ 11
page(S3,
     band("03 / Baseline behaviour", "Six days before the prototype", "Participants observed and reflected on their own spending for six days."),
     tx("The purpose was to understand what happened when spending became more visible without relying entirely on the interface to produce awareness."),
     gr(pn(kk("The baseline looked at") + '<ol class="tx" style="margin:0;padding-left:5mm">' + "".join(f"<li style='margin-bottom:1.6mm'>{t(x)}</li>" for x in
            ["What happened?", "What was spent?", "Why was it spent?", "What did the participant intend beforehand?", "Was there a future commitment?", "What did the participant notice afterwards?", "Did anything change?"]) + "</ol>"),
        pn(kk("Method sequence", "kk--w") + rv(["Spend", "Record", "Reflect", ("Notice patterns", "", None, "key"), ("Next decision", "", None, "end")]), "b"), cols="2"))

# ============ 12
DOT = '<span style="width:6mm;height:6mm;border-radius:50%;background:var(--m-route)"></span>'
dots = "".join(f'<div style="text-align:center"><div style="display:flex;gap:1.6mm;justify-content:center">{DOT}{DOT}</div><span class="kk" style="margin:2mm 0 0">Day {d}</span></div>' for d in range(1, 7))
page(S3,
     head("Small spending became larger when seen together", "03 / Baseline behaviour", "One six-day observation showed a change in attention toward small, repeated purchases."),
     gr(col(tx("The participant had previously purchased snacks from vending machines or nearby stores at least twice a day and regularly used autos."),
            yn_table([("Snack purchases reduced", "Yes"), ("Some spontaneous purchases avoided", "Yes"), ("Some autos avoided", "Yes"), ("Accumulation more noticeable", "Yes"),
                      ("Financial awareness increased", "Yes"), ("Long-term persistence measured", "No"), ("Prototype causal effect measured", "No")], ("During the observation", "Evidence"))),
        col(qcards(["Oh shit, I will be spending more money."], 1, "r", True, "Participant reflection"),
            pn(kk("Before the observation: at least twice a day") + f'<div class="gr gr-6 gr-s">{dots}</div>')),
        cols="2", cls="grow"),
     '<div>' + kk("The meaningful information was not necessarily the amount of one purchase. It was") + eq([("", "Frequency"), ("op", "×"), ("", "Repetition"), ("op", "×"), ("", "Accumulation", "res")]) + "</div>",
     ins("A small transaction can become psychologically significant when the pattern becomes visible.", cls=""))

# ============ 13
page(S3,
     head("What the baseline changed about the test", "03 / Baseline behaviour", "The six-day observation suggested that awareness can come from simple visibility."),
     gr(pn(kk("It did not require") + '<div class="words">' + "".join(f'<span class="m-chip"><span class="m-strike">{t(x)}</span></span>' for x in ["A warning", "A restriction", "A score", "A budget"]) + "</div>"
           + '<p class="tx" style="margin:4mm 0 0">The participant noticed something that was already happening.</p>'),
        vs(qcards(["I know I buy snacks."], 1, "l", False, "Before"), qcards(["I can see how often I am buying snacks."], 1, "b", False, "After observation")), cols="37"),
     '<div class="grow">' + kk("The important distinction is") + vs(pn('<p class="hx hx--xl">Knowledge</p>' + tx("Knowing something happens."), "l", "", "padding:7mm 6mm"),
                                                       pn('<p class="hx hx--xl hx--w">Salience</p>' + '<div class="tx" style="color:var(--m-paper)"><p>Seeing it while it matters.</p></div>', "r", "", "padding:7mm 6mm")) + "</div>",
     pn(kk("Working question", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">Can a product create the same kind of salience at a spending moment without making the user manually calculate everything?</p>', "b", "push", "padding:7mm 6mm"))

# ============ 14
page(S3,
     head("A spending event is not just a transaction", "03 / Baseline behaviour", "A transaction records an amount. A decision contains much more."),
     gr(pn(kk("Decision episode") + rv([("Context", "Where? With whom? What is happening?"),
                                         ("Immediate trigger", "", ["Hungry", "Friend suggested it", "Need something", "Want something", "Running late"]),
                                         ("Personal value", "", ["Useful", "Fun", "Worth it", "Convenient", "Comfortable"]),
                                         ("Financial reality", "", ["Current money", "Past spending", "Future commitment"]),
                                         ("Trade-off", "What changes if I spend this?", None, "key"), "Decision", ("Reflection", "", None, "end")]), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep)"),
        col(pn('<span class="kk" style="color:var(--m-paper);opacity:0.8">A transaction records</span><p class="hx hx--xl hx--w">₹ amount</p><p class="small" style="margin:1mm 0 0;color:var(--m-paper);opacity:0.8">time, merchant</p>', "r"),
            pn(kk("Research question inside the decision episode", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">What financial information was actually active when the decision happened?</p>', "b", "", "flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:7mm 6mm"),
            gap="5mm"), cols="73", cls="fill"))

# ============ 15 P01
page(S4,
     pid("P01", BEHAV["P01"]),
     gr(col(kk("Behavioural context"), tx("P01's spending decisions were strongly influenced by the immediate social environment.",
                                         "A purchase could happen because the participant was already with friends or because the group was moving toward a shared activity.")),
        profile("P01"), cols="2"),
     qcards(["though I didn't want", "I wasn't, like, thinking about getting it in the first place, but, like, I got.", "I don't care. Like, it's good only."], 3, "", False, "P01"),
     pn(kk("What this showed") + rh([("No intention", "The participant did not necessarily begin with an intention to purchase."),
                                      ("Social situation", "The social situation created the spending opportunity."),
                                      ("Perceived positively", "Once the experience was perceived positively, the amount spent became less important afterwards.")]), "", "grow", "padding:6mm 4mm"),
     '<div>' + kk("Key tension") + vs(pn(hx("Financial calculation"), "l"), pn(hx("Social participation", "hx--w"), "b")) + "</div>",
     gr(pn(kk("Interpretation") + tx("A spending intervention may have to compete with a decision that has already been socially established."), "l"),
        pn(kk("Design implication", "kk--k") + tx("The product should surface financial context without treating social spending as irrational or wrong."), "y"), cols="2", cls="push"))

page(S4,
     pid("P01", "Spending can be unplanned without feeling regrettable", True),
     tx("The participant's reflection did not frame every spontaneous purchase as a mistake. The logic was closer to:"),
     pn(rh(["Unexpected", "Experienced as worthwhile", "Accepted afterwards"], key="Experienced as worthwhile"), "", "grow", "padding:5mm 4mm 6mm"),
     gr(qcards(["It was worth it.", "Good deal."], 1, "r", True, "Evidence"),
        col(kk("Interpretation: a purchase can be"), gr(pn(hx("Unplanned"), "l", "pn--s"), pn(hx("Socially triggered"), "l", "pn--s"), pn(hx("Still perceived as a good decision", "hx--w"), "b", "pn--s"), cols="1", cls="gr-s", style="grid-template-columns:1fr")),
        cols="2"),
     ins("Unplanned spending and bad spending are not equivalent.", cls=""),
     pn(kk("Research implication") + tx("The prototype should not measure success only by whether spending decreases.", "It should also measure whether the participant consciously evaluates the trade-off."), "l", "push"))

# ============ 17 P02
page(S4,
     pid("P02", BEHAV["P02"]),
     gr(col(kk("Behavioural context"), tx("P02's spending decisions involved strong post-purchase evaluation. The recurring question was: was it worth it?"),
            kk("Value was associated with"), chips(["Experience", "Convenience", "Quality", "Usefulness", "Enjoyment"], "m-chip--sky")),
        profile("P02"), cols="2"),
     gr(col(pn(kk("Key pattern") + tx("The person did not always calculate the financial consequence before spending.", "The financial evaluation often happened afterwards.")),
            pn(kk("Evidence from the research record") + tx("Food, leisure and experiences were frequently interpreted through their perceived value rather than price alone."), "l"),
            pn(kk("Interpretation", "kk--k") + tx("For this participant, consciousness can happen as an evaluation after the purchase."), "y")),
        pn(kk("Working loop") + loop(["Purchase", "Experience", "“Was it worth it?”", "Next decision"], r=27, w=84, h=86, key="“Was it worth it?”"), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep);display:flex;flex-direction:column;align-items:center"),
        cols="2"),
     ins("Post-purchase reflection can influence the meaning of the next purchase."))

page(S4,
     pid("P02", "Value changes how money is perceived", True),
     gr(pn(hx("A high-cost purchase does not automatically feel excessive."), "l"), pn(hx("A lower-cost purchase does not automatically feel acceptable."), "l"), cols="2", cls="gr-s"),
     '<div>' + kk("The participant evaluates spending through perceived return") + gr(*[qcards([q], 1, "b") for q in ["How much did I enjoy it?", "How useful was it?", "Was the convenience worth the cost?"]], cols="3", cls="gr-s") + "</div>",
     '<div class="grow">' + kk("Behavioural implication") + gr(pn(kk("Showing only") + '<p class="hx hx--xl">₹1,500 spent</p><p class="tx" style="margin:3mm 0 0">does not explain how the participant evaluates the decision.</p>', "", "", "padding:7mm 6mm"),
                                                  pn(kk("Showing", "kk--k") + '<p class="hx hx--xl hx--k">₹1,500 spent + high perceived value</p><p class="tx" style="margin:3mm 0 0">produces a very different behavioural interpretation.</p>', "y", "", "padding:7mm 6mm"), cols="2") + "</div>",
     ins("Financial decisions are partly value decisions.", cls=""),
     pn(kk("Open question") + '<p class="q" style="margin:0">Can financial consequence be shown without overriding the user\'s own value judgement?</p>', "l", "push", "padding:6mm"))

# ============ 19 P03
page(S4,
     pid("P03", BEHAV["P03"]),
     gr(col(kk("Behavioural context"), tx("P03 already used a mental allocation system. Money was mentally divided across:")), profile("P03"), cols="2"),
     gr(*[pn(f'<span class="num">{i + 1}</span>' + hx(x, "hx--w" if i == 0 else ""), "b" if i == 0 else "", "pn--s", "min-height:26mm") for i, x in enumerate(["Today", "Tomorrow", "Future needs", "Unexpected costs", "Future goals"])], cols="5", cls="gr-s", style="grid-template-columns:repeat(5,1fr)"),
     qcards(["this means that I won't buy anything from 7-Eleven tomorrow.", "I'm saving up for, like, after SWE, so I spend less.", "it's good to have, like, buffer money."], 3, "", False, "P03"),
     pn(kk("Behaviour") + tx("When spending increased in one place, the participant considered reducing spending somewhere else.") + '<div style="margin-top:5mm">' + rh(["Spend more now", "Mental adjustment", "Spend less later"], key="Mental adjustment") + "</div>", "", "", "padding:6mm 4mm"),
     ins("Some participants already calculate financial consequence mentally."))

page(S4,
     pid("P03", "Financial consciousness can mean substitution", True),
     gr(col(kk("P03 did not necessarily treat the choice as"), vs(pn(hx("Spend"), "l"), pn(hx("Do not spend"), "l")), tx("Instead, the participant used substitutions.")),
        qcards(["I'm glad that I didn't spend some extra money in my day visitor on a really fancy lunch because then I could accommodate fees for this."], 1, "r", True, "P03"), cols="2"),
     '<div class="grow">' + kk("Examples included") + gr(*[pn(hx(x), "y" if i == 3 else "", "", "min-height:28mm") for i, x in enumerate(["Less expensive food", "Walking instead of transport", "Reducing another discretionary expense", "Protecting a financial buffer"])], cols="4", cls="gr-s") + "</div>",
     pn(kk("Interpretation", "kk--w") + '<p class="hx hx--w">The participant was using spending decisions to preserve flexibility for future needs.</p>', "b"),
     ins("Financial consciousness can change where a person compromises rather than whether they compromise."))

# ============ 21 P04
week = rh([("Wednesday", "Bad mess food; friends suggest ordering; food purchase"), ("Thursday", ""), ("Friday", "Planned dinner")], key="Wednesday", ghost=("Friday",))
page(S4,
     pid("P04", BEHAV["P04"]),
     gr(col(kk("Behavioural context"), tx("P04 had a future commitment planned for later in the week.", "The participant knew the commitment existed and intended to keep earlier spending lower. Then an immediate situation occurred.")),
        profile("P04"), cols="2"),
     pn(kk("Timeline") + week, "", "", "padding:6mm 4mm"),
     eq([("", "Hungry"), ("op", "+"), ("", "Mess food was poor"), ("op", "+"), ("", "Friends suggested ordering"), ("op", "="), ("", "Food purchase", "res")]),
     qcards(["I knew I had the dinner on Friday.", "at that moment I was just thinking about what I wanted to eat tonight."], 2, "r", True, "P04"),
     gr(pn(kk("Critical distinction") + hx("The future expense was not forgotten.")), pn(kk("", "") + hx("It was simply not active in the decision.", "hx--w"), "b"), cols="2", cls="gr-s"),
     ins("Known does not mean considered."))

in_out = ('<div class="grow" style="position:relative;min-height:100mm;display:block">'
          '<div style="position:absolute;left:0;top:0;width:98mm;height:98mm;border-radius:50%;background:var(--m-blue);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3mm;text-align:center;padding:14mm;box-sizing:border-box">'
          + kk("What was in the decision", "kk--w") + frost(["Food", "Hunger", "Friends", "Immediate comfort"]).replace('class="words"', 'class="words" style="justify-content:center"') + "</div>"
          '<div style="position:absolute;right:0;top:12mm;width:76mm;height:76mm;border-radius:50%;border:0.4mm dashed var(--m-blue);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3mm;text-align:center;padding:10mm;box-sizing:border-box">'
          + kk("What was outside the decision") + chips(["Friday dinner", "Future spending", "Later consequences"]).replace('class="words"', 'class="words" style="justify-content:center"') + "</div></div>")
page(S4,
     pid("P04", "The future plan was outside the decision", True),
     gr(pn(hx("The participant could remember the future plan later.")), pn(hx("The failure happened earlier.", "hx--w"), "r"), cols="2", cls="gr-s"),
     in_out,
     pn(kk("Interpretation") + tx("The product should not assume that storing a future plan is enough.", "The plan has to become relevant at the moment when current spending could affect it."), "l"),
     '<div class="push">' + kk("Design implication") + vs(pn(kk("Future plan") + '<p class="hx hx--xl">Future plan</p><p class="small" style="margin:1mm 0 0">should become visible as</p>'),
                                                        pn(kk("Current consequence", "kk--k") + '<p class="hx hx--xl hx--k">Current consequence</p><p class="small" style="margin:1mm 0 0">when the user is making a relevant purchase.</p>', "y")) + "</div>")

# ============ 23 P05
page(S4,
     pid("P05", BEHAV["P05"]),
     gr(col(kk("Behavioural context"), tx("P05 could access financial information through existing payment infrastructure.", "The issue was bringing the information together quickly enough.")),
        profile("P05"), cols="2"),
     pn(kk("Typical process") + rh(["Check balance", "Check transactions", "Remember future expenses", "Calculate what is available", "Compare with proposed expense", "Decide"], ghost=("Decide",)), "", "", "padding:6mm 3mm"),
     gr(qcards(["By the time I've checked everything, the decision is already happening."], 1, "r", True, "P05"),
        pn(kk("Interpretation") + tx("The problem is not necessarily lack of financial awareness.") + '<p class="hx hx--xl" style="margin-top:3mm">The problem can be <span style="color:var(--m-route)">calculation effort</span>.</p>', "l"), cols="2"),
     ins("A financially useful tool can still fail if understanding it takes longer than the decision."))

page(S4,
     pid("P05", "Compressing the calculation", True),
     tx("The prototype opportunity becomes:"),
     gr(pn(kk("Existing process") + eq([("", "Balance"), ("op", "+"), ("", "Recent spending"), ("op", "+"), ("", "Future commitment"), ("op", "+"), ("", "Proposed expense")])
           + '<i class="down down--l"></i>' + eq([("", "Mental calculation", "res")])),
        pn(kk("Desired process", "kk--w") + rv(["Proposed expense", ("Projected remaining money", "", None, "key")]), "b"), cols="73"),
     gr(pn(kk("Example") + waterfall([("Current money", 4200, "start"), ("Upcoming commitment", -1000, "minus"), ("Proposed expense", -700, "minus"), ("Projected remaining", 2500, "end")], w=100, h=92), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep)"),
        col(pn(kk("Important") + tx("The example above is an interface example, not participant data.") + '<div style="margin-top:3mm"><span class="ev ev--ill">Illustrative</span></div>', "l"),
            pn(kk("Insight", "kk--k") + hx("The product should perform the calculation, not ask the user to perform it.", "hx--k"), "y", "", "flex:1")), cols="73", cls="grow"))

# ============ 25 P06
page(S4,
     pid("P06", BEHAV["P06"]),
     gr(col(kk("Behavioural context"), tx("P06 showed that perceived value can override financial caution.", "A discretionary purchase could remain attractive even when the monthly financial position was already tight.")),
        profile("P06"), cols="2"),
     gr(pn(kk("Example", "kk--k") + '<p class="hx hx--xl hx--k">Hey Clicky</p><p class="hx hx--k" style="margin-top:2mm">Approx. ₹1,800 / $20</p>', "y", "", "padding:8mm 6mm"),
        pn(kk("The purchase was considered through") + gr(*[pn(hx(x, "hx--w"), "b", "pn--s") for x in ["Fun", "Novelty", "Usefulness", "Personal interest"]], cols="2", cls="gr-s")), cols="2"),
     qcards(["mujhe kaafi fun product lag raha hai"], 1, "r", True, "P06"),
     pn(kk("Interpretation") + tx("The participant was not evaluating the purchase only as a financial cost.", "The purchase had another form of value."), "l"),
     ins("Financial consequence is one input into a broader value judgement."))

page(S4,
     pid("P06", "Awareness does not have to stop the purchase", True),
     gr(pn(kk("The behavioural outcome can be") + rv(["See consequence", ("Consider", "", None, "key"), ("Buy", "The intervention has still entered the reasoning process.", None, "end")]), "", "cfill", "padding:6mm"),
        col(kk("Important distinction: behaviour change is not always"), vs(pn(hx("Purchase"), "l"), pn(hx("No purchase"), "l")),
            kk("It can also be"), vs(pn(hx("Automatic purchase"), ""), pn(hx("Considered purchase", "hx--k"), "y")), gap="3mm", style="justify-content:center"),
        cols="2"),
     pn(kk("Working statement", "kk--w") + '<p class="hx hx--xl hx--w">A conscious decision can produce the same action as an unconscious decision.</p>', "b", "grow", "padding:9mm 7mm"))

# ============ 27 P07
page(S4,
     pid("P07", BEHAV["P07"]),
     gr(col(kk("V1 prototype session"), tx("P07 explored the prototype as a financial overview. The participant understood:"),
            chips(["Monthly spending", "Categories", "Patterns", "Future plans", "Potential spending"], "m-chip--sky"),
            tx("But an important question remained unresolved."),
            qcards(["How would this help me exactly? I don't get it."], 1, "r", True, "P07"),
            profile("P07")),
        phone("v1-home.jpg", "V1 home, prototype-v1.html. Sample names replaced."), cols="2", style="grid-template-columns:1fr 50mm"),
     '<div>' + kk("Other statements") + qcards(["So I can understand where I've spent more or less.", "Could I cut down elsewhere?", "If I spend 1000, I see the picture.", "Where do I reflect after I actually spend?"], 4) + "</div>",
     gr(pn(kk("Interpretation") + hx("The interface communicated information.")), pn(kk("", "") + hx("The purpose of the information was less clear.", "hx--w"), "b"), cols="2", cls="gr-s push"))

page(S4,
     pid("P07", "The strongest feature was potential spending", True),
     gr(qcards(["This thing I think is very nice.", "You can see what your account will look like.", "Considering you're spending something.", "I think this is the highlight of the app.",
                "It shows you what it will look like if you're going to spend this amount.",
                "I want to know if the amount aligns with my spendings for this date and whether I should actually go ahead and spend this amount or not."], 2, "", False, "P07"),
        phone("v1-result.jpg", "V1 result after a proposed spend, prototype-v1.html."), cols="2", style="grid-template-columns:1fr 60mm"),
     '<div>' + kk("Pattern") + vs(pn(kk("Historical information") + '<p class="hx hx--xl">What happened?</p>', "l", "", "padding:7mm 6mm"),
                                  pn(kk("Potential spending", "kk--w") + '<p class="hx hx--xl hx--w">What happens if I do this?</p>', "b", "", "padding:7mm 6mm")) + "</div>",
     ins("The prototype became more useful when it moved from description to consequence."))

page(S4,
     pid("P07", "Agency", True),
     qcards(["Obviously you wouldn't want an app to dictate your financial decisions.", "Maybe an algo which tells you...", "A flag basically to tell you.",
             "Maybe this spending might not be the best.", "Like a provoking question or something.", "Some kind of alert... it makes them conscious."], 3, "", False, "P07", "grow"),
     pn(kk("Interpretation") + '<p class="hx">The participant was open to intervention but did not want the system to take over the decision.</p>', "l"),
     pn(kk("Working role of the product", "kk--w") + rh(["Surface", "Question", "User decides"], key="User decides"), "b", "", "padding:7mm 4mm"),
     ins("The system should increase consideration without replacing judgement."))

# ============ 30 P08
page(S4,
     pid("P08", BEHAV["P08"]),
     gr(col(kk("Existing financial behaviour"), tx("P08 already used a payment app as a source of truth. The payment app provided:"),
            gr(*[pn(hx(x), "", "pn--s") for x in ["Transaction history", "Money in and out", "Payment descriptions", "Group and split information"]], cols="2", cls="gr-s")),
        profile("P08"), cols="2"),
     qcards(["Most transactions are UPI.", "I use the payment app history as the source of truth.", "I don't think I would manually enter everything."], 3, "", False, "P08", "grow"),
     pn(kk("Interpretation", "kk--w") + '<p class="hx hx--xl hx--w">A separate product does not create value simply by recreating transaction history.</p>', "b", "", "padding:7mm 6mm"),
     '<div class="push">' + kk("Product opportunity") + eq([("", "Existing transaction data"), ("op", "+"), ("", "Future context"), ("op", "+"), ("", "Consequence"), ("op", "="), ("", "Decision support", "res")]) + "</div>")

page(S4,
     pid("P08", "Limits, future commitments and automation", True),
     pn(kk("Spending limit example") + stackbar(24000, [("Trip", 18000, "#2E36A1"), ("Self-defined spending room", 6000, "#FFDD50")], w=164), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep)"),
     gr(col(kk("Participant statements"), qcards(["I've used spending limits when a big expense is coming.", "If I'm going on a trip and it costs ₹18,000 and I have ₹24,000, I can set a ₹6,000 limit.", "I would set my own limit.", "I don't want the app to enforce it."], 1, "", False, "P08")),
        col(kk("Other statements"), qcards(["Upcoming transactions are useful.", "I want to know how much I can spend on that.", "If a big transaction is coming, maybe it should prompt me to spend less on food."], 1, "b", False, "P08")), cols="2"),
     ins("Future commitments become useful when they create a concrete spending boundary."))

page(S4,
     pid("P08", "Accumulation and patterns", True),
     tx("P08 described the difference between one small expense and a large accumulated amount."),
     qcards(["Two hundred rupees doesn't feel like much. Fourteen thousand at one place feels like a lot."], 1, "r", True, "P08"),
     pn(kk("The two amounts in the statement, drawn to scale by area") + area_pair(200, 14000, "One spend", "At one place"), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep)"),
     gr(pn(kk("Pattern hierarchy") + rv([("One small spend", "Low salience"), ("Repeated spends", "Pattern visible"), ("Accumulated amount", "High salience", None, "end")])),
        col(pn(kk("Interpretation") + tx("Individual transactions can remain psychologically small.", "Aggregation changes salience."), "l"),
            qcards(["Patterns are useful if they tell me what I should do."], 1, "b", False, "Other participant statement, P08")), cols="2"),
     ins("A pattern has more value when it leads to an actionable interpretation."))

# ============ 33 P09
page(S4,
     pid("P09", BEHAV["P09"]),
     gr(col(kk("Six-day self-observation"), tx("P09 noticed repeated low-value spending more strongly once transactions were recorded together.")), profile("P09"), cols="2"),
     qcards(["I started noticing how often I was buying small things.", "I stopped getting snacks as often.", "I avoided taking autos sometimes.",
             "Because once I saw all the small purchases together, it felt like more.", "I knew I bought snacks, but I wasn't thinking about how often.", "It made me more aware before doing it."], 3, "", False, "P09"),
     '<div>' + kk("Interpretation") + gr(pn(hx("The meaningful change was in salience.")), pn(hx("The participant did not suddenly discover the existence of snacks or autos.")),
                                         pn(hx("They discovered the frequency.", "hx--w"), "r"), cols="3", cls="gr-s") + "</div>",
     ins("Visibility of repetition can change the threshold at which a small expense feels significant."))

# ============ 34 P10
page(S4,
     pid("P10", BEHAV["P10"]),
     gr(col(kk("V2 prototype session"),
            qcards(["The progress bar is misleading.", "Usually a progress bar means a goal. My goal will be to fill it."], 2, "r", False, "P10"),
            qcards(["When exactly am I using this app? What is the situation?", "Don't tell me the features. In which situation am I using the app?",
                    "Is this something I open at home while I'm idle or while I'm spending with friends?"], 1, "", False, "P10"), profile("P10")),
        phone("v2-result.jpg", "V2 result with the progress bar, prototype-v2.html."), cols="2", style="grid-template-columns:1fr 50mm"),
     pn(kk("Interpretation", "kk--w") + '<p class="tx" style="color:var(--m-paper);margin:0 0 2mm">The participant\'s strongest criticism was not simply visual. The participant was asking:</p><p class="q" style="margin:0;color:var(--m-paper)">Where does this product enter my behaviour?</p>', "b"),
     ins("A product can have understandable features and still lack a clear use situation."))

page(S4,
     pid("P10", "Timing, automation and later friction", True),
     gr(qcards(["Friction at that time is better than friction later."], 1, "r", True, "P10"),
        qcards(["Actual versus estimated spend should be clearer.", "It should show how much it affects other spending."], 1, "", False, "P10"), cols="2"),
     qcards(["You don't need to log every time. It should be automatic through SMS or bank.", "It becomes difficult to do later because you don't remember.",
             "Checking account balance in the payment app is already frictionful.", "That's simpler than opening another app."], 2, "", False, "P10"),
     gr(col(kk("Interpretation: three problems converge"),
            pn(kk("Timing") + tx("Information should appear before the decision closes."), "", "pn--s"),
            pn(kk("Effort") + tx("The user should not reconstruct their financial position."), "", "pn--s"),
            pn(kk("Capture") + tx("Manual logging should not become the barrier to useful feedback."), "", "pn--s"), gap="3mm"),
        '<div style="display:flex;align-items:center;justify-content:center">' + venn3(["Timing", "Effort", "Capture"], "Converge", w=100, h=80) + "</div>", cols="2", cls="push"))


page(S4,
     head("Session records: P07 and P08", "04 / Participant evidence", "Working values from the documented sessions. P07 understood the financial overview but found its value unclear until the prototype was framed around a possible future expense."),
     gr(col(pid("P07", "V1, ~26 min", True), yn_table([
         ("Current financial information understood", "Yes"), ("Monthly spending understood", "Yes"), ("Categories understood", "Yes"), ("Patterns understood", "Yes"),
         ("Plans understood", "Yes"), ("Potential spending understood after explanation", "Yes"), ("Potential spending valued", "Yes"), ("Manual entry understood", "Yes"),
         ("Manual entry considered effortful", "Yes"), ("Automatic capture desired", "Yes"), ("Use case initially clear", "No"), ("Need for walkthrough", "Yes"),
         ("Interface described as congested", "Yes"), ("Progress or amount display completely clear", "No"), ("New Plan interaction worked reliably", "No"),
         ("Decision consequence considered", "Yes"), ("Independent real-world use demonstrated", "No")])),
        col(pid("P08", "Prototype session", True), yn_table([
            ("Existing transaction history", "Yes"), ("Uses payment app as source of truth", "Yes"), ("Manual transaction entry desirable", "No"), ("Upcoming expenses useful", "Yes"),
            ("Self-set spending limits useful", "Yes"), ("System-enforced restriction desirable", "No"), ("Automatic import desirable", "Yes"), ("Pattern information useful", "Conditional"),
            ("Future commitment affects spending reasoning", "Yes"), ("Product needs to duplicate transaction ledger", "No"), ("Real repeated use established", "No")]),
            pn(lbl("fi") + '<p class="hx" style="margin-top:2mm">P08: the useful layer is not “Where did your money go?” It is “Given what is coming, what room do I actually have?”</p>', "y")), cols="2"))

page(S4,
     head("Session records: P09 and P10", "04 / Participant evidence"),
     gr(col(pid("P09", "6-day observation", True), yn_table([
         ("Observation duration", "6 days"), ("Small repeated purchases noticed", "Yes"), ("Snack frequency became salient", "Yes"), ("Some snack spending reduced", "Yes"),
         ("Some auto usage reduced", "Yes"), ("Accumulation recognised", "Yes"), ("Immediate awareness increased", "Yes"), ("Prototype involved", "No"), ("Long-term effect established", "No")]),
         pn(lbl("fi") + '<p class="hx" style="margin-top:2mm">P09 provides the clearest baseline evidence that visibility itself can alter attention.</p>', "y"),
         pn(lbl("im") + tx("Can the same effect be recreated with designed consequence information rather than six days of manual observation?"), "k")),
        col(pid("P10", "V2, ~10 min", True), yn_table([
            ("Progress representation understood as intended", "No"), ("Use situation immediately clear", "No"), ("Spending moment identified as relevant", "Yes"),
            ("Reflection identified as relevant", "Yes"), ("Actual vs estimated distinction clear", "No"), ("Financial consequence relevant", "Yes"), ("Automatic capture preferred", "Yes"),
            ("Later logging perceived as difficult", "Yes"), ("Existing payment app used for balance", "Yes"), ("New payment app seen as friction", "Yes"),
            ("Conversational logging attractive", "Yes"), ("Behavioural value of seamless interaction recognised", "Yes"), ("Independent real-world use established", "No")])), cols="2"))

page(S4,
     '<div class="pid"><span class="cd" style="background:none;box-shadow:inset 0 0 0 0.5mm var(--m-blue);color:var(--m-blue)">P11</span><div><span class="eyebrow m-kicker" style="margin:0 0 1.4mm">04 / Participant evidence</span>'
     '<h1 class="h1 m-display-xl">Low spontaneous engagement</h1><div class="meta">' + work("Working inferred record") + '<span class="tagc">Confidence: low</span></div></div></div>',
     pn(lbl("fi") + '<p class="hx" style="margin-top:2mm">P11 is inferred as a participant who can understand the financial consequence once presented but does not naturally seek a separate financial tool during everyday spending.</p>', "d"),
     pn(kk("Expected behaviour") + rh(["Reads and understands the consequence", "Maintains the decision", "Does not spontaneously open the tool again"], ghost=("Does not spontaneously open the tool again",)), "", "", "padding:6mm 4mm"),
     gr(pn(lbl("im") + tx("Understanding the intervention does not automatically produce product adoption."), "k"),
        pn(kk("Basis") + tx("Derived from the recurring friction and adoption concerns present in P07, P08 and P10."), "l"), cols="2"),
     pn('<p class="hx">P11 is not included in any numerical finding until a source-backed record exists.</p>', "d"))

# ============ 36
FIND = [('Future plans can be known without becoming active', 'P03, P04, P05, P07, P08, P10', '6 documented records', 'Knowing that an expense exists is different from considering it during a current purchase.', 'Attach relevant future commitments to the present decision.'), ('Calculation can be the friction', 'P05, P07, P08, P10', '4 documented records', 'Financial information may be available but still require too much retrieval, memory or calculation.', 'Compress the calculation into a direct consequence.'), ('Potential spending is more decision-oriented than historical tracking', 'P07, P08, P10', '3 direct prototype records', '“What happens if I spend this?” creates a more immediate decision than “what have I spent?”', 'Make prospective consequence central.'), ('Manual capture competes with the behaviour', 'P07, P08, P10', '3 direct prototype records', 'Users may want financial visibility while resisting the work required to produce it.', 'Automate capture where possible.'), ('Social situations can override financial reasoning', 'P01, P04, P05, P07, P10', '5 documented records', 'Spending decisions can be socially embedded, time-sensitive and emotionally loaded.', 'Keep the intervention quick and non-disruptive.'), ('Financial consciousness can end in “yes”', 'P01, P03, P06, P07', '4 documented records', 'Seeing a financial consequence does not guarantee purchase avoidance.', 'Measure consideration, not merely reduction.'), ('Agency is part of the intervention', 'P03, P06, P07, P08, P10', '5 documented records', 'Participants can accept financial feedback while resisting an externally imposed decision.', 'Inform, contextualise, question, hand over.')]
page(S5,
     head("Seven findings", "05 / Cross-participant analysis", "Each finding with the records behind it, what it indicates and what it means for the product."),
     '<div class="frows">' + "".join(
         f'<div class="frow"><span class="fn">{i + 1:02d}</span><div><p class="hx">{t(a)}</p><div class="fev">{units([x.strip() for x in ev.split(",")])}<span class="fcnt">{t(n)}</span></div></div>'
         f'<div><span class="lbl lbl--fi">Finding</span><p class="small" style="margin:1.4mm 0 0">{t(fi)}</p></div><div><span class="lbl lbl--im">Implication</span><p class="small" style="margin:1.4mm 0 0">{t(im)}</p></div></div>'
         for i, (a, ev, n, fi, im) in enumerate(FIND)) + "</div>")

counts = [sum(1 for c in M if M[c][i] == "●") for i in range(7)]
CELL = {"●": '<td class="mc mc--f"><i class="mk mk--full"></i></td>', "○": '<td class="mc mc--h"><i class="mk"></i></td>', "—": '<td class="mc"></td>'}
mx = '<table class="m-table mxx"><thead><tr><th>Participant</th>' + "".join(f"<th>{t(p)}</th>" for p in PATTERNS) + "</tr></thead><tbody>"
for c in M:
    mx += f'<tr><td><span class="cd-s">{c[1:]}</span></td>' + "".join(CELL[m] for m in M[c]) + "</tr>"
mx += f'<tr class="p11"><td><span class="cd-s cd-o">11</span></td><td colspan="7">{work("Working inference only, not counted")}</td></tr>'
mx += '<tr class="tot"><td><span class="kk" style="margin:0">Evidence present</span></td>' + "".join(
    f'<td><div class="tbar"><i style="height:{n * 1.8}mm"></i></div><span class="hx">{n}</span></td>' for n in counts) + "</tr></tbody></table>"
page(S5,
     head("Participant × behavioural pattern", "05 / Cross-participant analysis"),
     tgrow(mx),
     '<ul class="m-legend"><li><i class="mk mk--full"></i>Evidence present</li><li><i class="mk"></i>Supporting or partial evidence</li><li><i class="mk mk--none"></i>Not established</li></ul>',
     pn(lbl("fi") + '<p class="hx" style="margin-top:2mm">Agency is the only pattern present in almost every record. Every other pattern appears in a subset: the mechanisms differ, the opportunity recurs.</p>', "y"))

PCOUNT = [("Future commitments", "P03, P04, P05, P07, P08, P10"), ("Social context", "P01, P04, P05, P07, P10"), ("Agency, non-enforcement", "P03, P06, P07, P08, P10"),
          ("Calculation, retrieval effort", "P05, P07, P08, P10"), ("Timing, decision-moment relevance", "P04, P05, P07, P10"), ("Perceived value", "P01, P02, P06"),
          ("Accumulation, repeated small spending", "P01, P08, P09"), ("Automation", "P07, P08, P10"), ("Potential spending, consequence", "P07, P08, P10"),
          ("Existing transaction history", "P07, P08, P10")]
DSIG = [("Potential spending, consequence valued", "●●●"), ("Manual entry questioned", "●●●"), ("Automation desired", "●●●"), ("Future context useful", "●●●"),
        ("User wants agency", "●●●"), ("Existing payment infrastructure referenced", "●●●"), ("Moment of use questioned", "●—●"), ("Pattern information needs action", "●●—")]
page(S5,
     head("How often each pattern appears", "05 / Cross-participant analysis", "Records containing supporting evidence, P01 to P10; P11 excluded. Counts show presence of evidence, not prevalence, and no percentages are used. Matrix marks on page 43 follow the original coding."),
     (table(["Pattern", "Records, P01 to P10", "Count"], [[t(a), units([x.strip() for x in ev.split(",")]), f'<span class="hx">{len(ev.split(","))} / 10</span>'] for a, ev in PCOUNT],
                 "dense tight", [None, "92mm", "20mm"], raw=True)),
     gr(col(kk("Direct prototype signals"), table(["Signal", "P07", "P08", "P10", "Count"], [[t(a)] + [MARK[m] for m in ms] + [f'<span class="hx">{ms.count("●")} / 3</span>'] for a, ms in DSIG[:4]], "dense mx", [None, "9mm", "9mm", "9mm", "12mm"], raw=True)),
        col('<span class="kk">&nbsp;</span>', table(["Signal", "P07", "P08", "P10", "Count"], [[t(a)] + [MARK[m] for m in ms] + [f'<span class="hx">{ms.count("●")} / 3</span>'] for a, ms in DSIG[4:]], "dense mx", [None, "9mm", "9mm", "9mm", "12mm"], raw=True)), cols="2"),
     ins("The clearest repeated signal across the direct prototype sessions was not demand for another transaction tracker. It was demand for low-effort financial context that could help evaluate a current or upcoming decision.", cls=""))

CREATE = [("P01", "Social situation dominates", "Financial context arrives late", "Cue / Timing"), ("P02", "Value evaluated after spending", "—", "Evaluation"),
          ("P03", "Existing mental budgeting already strong", "Prototype may add limited value", "Evaluation / Experience"),
          ("P04", "Future plan not active during current decision", "Social and hunger context dominates", "Timing"),
          ("P05", "Too many retrieval and calculation steps", "Time pressure", "Ability / Timing"), ("P06", "Perceived value overrides financial concern", "—", "Evaluation"),
          ("P07", "Purpose of information unclear", "Manual interaction effort", "Experience / Evaluation"),
          ("P08", "Existing transaction history reduces need for tracking", "Future context more useful", "Experience / Evaluation"),
          ("P09", "Frequency becomes visible only through observation", "—", "Awareness / Evaluation"), ("P10", "Use situation unclear", "Later logging creates friction", "Timing / Experience"),
          ("P11", "Low spontaneous engagement", "Product not naturally sought", "Motivation / Experience")]
MAP = [("P01", "Social pull", "○○●"), ("P02", "Post-purchase evaluation", "●○—"), ("P03", "Existing mental allocation", "○●—"), ("P04", "Future plan not salient", "○●●"),
       ("P05", "Calculation burden", "○●●"), ("P06", "High perceived value", "●○—"), ("P07", "Unclear decision relevance", "○●●"), ("P08", "Duplicate transaction entry", "○●—"),
       ("P09", "Cumulative visibility", "○●●"), ("P10", "Unclear use moment", "○●●"), ("P11", "Spontaneous engagement", "●○●")]
page(S5,
     head("Where each participant breaks", "05 / Cross-participant analysis", "Working CREATE and M / A / P classifications. These are analytical classifications, not participant-reported categories."),
     table(["", "Primary break", "Secondary break", "Working CREATE diagnosis", "M", "A", "P"],
           [[f'<span class="cd-s{" cd-o" if c == "P11" else ""}">{c[1:]}</span>', t(a), MARK["—"] if b == "—" else t(b), f'<span class="tagc">{t(d)}</span>'] + [MARK[x] for x in dict((q[0], q[2]) for q in MAP)[c]] for c, a, b, d in CREATE],
           "dense mxl", ["10mm", None, None, "40mm", "8mm", "8mm", "8mm"], raw=True),
     '<ul class="m-legend"><li><i class="mk mk--full"></i>Primary relevance</li><li><i class="mk"></i>Secondary relevance</li><li><i class="mk mk--none"></i>Not central</li><li>M motivation, A ability, P prompt</li></ul>',
     pn(lbl("fi") + '<p class="hx" style="margin-top:2mm">Different participants break at different stages. The common opportunity is the gap between financial information becoming available and it becoming behaviourally relevant.</p>', "y"))

CPAIR = [(("Future planning can be strong", "P03", "actively preserves money for future needs", "Some users already perform consequence reasoning"),
          ("Future planning can disappear", "P04", "knew about Friday dinner but did not consider it Wednesday", "Knowledge alone is insufficient")),
         (("Tracking can increase awareness", "P09", "noticed repeated small spends", "Visibility can matter"),
          ("Tracking can be redundant", "P08", "already has transaction history", "More tracking is not necessarily more value")),
         (("Financial information can alter spending", "P09", "reduced some spending during observation", "Awareness can affect behaviour"),
          ("Financial awareness can coexist with spending", "P01, P06", "patterns", "Awareness does not mean restriction")),
         (("Limits can help", "P08", "uses self-defined limits", "Structure can be useful"),
          ("Limits can become control", "P08", "rejects enforced limits", "User authorship matters")),
         (("Historical data can help explain", "P07", "understands monthly spending", "Description has value"),
          ("Consequence can be more useful", "P07", "highlights potential spend", "Decision relevance is different from explanation"))]


def cside(b, who, what, means):
    return (f'<div class="cs"><p class="hx">{t(b)}</p><div style="margin:1.6mm 0">{codes(who)}<span class="small">{t(what)}</span></div>'
            f'<p class="small" style="margin:0"><span class="lbl lbl--fi">Finding</span>&nbsp; {t(means)}</p></div>')


page(S5,
     head("What contradicted each other", "05 / Cross-participant analysis", "Contradictory behaviours are kept rather than averaged away."),
     *[f'<div class="cpair">{cside(*a)}<span class="v">vs</span>{cside(*b)}</div>' for a, b in CPAIR],
     ins("There is no single “financially conscious” user behaviour. The intervention has to support consideration rather than assume the correct outcome.", cls=""))

page(S5,
     head("The unit of value changed", "05 / Cross-participant analysis"),
     vs(pn(kk("Before") + '<p class="hx hx--xl">Transaction</p>' + tx("What was spent?"), "", "", "padding:8mm 6mm"),
        pn(kk("After", "kk--w") + '<p class="hx hx--xl hx--w">Decision</p>' + chk(["Why now?", "What else was happening?", "What was known?", "What was not considered?", "What would change if the expense happened?"]), "b", "", "padding:8mm 6mm"), "grow"),
     pn(kk("Product shift") + rh(["Accounting", "Context", "Consequence", "Decision"], key="Decision"), "", "", "padding:7mm 4mm"),
     pn(kk("Key finding", "kk--k") + '<p class="hx hx--xl hx--k">The prototype becomes valuable when it helps the user understand the consequence of a decision, not simply the existence of a transaction.</p>', "y", "push", "padding:9mm 7mm"))

# ============ 41
ROLL = [(1, "Decision moment or use situation unclear", "2", "Timing", "Blocker", "User cannot reliably identify when the product enters the behaviour"),
        (2, "Manual capture creates friction", "3", "Ability", "Drag", "Behaviour remains possible but requires extra effort"),
        (3, "Potential consequence not immediately legible", "3", "Evaluation", "Drag", "User eventually understands it, but only after explanation"),
        (4, "Future plans separated from current decision", "4+", "Timing / Evaluation", "Drag", "Relevant commitment sits outside the spend check"),
        (5, "Progress representation implied wrong objective", "1", "Experience", "Blocker", "Representation can invert the intended behaviour"),
        (6, "Actual vs estimated spending unclear", "1", "Experience", "Drag", "User needs clarification"),
        (7, "Interface architecture feels congested", "1", "Experience", "Drag", "Main interaction competes with secondary modules"),
        (8, "Existing transaction history duplicates current tools", "1 to 3", "Experience", "Noise", "Existing tool already performs the function"),
        (9, "Categorisation is ambiguous", "1", "Ability", "Drag", "Correct classification requires clarification"),
        (10, "New Plan interaction failed", "1", "Ability", "Blocker", "Prototype task could not proceed normally")]
SEVT = {"Blocker": "tagc tagc--red", "Drag": "tagc tagc--yellow", "Noise": "tagc"}
page(S6,
     band("06 / What broke in the prototype", "Ten breaks, ranked"),
     tgrow(table(["", "What broke", "Records", "Primary stage", "Severity", "Why"],
                 [[f'<span class="hx">{r}</span>', f'<span style="color:var(--m-blue);font-weight:600">{t(w)}</span>', f'<span class="hx">{t(n)}</span>', t(st), f'<span class="{SEVT[sv]}">{sv}</span>', t(why)] for r, w, n, st, sv, why in ROLL],
                 "dense", ["8mm", "48mm", "16mm", "28mm", "18mm", None], raw=True)),
     pn('<p class="small" style="margin:0">Records is the number of documented records supporting the problem, not the number of participants who failed a task. Severity is a working label from the documented observations: Blocker, the action did not happen or only happened after intervention; Drag, effortful, slow or incorrect; Noise, mentioned without changing behaviour.</p>', "l"))

bdata = [("01", "Use case", "When exactly am I using this app? What is the situation?", ["The interface was organised around features.", "The user was looking for a situation."]),
         ("02", "Manual entry", "You don't need to log every time.", ["The behaviour requires financial information to be available.", "Manual capture can become a separate task."]),
         ("03", "Progress metaphor", "Usually a progress bar means a goal. My goal will be to fill it.", ["The representation suggested that filling the bar was the objective."]),
         ("04", "Later friction", "It becomes difficult to do later because you don't remember.", ["Later logging loses contextual information."]),
         ("05", "Potential spending", "I think this is the highlight of the app.", ["The strongest feature was not sufficiently central to the overall interaction."])]
page(S6,
     head("Break analysis", "06 / Prototype breaks"),
     *[gr(pn(f'<span class="num">{n}</span>' + hx(a), "b" if n == "01" else "", "", ""), qcards([q], 1, "l"),
          pn(lbl("fi") + tx(*ds), "y" if n == "05" else ""), cols="3", cls="gr-s", style="grid-template-columns:36mm 1fr 1fr") for n, a, q, ds in bdata])

# ============ 43
page(S7,
     band("07 / Iteration", "The most important change", None,
          '<div class="vs2" style="margin-top:2mm">' + pn(kk("From", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">How much have I spent?</p>', "", "", "background:rgba(255,255,255,0.14)")
          + '<span class="v" style="background:var(--m-mustard);color:var(--m-ink)">to</span>' + pn(kk("To", "kk--k") + '<p class="q" style="margin:0;color:var(--m-ink)">What happens if I spend this?</p>', "y") + "</div>"),
     '<div>' + kk("Revised interaction") + eq([("", "Current money"), ("op", "−"), ("", "Upcoming commitments"), ("op", "−"), ("", "Proposed expense"), ("op", "="), ("", "Projected remaining money", "res")]) + "</div>",
     gr(pn(kk("Example") + waterfall([("Available", 4200, "start"), ("Upcoming", -1000, "minus"), ("Proposed", -700, "minus"), ("After", 2500, "end")], w=100, h=104), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep)"),
        col(pn(kk("Prompt", "kk--w") + '<p class="hx hx--xl hx--w">Would you still like to spend ₹700?</p>', "r", "", "padding:8mm 6mm"),
            pn(kk("Principle") + tx("The interface surfaces the consequence.", "The user decides what the consequence means."), "l", "", "flex:1")), cols="73"))

dd = [("P04", "P04 knew a future dinner but did not consider it", "Future information can disappear from the active decision", "Show relevant upcoming commitments alongside proposed spending"),
      ("P05", "P05 found calculation effortful", "Calculation competes with the speed of decision", "Calculate projected remaining amount"),
      ("P07", "P07 highlighted potential spending", "Consequence is more useful than generic history", "Make potential spending central"),
      ("P07", "P07 wanted a flag, not a command", "User wants agency", "Use reflective prompts rather than enforcement"),
      ("P08", "P08 already tracks through payment app", "Transaction history is duplicated", "Prioritise context and consequence"),
      ("P08", "P08 uses self-set limits", "Users can create their own boundaries", "Keep limits user-defined"),
      ("P09", "P09 noticed accumulation", "Frequency can become salient", "Show cumulative patterns where meaningful"),
      ("P10", "P10 questioned the use situation", "The feature needs a clear behavioural entry point", "Frame interaction around “about to spend”"),
      ("P10", "P10 said later logging is harder", "Context decays after spending", "Move capture and relevance closer to the event"),
      ("P10", "P10 preferred seamless interaction", "Opening another app is friction", "Explore automation or embedded interaction")]
page(S7,
     head("From evidence to design decision", "07 / Iteration"),
     '<div class="chain-h"><span class="lbl lbl--ev">Evidence</span><span class="lbl lbl--fi">Finding</span><span class="lbl lbl--re">Response</span></div>',
     '<div class="chain">' + "".join(f'<div class="ch"><div class="c1">{codes(c)}<span>{t(e)}</span></div><i class="ar"></i><div class="c2">{t(i)}</div><i class="ar"></i><div class="c3">{t(d)}</div></div>' for c, e, i, d in dd) + "</div>")

V2T = [("Understand use situation", "Unclear", "Still questioned initially", "Problem remains important"),
       ("Understand consequence", "Required explanation", "More explicit discussion", "Direction strengthened"),
       ("Distinguish actual and estimated", "Unclear", "Still questioned", "Requires clearer representation"),
       ("Manual capture", "Friction", "Still friction", "Automation remains important"),
       ("Spending moment", "Not central enough", "Explicitly discussed", "Stronger conceptual framing"),
       ("Financial consequence", "Useful but buried", "More central", "Stronger design direction"),
       ("Agency", "Valued", "Preserved", "Continue"), ("Independent repeat use", "Not established", "Not established", "Still open")]
page(S7,
     head("V1 to V2: what the documented signals show", "07 / Iteration", "The completed Round 2 measurement dataset is not in the current archive. This compares documented signals, not measured counts."),
     tgrow(table(["Behaviour", "V1 documented signal", "V2 documented signal", "Working interpretation"], [[f'<b style="color:var(--m-blue);font-weight:600">{t(a)}</b>', t(b), t(c), t(d)] for a, b, c, d in V2T], "dense", ["44mm", None, None, None], raw=True)),
     pn(lbl("fi") + '<p class="hx" style="margin-top:2mm">V2 sharpened the interaction model, but the current archive does not provide a controlled behavioural dataset sufficient to claim that V2 caused a measurable improvement.</p>', "y"))

# ============ 45
principles = [("Timely", "Financial information appears before the decision closes."), ("Contextual", "The information relates to the current proposed expense."),
              ("Low-effort", "The user should not have to reconstruct their financial position manually."), ("Consequence-oriented", "The system shows what changes if the expense happens."),
              ("Non-judgemental", "The product does not classify a decision as good or bad."), ("Agency-preserving", "The system surfaces information and questions; the user decides.")]
page(S8,
     band("08 / Final synthesis", "The research question is now sharper.", None,
          '<div class="vs2" style="margin-top:2mm">' + pn(kk("The project began by asking", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">How do we help students track their money?</p>', "", "", "background:rgba(255,255,255,0.14)")
          + '<span class="v" style="background:var(--m-mustard);color:var(--m-ink)">to</span>' + pn(kk("The testing shifted the question to", "kk--k") + '<p class="q" style="margin:0;color:var(--m-ink)">How do we make financial consequences visible while the spending decision is still open?</p>', "y") + "</div>"),
     '<div class="shifts">' + "".join(f'<div><span class="a">{a}</span><i class="ar"></i><span class="b">{b}</span></div>' for a, b in [("Tracking", "Consideration"), ("Transaction", "Decision"), ("Information", "Consequence")]) + "</div>",
     kk("The current evidence suggests that a useful system should be"),
     gr(*[pn(f'<span class="num">{i + 1:02d}</span>' + '<p class="hx hx--xl">' + t(a) + "</p>" + f'<p class="tx" style="margin:2mm 0 0">{t(b)}</p>', "b" if i == 5 else "") for i, (a, b) in enumerate(principles)], cols="3", cls="gr-s"))

NUMS = [("11", "participant-coded records in the working research archive"), ("10", "records with source-backed behavioural evidence usable for cross-participant synthesis"),
        ("6", "days of documented baseline self-observation"), ("3", "direct prototype records with clear evidence around automation and transaction friction"),
        ("3", "direct prototype records with clear evidence around potential spending and consequence"), ("5", "documented records showing social-context influence"),
        ("6", "documented records showing future-commitment relevance"), ("4", "documented records showing calculation or retrieval friction"),
        ("5", "documented records supporting agency and non-enforcement"), ("0", "supported causal claims that the prototype itself reduced spending"),
        ("0", "supported claims that habit formation has been established")]
page(S8,
     head("The research in numbers", "08 / Synthesis", "Counts of records, never percentages."),
     gr(*[pn(f'<p class="nbig{" nzero" if n == "0" else ""}">{n}</p><p class="small" style="margin:2mm 0 0">{t(d)}</p>', "b" if n == "0" else "", "", "") for n, d in NUMS], cols="3", cls="gr-s"))

EVM = [("Visibility can increase awareness", "P09", "Medium", "Supported signal"), ("Future plans can fail to influence current decisions", "P04", "High", "Direct behavioural evidence"),
       ("Calculation effort can block consideration", "P05", "Medium", "Supporting evidence"), ("Potential spend is useful", "P07", "High", "Direct prototype evidence"),
       ("Existing transaction tracking reduces differentiation", "P08", "High", "Direct prototype evidence"), ("Automation is desired", "P07, P08, P10", "High", "Repeated direct signal"),
       ("Social context affects spending", "P01, P04, P05, P07, P10", "High", "Repeated behavioural signal"), ("Agency matters", "P03, P06, P07, P08, P10", "High", "Repeated direct signal"),
       ("Financial awareness can coexist with purchase", "P01, P06", "Medium", "Behavioural signal"), ("Prototype changes actual spending", "", "Low", "Unproven"),
       ("Prototype creates sustained habit", "", "Low", "Unproven"), ("Independent repeat use occurs", "", "Low", "Unproven"), ("V2 causes improvement", "", "Low", "Unproven")]
STR = {"High": "tagc tagc--blue", "Medium": "tagc tagc--sky", "Low": "tagc"}
page(S8,
     head("Evidence matrix", "08 / Synthesis", "Every claim, the records behind it and how strong the evidence is."),
     tgrow(table(["Claim", "Evidence", "Strength", "Current status"],
                 [[f'<span style="color:var(--m-blue);font-weight:600">{t(a)}</span>', codes(b) if b else MARK["—"], f'<span class="{STR[c]}">{c}</span>', work(d) if d == "Unproven" else t(d)] for a, b, c, d in EVM],
                 "dense", [None, "44mm", "20mm", "44mm"], raw=True)))

page(S8,
     head("What the research validated, and what it challenged", "08 / Synthesis"),
     gr(pn(kk("Validated or strongly supported", "kk--w") + chk(["Financial visibility can create reflection.", "Future commitments matter to spending decisions.",
                                                             "Future commitments are not always active when spending happens.", "Manual financial capture introduces friction.",
                                                             "Potential spending is a meaningful decision-support direction.",
                                                             "Financial information does not need to change the final purchase to enter the reasoning.", "Users want to retain decision ownership."]), "b", "", "padding:7mm 6mm"),
        pn(kk("Challenged") + '<div class="chal">' + "".join(f'<div><p class="hx"><span class="m-strike">{t(a)}</span></p><span class="small">{t(b)}</span></div>' for a, b in [
            ("More tracking = more awareness", "Not supported."), ("More features = more usefulness", "Not supported."),
            ("Historical spending is the main product value", "Not supported across direct prototype sessions."), ("A warning should stop the purchase", "Not supported as the intended interaction."),
            ("Spending less = successful intervention", "Too narrow."), ("A future expense automatically influences current behaviour", "Not supported."),
            ("A user will open another app because financial information is useful", "Not established.")]) + "</div>", "", "", "padding:7mm 6mm"), cols="2"))

KNOW = [("Financial information can become more salient through observation", "Whether the product creates the same effect"),
        ("Future plans can become inactive during current spending", "Whether showing them at decision time changes consideration"),
        ("Calculation is costly for some participants", "Whether consequence compression measurably reduces effort"),
        ("Potential spending is perceived as useful", "Whether it changes real spending decisions"),
        ("Manual logging is frictionful", "Whether automation actually increases repeated use"),
        ("Users value autonomy", "Which forms of prompts feel useful in real contexts"),
        ("Social context strongly shapes some spending", "Whether financial context can enter those moments without disrupting them"),
        ("Considered decisions can still end in spending", "How to measure consideration consistently"),
        ("Existing payment tools already handle some tracking", "Where Margin creates differentiated value"),
        ("Awareness is possible", "Whether awareness becomes repeated behaviour")]
page(S8,
     head("What we know, and what we still need to test", "08 / Synthesis"),
     '<div class="know"><div class="kh"><span class="lbl lbl--ev">We know enough to say</span><span class="lbl lbl--im">We still need to test</span></div>' + "".join(
         f'<div class="kr"><p>{t(a)}</p><i class="ar"></i><p>{t(b)}</p></div>' for a, b in KNOW) + "</div>")

# ============ 47
page(S9,
     band("09 / Next test", "Next test", None, '<div class="m-pullquote" style="margin-top:3mm"><p class="q">Does making the financial consequence of a proposed expense immediately visible increase financial consideration before commitment?</p><cite>Research question</cite></div>'),
     pn(kk("Test") + rh([("Baseline", "Observe relevant spending decisions."), ("Intervention", "Show current money, upcoming commitment, proposed expense and projected remaining money."),
                         ("Observe", "Notice, understand, connect, consider, decide."), ("Return", "Observe whether the behaviour happens again without prompting.")], key="Intervention"), "", "", "padding:6mm 3mm"),
     gr(pn(kk("Primary measure", "kk--w") + '<p class="hx hx--xl hx--w">Financial consideration</p>', "b", "", "display:flex;flex-direction:column;justify-content:center;padding:7mm 6mm"),
        pn('<p class="hx hx--k" style="text-align:center">Relevant decisions where financial context was noticed and incorporated into reasoning</p><div style="height:0.8mm;background:var(--m-route);margin:6mm 10mm;border-radius:1mm"></div><p class="hx hx--k" style="text-align:center">Total relevant decisions observed</p>', "y", "", "display:flex;flex-direction:column;justify-content:center;padding:9mm 6mm"),
        cols="37", cls="grow"))

page(S9,
     head("Measures and the working model", "09 / Next test"),
     gr(table(["Secondary measure", "What is recorded"], [["Notice", "Did the participant look?"], ["Understanding", "Could they explain the consequence?"], ["Connection", "Did they relate it to the purchase?"],
                                                          ["Consideration", "Did they mention a trade-off?"], ["Decision", "Changed / maintained / delayed"], ["Effort", "Steps required"], ["Time", "Time to understand"],
                                                          ["Independence", "Needed help / unaided"], ["Repeat", "Happened again without prompting"]], "dense", ["36mm", None]),
        pn(kk("Final working model") + loop(["See", "Understand", "Consider", "Decide", "Reflect", "Next\ndecision"], r=24, w=90, h=84, key="Consider"), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep);display:flex;flex-direction:column;align-items:center"),
        cols="2", cls="grow", style="grid-template-columns:1fr 100mm"),
     '<div class="m-field push" style="padding:12mm 8mm;margin:0 -18mm -24mm;border-radius:0;padding-bottom:36mm"><span class="fr" style="margin-bottom:5mm">Final statement</span><p class="big" style="margin:5mm 0 0">The goal is not less spending.<br>The goal is more conscious spending.</p></div>')

MAIN_COUNT = len(PAGES)

# ============ appendices
def ahead(n, title):
    return f'<div class="hd"><span class="tagc tagc--yellow" style="align-self:flex-start">Appendix {n}</span><h1 class="h1 m-display-xl">{t(title)}</h1></div>'


page(SA, ahead("01", "Testing protocol"),
     gr(pn(kk("Session sequence") + rv(["Consent and introduction", "Current behaviour", "Scenario / task", "Participant acts without being led", "Researcher observes", "Participant reflects",
                                         "Prototype interaction", "Decision", "Immediate documentation", ("Synthesis", "", None, "end")]), "", "cfill"),
        col(pn(kk("Facilitator", "kk--w") + chk(["Reads the task.", "Starts the clock.", "Probes.", "Does not explain, point or rescue too early."]), "b"),
            pn(kk("Notetaker") + chk(["Records timestamps.", "Records exact words.", "Records observable behaviour.", "Marks where the behaviour stalls."], open_=True), "l"),
            pn(kk("Prompt", "kk--k") + '<p class="q" style="margin:0;color:var(--m-ink)">“What would you do next?”</p><p class="small" style="margin:2mm 0 0">Use only when the participant is stuck.</p>', "y")), cols="2", cls="fill"))

A2 = [["P01", "1", "[VERIFY]", "Baseline", "Socially influenced spending", "[VERIFY]", "[VERIFY]", "[QUOTE]", "[VERIFY]"],
      ["P02", "1", "[VERIFY]", "Baseline", "Post-purchase value evaluation", "[VERIFY]", "[VERIFY]", "[QUOTE]", "[VERIFY]"],
      ["P03", "1", "[VERIFY]", "Baseline", "Mental allocation", "[VERIFY]", "[VERIFY]", "[QUOTE]", "[VERIFY]"],
      ["P04", "1", "[VERIFY]", "Baseline", "Future commitment not active", "Food decision", "Ordered", "“I knew I had the dinner on Friday.”", "Timing"],
      ["P05", "1", "[VERIFY]", "Baseline", "Calculation effort", "[VERIFY]", "[VERIFY]", "“By the time I've checked everything, the decision is already happening.”", "Ability / Timing"],
      ["P06", "1", "[VERIFY]", "Baseline", "Value-led purchase", "[VERIFY]", "[VERIFY]", "[QUOTE]", "Evaluation"],
      ["P07", "1", "[VERIFY]", "Prototype", "Prototype decision support", "Spending scenario", "Explored prototype", "“How would this help me exactly? I don't get it.”", "Timing / Experience"],
      ["P08", "1", "[VERIFY]", "Prototype", "Existing payment tracking", "Prototype", "Evaluated features", "“I use the payment app history as the source of truth.”", "Ability"],
      ["P09", "1", "[VERIFY]", "Six-day observation", "Repeated small spending", "Daily observation", "Reduced some snack/auto use", "[QUOTE]", "Awareness"],
      ["P10", "1", "[VERIFY]", "V2 prototype", "Decision moment unclear", "Spending scenario", "Questioned situation", "“When exactly am I using this app? What is the situation?”", "Timing"],
      ["P11", "1"] + ["[VERIFY]"] * 7]
STAGEW = {c: d for c, a, b, d in CREATE}
TIMEW = {"P07": "~26 min", "P09": "6 days", "P10": "~10 min"}
TASKW = {"P07": "V1 scenario", "P10": "V2 scenario", "P08": "Prototype"}
QFILL = {'P01': "“though I didn't want”", 'P03': "“it's good to have, like, buffer money.”", 'P06': '“mujhe kaafi fun product lag raha hai”', 'P09': '“I started noticing how often I was buying small things.”'}
NR = '<span class="nr">Not recorded</span>'
for r in A2:
    r[2] = "September 2026"
    if r[0] in QFILL: r[7] = QFILL[r[0]]
    if r[7] == "[QUOTE]": r[7] = "NR"
A2[-1] = ["P11", "1", "September 2026", "Inferred", "Low spontaneous engagement", "NR", "NR", "NR", "Motivation / Experience"]
page(SA, ahead("02", "Observation data format"),
     kk("Part 1 of 2: identification, context and what was observed"),
     tgrow(table(["Participant", "Round", "Date", "Method", "Current behaviour", "Task", "What they did"], [[NR if x in ("[VERIFY]", "NR") else t(x) for x in r[:7]] for r in A2], "dense", raw=True)))
page(SA, ahead("02", "Observation data format, continued"),
     kk("Part 2 of 2: what was said, stage and measures"),
     tgrow(table(["Participant", "What they said", "Stage", "Outcome", "Time", "Attempts", "Guardrail"], [[t(r[0]), NR if r[7] in ("NR", "[VERIFY]") else t(r[7]), t(STAGEW.get(r[0], r[8])), NR, (TIMEW.get(r[0]) or '<span class="nr">15 to 20 min, est.</span>'), NR, NR] for r in A2], "dense", ["18mm", "62mm", "36mm", None, "24mm", None, None], raw=True)))

SEV = {"Blocker": "tagc--red", "Drag": "tagc--yellow", "Noise": "tagc"}
roll = [("Use situation unclear", "2+", "Timing / Experience", "A", "Blocker / Drag", "Reframe around decision moment"),
        ("Potential spending not prominent", "1+", "Experience", "P / A", "Drag", "Make consequence central"),
        ("Manual transaction entry", "3", "Ability", "A", "Drag", "Explore automatic capture"),
        ("Actual vs estimated unclear", "1", "Experience", "A", "Drag", "Separate states visually"),
        ("Progress bar implied goal", "1", "Experience", "A", "Drag", "Remove progress metaphor"),
        ("Updated amount unclear", "1", "Ability", "A", "Drag", "Clarify remaining amount"),
        ("Navigation congested", "1", "Experience", "A", "Drag", "Separate major functions"),
        ("New Plan interaction failure", "1", "Ability", "A", "Blocker", "Fix prototype"),
        ("Pattern information not actionable", "1+", "Evaluation", "A", "Noise / Drag", "Attach pattern to action"),
        ("User wants system to decide", "0", "—", "—", "—", "No evidence; maintain agency")]
rrows = [[a, f'<span class="hx">{t(b)}</span>', t(c), t(d), "".join(f'<span class="tagc {SEV.get(x.strip(), "tagc")}" style="margin:0 1mm 1mm 0">{x.strip()}</span>' for x in e.split("/")) if e != "—" else MARK["—"], t(f)] for a, b, c, d, e, f in roll]
FEAT = [("Monthly spending", "P07 understands it", "Useful contextual information"), ("Categories", "P07 understands them", "Supporting information, not core intervention"),
        ("Patterns", "P07, P08", "Useful when actionable"), ("Upcoming plans", "P07, P08, P10", "Strong contextual value"),
        ("Potential spending", "P07, P08, P10", "Strong decision-support direction"), ("Spending limits", "P08", "Useful when user-defined"),
        ("Automatic transaction capture", "P07, P08, P10", "Strong infrastructure requirement"), ("Manual transaction entry", "P07, P08, P10", "Repeated friction"),
        ("Money-owed reminders", "Earlier research", "Useful social-financial context"), ("Notifications", "Prototype requirement", "Should be tested rather than assumed effective"),
        ("Chatbot logging", "P10", "Attractive because it matches an existing conversational behaviour"), ("Payment-app integration", "P08, P10", "Strong opportunity, technically unresolved"),
        ("Progress bar", "P10", "Problematic metaphor"), ("Historical transaction ledger", "P08", "Low differentiation for users already tracking elsewhere")]
page(SA, ahead("03", "Feature evidence"),
     tgrow(table(["Feature or mechanism", "Evidence", "Working conclusion"], [[f'<b style="color:var(--m-blue);font-weight:600">{t(a)}</b>', t(b), t(c)] for a, b, c in FEAT], "dense", ["50mm", "44mm", None], raw=True)))

page(SA, ahead("04", "Change log"),
     pn(lbl("ev") + chk(["P04 demonstrates that a known future commitment can fail to become part of the current decision.", "P05 demonstrates that retrieving financial context can require too much calculation.",
                         "P07 identifies potential spending as the most useful decision-support interaction.", "P08 demonstrates that transaction history already exists elsewhere and future planning creates more differentiation.",
                         "P10 asks for a clear situation in which the product is actually used."])),
     pn(lbl("fi") + '<p class="hx" style="margin-top:2mm">The common problem is not absence of financial information. It is the distance between financial information and the active spending decision.</p>', "y"),
     pn(lbl("re") + '<p class="hx hx--xl hx--w" style="margin-top:2mm">Move the personally relevant financial consequence into the active spending moment.</p>'
        + '<p class="tx" style="margin:3mm 0 0">Instead of requiring the user to navigate, retrieve, remember, calculate and compare, the system directly shows current money, the relevant upcoming commitment and the proposed expense, and the projected remainder.</p>', "b"),
     gr(pn(kk("Prediction") + tx("The participant will understand the financial consequence with fewer retrieval and calculation steps and will be more likely to mention it as part of the decision.")),
        pn(kk("Falsifier") + tx("The participant does not notice the consequence, cannot explain it, requires the same retrieval process, or treats the consequence as irrelevant."), "d"), cols="2"))

page(SA, ahead("05", "Outcomes"),
     kk("Decision outcome categories"),
     gr(*[pn(hx(a, "hx--w" if a == "Conscious maintain" else "") + f'<p class="tx" style="margin:2mm 0 0{";color:var(--m-paper)" if a == "Conscious maintain" else ""}">{t(b)}</p>', "b" if a == "Conscious maintain" else "")
          for a, b in [("Changed", "Decision moved from original choice"), ("Modified", "Amount or alternative changed"), ("Delayed", "Decision postponed"),
                       ("Declined", "Purchase abandoned"), ("Maintained", "Original decision retained"), ("Conscious maintain", "Original decision retained after explicit financial consideration")]], cols="3", cls="gr-s grow"),
     pn(kk("Important", "kk--k") + '<p class="hx hx--xl hx--k">Maintained does not equal failed.</p><p class="tx" style="margin:2mm 0 0">A maintained decision can still demonstrate consideration.</p>', "y", "push", "padding:8mm 7mm"))

days = [pn(kk("Day 1") + '<div class="tx">' + "".join(f"<p>{t(x)}</p>" for x in ["Time to complete: ______", "Attempts: ______", "Unaided: ______", "What cued the behaviour: ______"]) + "</div>", "b")]
days += [pn(kk(f"Day {d}") + '<div class="tx">' + "".join(f"<p>{t(x)}</p>" for x in ["Did it happen: ______", "What brought them to it: ______", "How known: ______"]) + "</div>") for d in range(2, 6)]
days += [pn(kk("Day 6", "kk--k") + '<div class="tx">' + "".join(f"<p>{t(x)}</p>" for x in ["Did it happen without prompting: ______", "Time taken: ______", "Compared with Day 1: Faster / Same / Slower",
                                                                                          "What cued it: Design / Participant's own reminder / Researcher presence / Other"]) + "</div>", "y")]
page(SA, ahead("06", "Repeat probe"), pn('<p class="small" style="margin:0">No repeat-probe data is in the current archive. This is the template for the next round.</p>', "d"), gr(*days, cols="3", cls="gr-s"))

page(SA, ahead("07", "Loop log"), pn('<p class="small" style="margin:0">No loop-log data is in the current archive. This is the template for the next round.</p>', "d"),
     gr(pn(kk("Trigger") + '<div class="tx"><p><b>P</b> app prompt</p><p><b>W</b> something in the environment</p><p><b>M</b> participant\'s own thought or feeling</p></div>'),
        pn(kk("Action") + '<div class="tx"><p><b>D</b> did it</p><p><b>H</b> half did it</p><p><b>N</b> did not do it</p></div>'),
        pn(kk("Feeling") + '<div class="tx"><p><b>G</b> good</p><p><b>F</b> flat</p><p><b>B</b> bad</p></div>'), cols="3", cls="gr-s"),
     '<div>' + kk("Entry format") + frost(["MDG bored", "PDF tired", "WHG on the bus"], "fr--k") + "</div>",
     tgrow(table(["Date", "Time", "Entry exactly as sent", "Trigger", "Action", "Feeling"], [["", "", "", "P / W / M", "D / H / N", "G / F / B"]] * 12, "dense")))

page(SA, ahead("08", "Final evidence rules"),
     gr(pn('<span class="ev ev--obs">Observed</span><p class="hx" style="margin-top:3mm">Something the participant actually did.</p>'),
        pn('<span class="ev ev--sta">Stated</span><p class="hx" style="margin-top:3mm">Something the participant said.</p>'),
        pn('<span class="ev ev--inf">Inferred</span><p class="hx" style="margin-top:3mm">An interpretation based on evidence.</p>'),
        pn('<span class="ev ev--unk">Unknown</span><p class="hx" style="margin-top:3mm">Something the current research does not establish.</p>', "d"), cols="2", cls="gr-s grow"),
     pn(kk("Claims should always be traceable") + rh(["Claim", "Insight", "Observation", "Quote / action", "Source record"], key="Source record"), "", "push", "padding:7mm 3mm"))

ver = [("P01 raw record", "[VERIFY]"), ("P02 raw record", "[VERIFY]"), ("P03 raw record", "[VERIFY]"), ("P04 raw record", "[VERIFY]"), ("P05 raw record", "[VERIFY]"),
       ("P06 raw record", "[VERIFY]"), ("P07 complete transcript", "Available / verify"), ("P08 complete transcript", "Available / verify"), ("P09 six-day record", "Available / verify"),
       ("P10 complete V2 transcript", "Available / verify"), ("P11 complete record", "Working inference only"), ("Round 1 counts", "Not in archive"),
       ("Round 2 counts", "Not in archive"), ("Exact dates", "September 2026, day-level not recorded"), ("Exact task wording", "Reconstructed, page 12"), ("Pass criteria", "Retrospective framework, page 13"),
       ("CREATE classification", "Working classification, page 45"), ("M/A/P classification", "Working classification, page 45"), ("Severity", "Working classification, page 48"), ("Repeat-probe data", "Not in archive"), ("Loop-log data", "Not in archive")]
page(SA, ahead("09", "Source verification list"),
     gr(col(kk("Before final export, verify"), tgrow(table(["Item", "Status"], ver, "dense", [None, "44mm"]))),
        pn(kk("Testing kit requirements", "kk--w") + '<p class="tx" style="color:var(--m-paper);margin:0">The testing kit requires the target action, CREATE stage, task, pass criteria and riskiest assumption to be set before testing; it then requires observable break roll-up, CREATE, M-A-P and severity tagging, one change, a pre-written prediction and falsifier, and a separate repeat-behaviour probe.</p>', "b"), cols="73", cls="grow"))

# ------------------------------------------------------------------ cover and contents
SECS = [("01", "From research to testing", S1), ("02", "Testing framework", S2), ("03", "Baseline behaviour", S3), ("04", "Participant evidence", S4),
        ("05", "Cross-participant analysis", S5), ("06", "Prototype breaks", S6), ("07", "Iteration", S7), ("08", "Synthesis", S8), ("09", "Next test", S9), ("A", "Appendices", SA)]
TONES = ["#2E36A1", "#45A2FB", "#7A80C9", "#F33F31", "#FFDD50", "#1D2270", "#B5B9E3", "#302D40", "#45A2FB", "#EDF1F4"]


def pages_of(sec):
    idx = [i + 3 for i, p in enumerate(PAGES) if f'data-sec="{sec}"' in p]
    return idx


rows = []
tiles = ['<span style="background:#2E36A1;color:#fff">01</span>', '<span style="background:#2E36A1;color:#fff">02</span>']
for (n, name, sec), tone in zip(SECS, TONES):
    idx = pages_of(sec)
    first = re.search(r'<h1 class="h1 m-display-xl"[^>]*>(.*?)</h1>', PAGES[idx[0] - 3]).group(1)
    rows.append(f'<li><span class="n">{n}</span><span class="t">{t(name)}<span class="d">{first}</span></span><span class="p">{idx[0]:02d} to {idx[-1]:02d}</span></li>')
    ink = "#302D40" if tone in ("#FFDD50", "#EDF1F4", "#B5B9E3", "#45A2FB") else "#FFFFFF"
    tiles += [f'<span style="background:{tone};color:{ink}">{i:02d}</span>' for i in idx]
contents = ('<section class="pg" data-sec="Contents"><div class="ct v2">' + head("Contents")
            + '<div class="gr" style="grid-template-columns:1fr 58mm;gap:10mm;flex:1"><ol class="toc">' + "".join(rows) + "</ol>"
            + f'<div>{kk("Every page, coloured by section")}<div class="tiles" style="grid-template-columns:repeat(6,1fr)">' + "".join(tiles) + "</div></div></div></div></section>")

cover = """<section class="pg pg--field cover" data-bare>
  <div class="abs" style="left:18mm;top:16mm;right:18mm;display:flex;justify-content:space-between"><span class="fr">User testing and behavioural research</span><span class="fr">2026</span></div>
  <div class="abs" style="left:18mm;top:38mm;width:96mm">
    <p class="big" style="margin:0;color:var(--m-paper)">Margin</p>
    <p class="mid" style="margin:3mm 0 0;color:var(--m-paper)">Testing what happens between knowing and spending</p>
  </div>
  <div class="abs" style="left:112mm;top:36mm;width:52mm;transform:rotate(-5deg)"><div class="ph" style="box-shadow:0 0 0 1mm rgba(255,255,255,0.3)"><img src="shots/v2-home.jpg" alt=""></div></div>
  <div class="abs" style="left:146mm;top:66mm;width:48mm;transform:rotate(6deg)"><div class="ph" style="box-shadow:0 0 0 1mm rgba(255,255,255,0.3)"><img src="shots/v2-result.jpg" alt=""></div></div>
  <div class="abs" style="left:18mm;top:84mm;width:88mm">
    <span class="fr fr--y">Research question</span>
    <p class="q" style="margin:4mm 0 0;color:var(--m-paper)">Can making financial consequences visible at the moment of spending make spending decisions more conscious?</p>
  </div>
  <div class="abs" style="left:0;right:0;bottom:0;height:78mm;background:var(--m-paper);border-radius:8mm 8mm 0 0;padding:9mm 18mm;box-sizing:border-box">
    <span class="kk">Method</span>
    <div class="rh2" style="grid-template-columns:repeat(5,1fr);margin-top:4mm">
      <div><b>6-day spending observation</b></div><div><b>Scenario-based testing</b></div><div class="key"><b>Prototype testing</b></div><div><b>Behavioural analysis</b></div><div><b>Iteration</b></div>
    </div>
    <p class="small" style="position:absolute;left:18mm;right:18mm;bottom:10mm;margin:0;color:var(--m-blue);opacity:0.6;display:flex;justify-content:space-between"><span>Confidential. Participants are shown by code only, P01 to P11.</span><span>Screens: Margin prototype V2, repository capture, sample names replaced.</span></p>
  </div>
</section>"""

HEAD = """<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Margin testing report</title>
<link rel="stylesheet" href="../css/fonts.css">
<link rel="stylesheet" href="../css/tokens.css">
<link rel="stylesheet" href="../css/margin.css">
<link rel="stylesheet" href="../css/components.css">
<link rel="stylesheet" href="report.css">
<style>
  .toc { list-style: none; margin: 0; padding: 0; }
  .toc li { display: grid; grid-template-columns: 11mm 1fr auto; align-items: baseline; gap: 3mm; padding: 3.2mm 0; border-top: 0.2mm solid var(--m-paper-deep); }
  .toc li:last-child { border-bottom: 0.2mm solid var(--m-paper-deep); }
  .toc .n { font: 400 13.5pt/1 var(--m-font-display); color: var(--m-route); }
  .toc .t { font: 400 13.5pt/1.15 var(--m-font-display); color: var(--m-blue); word-spacing: 0.08em; }
  .toc .d { display: block; font: 400 8.5pt/1.35 var(--m-font-text); color: var(--m-black-85); margin-top: 1mm; word-spacing: 0; }
  .toc .p { font: 600 8.5pt/1 var(--m-font-text); color: var(--m-blue); letter-spacing: 0.03em; white-space: nowrap; }
</style>
</head>
<body class="m-paper">
"""
TAIL = """
<script src="../js/route.js"></script>
<script src="report.js"></script>
</body>
</html>
"""

doc = HEAD + cover + contents + "\n".join(PAGES) + TAIL
doc = doc.replace(">—<", '><i class="mk mk--none"></i><')
assert "—" not in doc and "·" not in doc, "em dash or middle dot in rendered text"
OUT.write_text(doc)
print(f"{len(PAGES) + 2} pages, main report {MAIN_COUNT + 2}")
