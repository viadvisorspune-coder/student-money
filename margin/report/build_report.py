"""Builds report.html: the Margin user testing kit (client's final content, P01 to P11).

Words are the client's, carried over as written, with em dashes and middle dots
replaced by commas or colons (a Margin text rule). The appendices are not built.
Layout, colour and type come from the Margin design system; helpers are in rlib.py.
Run:
    python3 margin/report/build_report.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from rlib import *  # noqa: F401,F403
from rlib import PAGES, page, head, band, MARK

OUT = Path(__file__).with_name("report.html")

SQ, SA_, SB, SC, SD, SE, SF, SG, SH, SI, SX = (
    "The research question", "A  What we are testing", "B  The method", "C  The participants", "D  What we found",
    "E  What broke", "F  The change", "G  Does the behaviour come back", "H  Synthesis", "I  The next test", "Field guide")


def strong(s, cls=""):
    """The one statement a page exists to make."""
    return ins(s, cls=cls)


def q1(s, cite):
    return qcards([s], 1, "", True, cite)


def qs(items, cite, cols=1, cls=""):
    return qcards(items, cols, "", False, cite, cls)


def numbered(items, start=1):
    return '<ol class="nlist">' + "".join(f'<li><span class="nn">{i + start}</span><span>{t(x)}</span></li>' for i, x in enumerate(items)) + "</ol>"


def ptag(code):
    return f'<span class="cd-s">{code[1:]}</span>'


def phead(code, title, eyebrow, meta):
    return (f'<div class="pid"><span class="cd">{code}</span><div><span class="eyebrow m-kicker" style="margin:0 0 1.4mm">{t(eyebrow)}</span>'
            f'<h1 class="h1 m-display-xl">{t(title)}</h1><div class="meta"><span class="tagc tagc--blue">{t(meta)}</span></div></div></div>')


# ================================================================== the research question
page(SQ,
     band("The research question", "Can making financial consequences visible at the moment of spending make spending decisions more conscious?"),
     gr(tx("The project started as a tracking problem. The research showed that the deeper problem was about decisions.",
           "Students already think about money in many ways: mental budgets, rough balances, future plans, spending limits, social situations, value, convenience and reflection after buying. The problem was not missing information. The problem was that people did not use that information when making the decision."),
        pn(kk("Students already think about money through") + chips(["Mental budgets", "Rough balances", "Future plans", "Spending limits", "Social situations", "Value", "Convenience", "Reflection after buying"], "m-chip--sky")),
        cols="2"),
     gr(pn(kk("A student can") + hx("Know about a future expense") + '<p class="tx" style="margin:2mm 0 0">and still spend differently today.</p>'),
        pn(kk("A student can") + hx("Know their balance") + '<p class="tx" style="margin:2mm 0 0">and still not work out what a purchase will mean.</p>'),
        pn(kk("A student can") + hx("Notice that they spend often") + '<p class="tx" style="margin:2mm 0 0">and still decide that something was worth buying.</p>'),
        cols="3", cls="gr-s"),
     '<p class="hx hx--xl">This moved the problem from <span style="color:var(--m-route)">tracking</span> to <span style="color:var(--m-route)">considering the decision</span>.</p>',
     vs(pn(kk("Before") + hx("How do we help students track their money?"), "l", "", "padding:6mm"),
        pn(kk("After", "kk--w") + hx("How do we make relevant financial information part of the spending decision?", "hx--w"), "b", "", "padding:6mm")))

# ================================================================== part A
page(SA_,
     band("Part A  /  What we are testing", "A.1  The target behaviour", None,
          '<div class="m-pullquote" style="margin-top:2mm"><p class="q">Before or during a discretionary spending decision, the participant notices relevant financial context, understands the likely consequence of the proposed expense, and uses that information as one input into the decision.</p><cite>Target behaviour</cite></div>'),
     pn(kk("Five observable steps: what counts as done") + rh([("Notice", "Looks at the financial information"), ("Understand", "Can explain what it means"), ("Connect", "Relates it to the proposed expense"),
                                                             ("Consider", "Mentions a consequence or a trade-off"), ("Decide", "Makes, maintains, modifies or delays the decision")], key="Consider"), "", "", "padding:6mm 4mm"),
     '<div>' + kk("Possible outcomes") + gr(*[pn(hx(o), "l", "pn--s") for o in ["Buy", "Buy less", "Delay", "Substitute", "Do not buy"]], cols="5", cls="gr-s", style="grid-template-columns:repeat(5,1fr)") + "</div>",
     gr(pn(kk("The sixth outcome", "kk--w") + '<p class="hx hx--xl hx--w">Buy anyway, with awareness of the consequence</p>', "b", "", "padding:7mm 6mm"),
        strong("The last outcome is also a conscious decision."), cols="2"))

page(SA_,
     head("A.2  Success criterion", "Part A  /  What we are testing"),
     gr(pn(kk("The success criterion is not") + '<p class="hx hx--xl"><span class="m-strike">“Spend less.”</span></p>', "l", "", "padding:6mm"),
        pn(kk("The desired behaviour is", "kk--k") + '<p class="hx hx--xl hx--k">Financial information becomes part of the decision before the person commits.</p>', "y", "", "padding:6mm"), cols="37"),
     gr(pn(kk("A participant shows the target behaviour when they can") + rv(["Identify their current financial position", "Identify the relevant future commitment",
                                                                           ("Understand the consequence of the proposed expense", "", None, "key"), "Connect that consequence to the current decision",
                                                                           ("Make or maintain the decision without the researcher deciding for them", "", None, "end")]), "", "cfill", "padding:6mm"),
        col(kk("Components demonstrated"),
            pn('<div class="verdict"><span class="hx hx--xl">0 to 2</span><span class="tx">Unsuccessful</span></div>', "l"),
            pn('<div class="verdict"><span class="hx hx--xl">3</span><span class="tx">Partial</span></div>', ""),
            pn('<div class="verdict"><span class="hx hx--xl hx--w">4 to 5</span><span class="tx">Successful</span></div>', "b"), gap="3mm"), cols="2"),
     gr(col(tx("A participant who sees the consequence and still buys has not failed the intervention. The information still became part of the decision."),
            q1("I know this leaves me with less, but I still want to go.", "Example")),
        pn('<p class="hx hx--xl hx--w">Maintained is not failed.</p>', "r", "", "display:flex;align-items:center;justify-content:center;padding:8mm"), cols="73"))

secq = [("Timing", "When is financial information most relevant?"), ("Relevance", "Is the consequence of a proposed expense more useful than historical spending?"),
        ("Cognitive effort", "How much work does the user do to understand their position?"), ("Context", "What happens when social or emotional context is stronger than financial context?"),
        ("Agency", "Do users want information, prompts and flags rather than enforced restriction?"), ("Persistence", "Does awareness carry into later decisions?")]
page(SA_,
     head("A.3  Secondary questions  /  A.4  The riskiest assumptions", "Part A  /  What we are testing"),
     gr(*[pn(kk(a) + hx(b), "", "pn--s") for a, b in secq], cols="3", cls="gr-s"),
     gr(pn(kk("The riskiest assumptions") + numbered(["Showing financial impact will create consideration", "Users can understand the information quickly",
                                                     "Contextual information is more useful than generic totals", "The intervention can influence reasoning without controlling the user",
                                                     "The effect can carry into later decisions", "A useful feature that requires opening another app will be used"]), "l", "", "padding:6mm"),
        pn(kk("Primary risk", "kk--w") + '<p class="hx hx--xl hx--w">The information may be useful in theory but unavailable at the exact moment when the decision happens.</p>', "r", "", "display:flex;flex-direction:column;justify-content:flex-end;padding:7mm 6mm"),
        cols="2"),
     '<div>' + kk("A.5  The prep sheet") + table(["Field", "Entry"], [
         ["Target action", "Notice financial context, understand the consequence, use it as an input into a discretionary spending decision"],
         ["CREATE stage diagnosed", "<b style='color:var(--m-blue)'>Timing</b>, with Ability and Evaluation secondary"],
         ["The task, word for word", "See B.3"], ["Pass criteria", "4 of 5 behavioural components"],
         ["Riskiest assumption", "The information is unavailable at the exact moment the decision happens"]], "dense", ["46mm", None], raw=True) + "</div>")

# ================================================================== part B
page(SB,
     band("Part B  /  The method", "B.1  The structure", "The order matters. The six days showed what spending decisions look like without an interface. The walkthrough then tested whether a product could create the same effect at the right moment."),
     gr(pn('<span class="num">Round 1</span>' + hx("Six days of spending observation") + tx("Participants observed and reflected on their own spending for six days, with no prototype involved.")
           + '<div style="margin-top:4mm">' + rv(["Spend", "Record", "Reflect", ("Notice patterns", "", None, "key"), ("Next decision", "", None, "end")]) + "</div>"),
        pn('<span class="num">Final day</span>' + hx("Prototype walkthrough", "hx--w") + '<div class="tx" style="color:var(--m-paper)"><p>Participants worked through the app as if in a real spending situation.</p></div>'
           + '<div class="stack" style="margin-top:4mm">' + "".join(f'<div class="wk"><span class="cd-s" style="background:var(--m-paper);color:var(--m-blue)">{c[1:]}</span><span>{t(d)}</span></div>'
                                                                  for c, d in [("P07", "V1, about 26 minutes"), ("P10", "V2, about 10 minutes"), ("P08", "Evaluating against the payment app they already use")]) + "</div>", "b"),
        cols="2"),
     pn(kk("Round 1 asked seven questions") + '<div class="q7">' + "".join(f'<div><span class="nn">{i + 1}</span><span>{t(x)}</span></div>' for i, x in enumerate(
         ["What happened?", "What was spent?", "Why was it spent?", "What did the participant intend beforehand?", "Was there a future commitment?", "What did the participant notice afterwards?", "Did anything change?"])) + "</div>"))

page(SB,
     head("B.2  Roles", "Part B  /  The method", "Use two researchers per session, never three. A participant surrounded by a panel can feel like they are being examined. Swap roles so everyone does both jobs."),
     *[gr(pn(f'<p class="hx hx--xl">{t(r)}</p>', "b" if r == "Facilitator" else "", "", "display:flex;align-items:center"),
          pn(kk("Does") + chk(does)), pn(kk("Never does") + '<ul class="xlist">' + "".join(f"<li>{t(x)}</li>" for x in never) + "</ul>", "l"),
          cols="3", cls="gr-s", style="grid-template-columns:40mm 1fr 1fr") for r, does, never in [
         ("Facilitator", ["Reads the consent script and the task.", "Starts the clock.", "Probes.", "Sits slightly to the side, not opposite."], ["Helps.", "Explains.", "Points.", "Fills a silence."]),
         ("Notetaker", ["Writes on the observation sheet in real time.", "Records timestamps.", "Captures exact words in quote marks.", "Marks the CREATE stage where things stall."],
          ["Interprets during the session.", "Joins the conversation.", "Writes “user was confused” instead of what the user did."])]],
     '<div>' + kk("B.6  Session sequence") + '<div class="seq">' + "".join(f'<div><span class="nn">{i + 1:02d}</span><span>{t(x)}</span></div>' for i, x in enumerate(
         ["Consent and introduction", "Current behaviour", "Scenario and task", "Participant acts without help", "Researcher observes", "Participant reflects",
          "Prototype interaction", "Decision", "Immediate notes", "Synthesis"])) + "</div></div>")

page(SB,
     head("B.3  The task", "Part B  /  The method", "A good task describes a situation the person recognises, says what they need to decide, and does not tell them how to do it."),
     q1("Imagine that you are about to make a discretionary purchase. You already have some spending behind you and at least one future expense coming up. Work through the situation as you normally would and decide whether you would still make the purchase.", "General"),
     gr(qs(["You are deciding whether to spend on a social activity while already knowing that another expense is coming up later in the week. Use the prototype as you would if this were your own decision."], "V1 scenario"),
        qs(["You are about to spend money on an activity with a friend. You have a limited amount of money available and another expense coming up. Use the prototype to understand what the proposed purchase would leave you with, then decide whether you would still spend it."], "V2 scenario"), cols="2"),
     '<div>' + kk("Why written this way") + table(["Weak task", "Why it fails", "What we use"], [
         ['<span class="m-strike">“Try the potential spending feature.”</span>', "Names the control, so it tests eyesight, not behaviour", "<b style='color:var(--m-blue)'>“Do whatever you would normally do.”</b>"],
         ['<span class="m-strike">“What do you think of this screen?”</span>', "Asks for an opinion about a screen, not a behaviour", "<b style='color:var(--m-blue)'>A situation and a decision to make</b>"],
         ['<span class="m-strike">“Would you use this daily?”</span>', "Asks a future self, who is optimistic and polite", "<b style='color:var(--m-blue)'>“When did you last do this for real? Walk me through it.”</b>"]],
         "dense", ["50mm", None, "58mm"], raw=True) + "</div>")

page(SB,
     head("B.4  The consent script", "Part B  /  The method", "Read word for word, once, at the start of every session."),
     '<div class="script">' + "".join(f"<p>{t(p)}</p>" for p in [
         "Thanks for doing this. This is a rough prototype I built for a class project, so it is half broken by design and none of this is a test of you. If something goes wrong it is my fault, not yours, and that is exactly the useful part.",
         "I am going to give you a situation and then mostly stay quiet while you try it. It helps me a lot if you say what you are thinking out loud as you go, even if it is “I have no idea what this is.”",
         "My teammate is writing notes. We will not use your name. Nothing you say here goes to anyone outside my class team and our tutor. You can stop at any point, skip anything, or ask me to delete the notes afterwards, and that is completely fine.",
         "Is that alright? … And is it alright if I record just the audio, so I do not have to scribble? I can leave that off if you would rather."]) + "</div>",
     gr(pn(kk("It sets up") + chk(["It is the prototype that is being tested, not them", "Thinking out loud", "Anonymity and who sees the notes", "The right to stop, skip or delete"])),
        pn(kk("It is said once") + hx("After this, never apologise for the prototype again. It trains the participant to be gentle with you."), "l"), cols="2"))

dont = [("“Was that easy?”", "Offers them the word “easy” and most people take it out of politeness", "Nothing. You watched. You already know how long it took."),
        ("“Do you like it?”", "Collects an opinion about your feelings, not a fact about their behaviour", "“What would you have done here if I was not sitting next to you?”"),
        ("“So you did not see the button?”", "Puts your diagnosis in their mouth, and they will agree with it", "“Tell me what you were looking for.”"),
        ("“It is just a prototype, sorry.”", "Trains them to be gentle with you for the rest of the session", "Say it once in the consent script, then never again"),
        ("“Would you use this daily?”", "Asks a future self to make a promise", "“How many times did you do this last week?”"),
        ("“Most people click here.”", "Ends the test. You have told them the answer.", "Silence, then “what would you do next?”")]
page(SB,
     head("B.5  What you must not say", "Part B  /  The method"),
     table(["Do not say", "What it actually does", "Say instead"], [[f'<span class="m-strike" style="color:var(--m-route)">{t(a)}</span>', t(b), f"<b style='color:var(--m-blue)'>{t(c)}</b>"] for a, b, c in dont], "dense", ["46mm", None, "58mm"], raw=True),
     gr(pn(kk("The hardest thirty seconds", "kk--w") + '<p class="tx" style="color:var(--m-paper);margin:0">A participant will get stuck on something you can fix by saying four words, and they will look at you. Do not help. That stuck moment is the most expensive data you will collect all week.</p>', "b", "", "padding:6mm"),
        pn(kk("What to do instead") + rv([("Count to fifteen", ""), ("Say “what would you do next?”", "If they are still stuck, then count again", None, "key"),
                                          ("Rescue them only", "if they are visibly distressed, or after two full minutes", None, "end")])), cols="2"),
     '<div>' + kk("B.7  Document within five minutes") + '<p class="tx" style="margin:0 0 3mm">Memory fades quickly, especially for moments that did not match what you expected. Do this before you check your phone.</p>'
     + gr(*[pn(f'<span class="num">{i + 1}</span>' + tx(x), "", "pn--s") for i, x in enumerate(["Each of you says the one moment that surprised you most.",
                                                                                             "Agree the point where the behaviour actually stalled, and mark the CREATE stage. If you disagree about the stage, write both down: a disagreement is information.",
                                                                                             "Note anything you did wrong as a facilitator, so the next pair does not repeat it."])], cols="3", cls="gr-s") + "</div>")

# ================================================================== part C
PART = [("P01", "Baseline observation", "Social context, spontaneous spending"), ("P02", "Baseline observation", "Value, post-purchase evaluation"),
        ("P03", "Baseline observation", "Future allocation, buffer"), ("P04", "Baseline observation", "Future commitment not salient at the decision"),
        ("P05", "Baseline observation", "Calculation effort, timing"), ("P06", "Baseline observation", "Utility, novelty, perceived value"),
        ("P07", "V1 walkthrough, about 26 min", "Consequence, potential spending, agency"), ("P08", "Prototype session", "Existing payment tracking, future planning"),
        ("P09", "Six-day self-observation", "Repeated small-spend awareness"), ("P10", "V2 walkthrough, about 10 min", "Decision moment, friction, automation"),
        ("P11", "Behavioural pattern", "Low spontaneous engagement")]
MTONE = {"Baseline observation": "tagc", "Six-day self-observation": "tagc tagc--yellow", "Behavioural pattern": "wtag"}
page(SC,
     band("Part C  /  The participants", "Eleven codes, ten records", "Participants are shown by code only."),
     table(["ID", "Method", "Main behavioural signal"], [[f'<span class="cd-s{" cd-o" if c == "P11" else ""}">{c[1:]}</span>', f'<span class="{MTONE.get(m, "tagc tagc--blue")}">{t(m)}</span>', f"<span class='tx'>{t(s)}</span>"] for c, m, s in PART],
           "dense", ["12mm", "60mm", None], raw=True),
     gr(pn('<p class="nbig">10</p><p class="tx" style="margin:2mm 0 0">The counts in this document are based on ten records.</p>'),
        pn('<p class="nbig" style="color:var(--m-stone)">P11</p><p class="tx" style="margin:2mm 0 0">A behavioural pattern based on repeated friction and adoption concerns in P07, P08 and P10. It is treated as a pattern, not as an extra record.</p>', "d"), cols="2"))

# ================================================================== part D
DOT = '<span class="dot"></span>'
page(SD,
     band("Part D  /  What we found", "D.1  The six days", "Before the study, P09 bought snacks from vending machines or nearby stores at least twice a day and used autos regularly."),
     gr(col(pn(kk("Before: at least twice a day") + '<div class="days">' + "".join(f'<div>{DOT}{DOT}<span>Day {d}</span></div>' for d in range(1, 7)) + "</div>"),
            yn_table([("Snack purchases reduced", "Yes"), ("Some spontaneous purchases avoided", "Yes"), ("Some autos avoided", "Yes"),
                      ("Accumulation more noticeable", "Yes"), ("Financial awareness increased", "Yes")], ("Over six days of recording", ""))),
        qs(["I started noticing how often I was buying small things.", "Because once I saw all the small purchases together, it felt like more.",
            "I knew I bought snacks, but I wasn't thinking about how often.", "It made me more aware before doing it.", "Oh shit, I will be spending more money."], "P09"), cols="2"),
     strong("The meaningful change was in salience. The participant did not suddenly discover the existence of snacks or autos. They discovered the frequency."))

page(SD,
     head("Salience, not a warning", "Part D  /  What we found", "It did not need a warning, restriction, score or budget. The participant simply noticed something that was already happening."),
     '<div class="words" style="gap:2mm">' + "".join(f'<span class="m-chip"><span class="m-strike">{x}</span></span>' for x in ["Warning", "Restriction", "Score", "Budget"]) + "</div>",
     vs(pn('<p class="hx hx--xl">Knowledge</p>' + tx("Knowing something happens"), "l", "", "padding:8mm 6mm"),
        pn('<p class="hx hx--xl hx--w">Salience</p><div class="tx" style="color:var(--m-paper)"><p>Seeing it while it matters</p></div>', "r", "", "padding:8mm 6mm")),
     strong("A small transaction becomes psychologically significant when the pattern becomes visible.", cls=""),
     pn(kk("This led to the question tested in the walkthrough", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">Can a product make the same pattern noticeable at the moment of spending, without making the user calculate everything?</p>', "b", "", "padding:7mm 6mm"),
     '<div>' + kk("D.2  A spending event is not a transaction") + '<p class="tx" style="margin:0 0 3mm">A transaction records an amount, time and merchant. A spending decision includes much more.</p>'
     + gr(pn('<span class="kk">A transaction records</span><p class="hx hx--xl">₹ amount</p><p class="small" style="margin:1mm 0 0">time, merchant</p>', "l"),
          pn(kk("The key question", "kk--k") + '<p class="hx hx--k">What financial information was actually part of the decision when it happened?</p>', "y"), cols="37") + "</div>")

page(SD,
     head("The decision episode", "Part D  /  D.2  A spending event is not a transaction"),
     gr(pn(rv([("Context", "Where, with whom, what is happening"),
               ("Immediate trigger", "", ["Hungry", "Friend suggested it", "Need something", "Running late"]),
               ("Personal value", "", ["Useful", "Fun", "Worth it", "Convenient", "Comfortable"]),
               ("Financial reality", "", ["Current money", "Past spending", "Future commitment"]),
               ("Trade-off", "What changes if I spend this?", None, "key"), "Decision", ("Reflection", "", None, "end")]), "", "cfill", "padding:7mm 6mm"),
        col(pn(kk("Where Margin acts", "kk--w") + '<p class="hx hx--w">Between financial reality and the trade-off: the last point where information can still enter the decision.</p>', "b", "", "padding:6mm"),
            pn(kk("The key question") + '<p class="q" style="margin:0">What financial information was actually part of the decision when it happened?</p>', "l", "", "flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:6mm")),
        cols="2", style="grid-template-columns:1.25fr 1fr"))

base = [("P01", "The social situation created the spending opportunity; intention came second", ["though I didn't want", "I wasn't, like, thinking about getting it in the first place, but, like, I got."]),
        ("P02", "Financial evaluation happened after the purchase, not before", ["was it worth it?"]),
        ("P03", "Strong existing mental allocation across today, tomorrow, future needs, unexpected costs and goals", ["it's good to have, like, buffer money."]),
        ("P04", "A known future commitment was not active during the current decision", ["I knew I had the dinner on Friday."]),
        ("P05", "Retrieval and calculation took longer than the decision itself", ["By the time I've checked everything, the decision is already happening."]),
        ("P06", "Perceived value overrode financial caution", ["mujhe kaafi fun product lag raha hai"])]
page(SD,
     head("D.3  The baseline records", "Part D  /  What we found", "Six records, six different reasons a purchase happened."),
     '<div class="brec">' + "".join(
         f'<div class="br"><span class="cd">{c}</span><p class="hx">{t(w)}</p><div>{"".join(f"<p class=q2>“{t(x)}”</p>" for x in qq)}'
         f'{"<span class=note>The recurring question</span>" if c == "P02" else ""}</div></div>' for c, w, qq in base) + "</div>")

in_out = ('<div class="inout"><div class="in">' + kk("Inside the decision", "kk--w") + frost(["Food", "Hunger", "Friends", "Immediate comfort"]).replace('class="words"', 'class="words" style="justify-content:center"') + "</div>"
          '<div class="out">' + kk("Outside the decision") + chips(["Friday dinner", "Future spending", "Later consequences"]).replace('class="words"', 'class="words" style="justify-content:center"') + "</div></div>")
page(SD,
     phead("P04", "The central finding of the baseline", "Part D  /  D.3  The baseline records", "Baseline observation"),
     gr(col(pn(kk("Timeline") + rh([("Friday", "Dinner planned, known"), ("Wednesday", "Mess food bad, hungry, friends suggest ordering")], key="Wednesday"), "", "", "padding:6mm 4mm"),
            q1("I knew I had the dinner on Friday.", "P04"),
            q1("at that moment I was just thinking about what I wanted to eat tonight.", "P04")),
        in_out, cols="2"),
     tx("The future expense was not forgotten. It just was not part of the decision at that moment."),
     '<div class="hero"><p>Known does not mean considered.</p></div>')

page(SD,
     phead("P03", "And the other direction", "Part D  /  D.3  The baseline records", "Baseline observation"),
     tx("P03 shows the opposite. Being financially aware does not always mean spending less. It can mean choosing a different option."),
     q1("I'm glad that I didn't spend some extra money in my day visitor on a really fancy lunch because then I could accommodate fees for this.", "P03"),
     '<div>' + kk("Examples") + gr(*[pn(f'<span class="num">{i + 1}</span>' + hx(x), "y" if i == 3 else "", "", "min-height:30mm") for i, x in enumerate(["Cheaper food", "Walking instead of transport", "Cutting another discretionary expense", "Protecting a buffer"])], cols="4", cls="gr-s") + "</div>",
     vs(pn(kk("Not") + hx("Whether a person compromises"), "l"), pn(kk("But", "kk--w") + hx("Where a person compromises", "hx--w"), "b")),
     strong("Financial consciousness can change where a person compromises rather than whether they compromise.", cls=""))

page(SD,
     phead("P07", "The information was clear. Its purpose was not.", "Part D  /  D.4  The walkthrough", "V1 walkthrough, about 26 min"),
     gr(col(tx("The participant understood monthly spending, categories, patterns, future plans and potential spending."),
            q1("How would this help me exactly? I don't get it.", "P07"),
            kk("Then the potential-spending interaction"),
            qs(["This thing I think is very nice.", "You can see what your account will look like.", "It shows you what it will look like if you're going to spend this amount.",
                "I think this is the highlight of the app."], "P07", 2)),
        phone("v1-result.jpg", "V1 potential spend, prototype-v1.html. Sample names replaced."), cols="2", style="grid-template-columns:1fr 50mm"),
     qs(["I want to know if the amount aligns with my spendings for this date and whether I should actually go ahead and spend this amount or not."], "P07"),
     vs(pn(kk("Historical information") + '<p class="hx hx--xl">What happened?</p>', "l"), pn(kk("Potential spending", "kk--w") + '<p class="hx hx--xl hx--w">What happens if I do this?</p>', "b")),
     strong("The prototype became more useful when it showed the consequence, not just the information.", cls=""))

page(SD,
     phead("P07", "How far the product should go", "Part D  /  D.4  The walkthrough", "V1 walkthrough, about 26 min"),
     qs(["Obviously you wouldn't want an app to dictate your financial decisions.", "A flag basically to tell you.", "Like a provoking question or something.", "Some kind of alert… it makes them conscious."], "P07", 2),
     pn(rh(["Show information", "Ask a question", "User decides"], key="User decides"), "b", "", "padding:9mm 4mm"),
     strong("The system should help people think about the decision without making the decision for them.", cls=""),
     gr(pn(kk("Not") + '<p class="hx"><span class="m-strike">A command</span></p>', "l"), pn(kk("Not") + '<p class="hx"><span class="m-strike">Enforced restriction</span></p>', "l"),
        pn(kk("But", "kk--k") + '<p class="hx hx--k">A flag, a question, an alert</p>', "y"), cols="3", cls="gr-s"))

page(SD,
     phead("P08", "The existing tool", "Part D  /  D.5  The walkthrough", "Prototype session"),
     gr(col(tx("P08 already used a payment app as the main source of truth for:"),
            gr(*[pn(hx(x), "", "pn--s") for x in ["Transaction history", "Money in and out", "Payment descriptions", "Groups and splits"]], cols="2", cls="gr-s")),
        qs(["Most transactions are UPI.", "I use the payment app history as the source of truth.", "I don't think I would manually enter everything."], "P08"), cols="2"),
     strong("A separate product does not add value just by copying transaction history.", cls=""),
     pn(kk("What P08 did want: setting their own limits") + stackbar(24000, [("Trip", 18000, "#2E36A1"), ("Self-set limit", 6000, "#FFDD50")], w=164), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep)"),
     qs(["I've used spending limits when a big expense is coming.", "If I'm going on a trip and it costs ₹18,000 and I have ₹24,000, I can set a ₹6,000 limit.",
         "I would set my own limit.", "I don't want the app to enforce it.", "If a big transaction is coming, maybe it should prompt me to spend less on food."], "P08", 3))

page(SD,
     phead("P08", "Accumulation, and patterns that say what to do", "Part D  /  D.5  The walkthrough", "Prototype session"),
     q1("Two hundred rupees doesn't feel like much. Fourteen thousand at one place feels like a lot.", "P08"),
     pn(kk("The two amounts, drawn to scale by area") + area_pair(200, 14000, "One spend", "At one place"), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep)"),
     gr(pn(rv([("One small spend", "Easy to ignore"), ("Repeated spends", "The pattern is easier to notice"), ("A large accumulated amount", "Much more noticeable", None, "end")])),
        col(qs(["Patterns are useful if they tell me what I should do."], "P08"),
            strong("A pattern is more useful when it tells the person what they can do with it.", cls="")), cols="2"),
     vs(pn(kk("The useful layer is not") + '<p class="q" style="margin:0"><span class="m-strike">Where did my money go?</span></p>', "l"),
        pn(kk("It is", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">Given what is coming, how much room do I have?</p>', "b")))

page(SD,
     phead("P10", "When would I actually use this?", "Part D  /  D.6  The walkthrough", "V2 walkthrough, about 10 min"),
     gr(col(qs(["When exactly am I using this app? What is the situation?", "Don't tell me the features. In which situation am I using the app?",
                "Is this something I open at home while I'm idle or while I'm spending with friends?"], "P10"),
            pn(tx("The strongest criticism was not about the visuals. The participant was asking:") + '<p class="hx" style="margin-top:2mm">When and where would I actually use this product?</p>', "l"),
            kk("On the progress bar"),
            qs(["The progress bar is misleading.", "Usually a progress bar means a goal. My goal will be to fill it."], "P10", 2)),
        phone("v2-result.jpg", "V2 result with the progress bar, prototype-v2.html."), cols="2", style="grid-template-columns:1fr 50mm"),
     strong("The progress bar suggested the opposite of the intended behaviour.", cls=""))

page(SD,
     phead("P10", "Timing and capture", "Part D  /  D.6  The walkthrough", "V2 walkthrough, about 10 min"),
     gr(q1("Friction at that time is better than friction later.", "P10"),
        qs(["It becomes difficult to do later because you don't remember.", "You don't need to log every time. It should be automatic through SMS or bank."], "P10"), cols="2"),
     qs(["Checking account balance in the payment app is already frictionful.", "That's simpler than opening another app."], "P10", 2),
     kk("Three requirements came up again and again"),
     gr(*[pn(f'<span class="num">{n}</span>' + hx(a) + f'<p class="tx" style="margin:2mm 0 0">{t(b)}</p>', tone) for n, a, b, tone in [
         ("01", "Timing", "Information must appear before the decision is made.", ""), ("02", "Effort", "The user should not have to work out their financial position.", ""),
         ("03", "Capture", "Manual logging must not become the barrier to useful feedback.", "")]], cols="3", cls="gr-s"),
     strong("A product can have clear features and still be unclear about when or why it should be used.", cls=""))

brk = [("P01", "Social situation dominates", "Financial context arrives late", "Cue / Timing", "Prompt"),
       ("P02", "Value evaluated after spending", "—", "Evaluation", "Motivation"),
       ("P03", "Existing mental budgeting already strong", "Prototype may add limited value", "Evaluation / Experience", "Ability"),
       ("P04", "Future plan not active during current decision", "Social and hunger context dominates", "Timing", "Ability, Prompt"),
       ("P05", "Too many retrieval and calculation steps", "Time pressure", "Ability / Timing", "Ability, Prompt"),
       ("P06", "Perceived value overrides financial concern", "—", "Evaluation", "Motivation"),
       ("P07", "Purpose of information unclear", "Manual interaction effort", "Experience / Evaluation", "Ability, Prompt"),
       ("P08", "Existing transaction history reduces need for tracking", "Future context more useful", "Experience / Evaluation", "Ability"),
       ("P09", "Frequency becomes visible only through observation", "—", "Awareness / Evaluation", "Ability, Prompt"),
       ("P10", "Use situation unclear", "Later logging creates friction", "Timing / Experience", "Ability, Prompt")]
STAGES = ["Cue", "Evaluation", "Awareness", "Ability", "Timing", "Experience"]
stage_count = {s: sum(1 for r in brk if s in r[3]) for s in STAGES}
page(SD,
     head("D.7  Where each participant breaks", "Part D  /  What we found"),
     table(["", "Primary break", "Secondary break", "CREATE", "M / A / P"],
           [[ptag(c), f"<b style='color:var(--m-blue);font-weight:600'>{t(a)}</b>", MARK["—"] if b == "—" else t(b),
             "".join(f'<span class="tagc{" tagc--red" if x.strip() == "Timing" else ""}" style="margin:0 1mm 1mm 0">{x.strip()}</span>' for x in s.split("/")), t(m)] for c, a, b, s, m in brk],
           "dense", ["10mm", None, None, "42mm", "26mm"], raw=True),
     gr(pn(kk("Records per CREATE stage") + '<div class="sbars">' + "".join(
         f'<div><span class="sl">{s}</span><span class="sb"><i style="width:{stage_count[s] * 10}%"{" class=r" if s == "Timing" else ""}></i></span><span class="hx">{stage_count[s]}</span></div>' for s in STAGES) + "</div>"),
        pn(lbl("fi") + '<p class="hx hx--k" style="margin-top:2mm">Different participants struggled at different stages. The common opportunity is the gap between financial information being available and that information becoming useful in the decision.</p>', "y"), cols="2"))

pf = [("Future commitments", 6), ("Social context", 5), ("Agency, non-enforcement", 5), ("Calculation, retrieval effort", 4), ("Timing, decision-moment relevance", 4),
      ("Perceived value", 3), ("Accumulation, repeated small spending", 3), ("Automation", 3), ("Potential spending, consequence", 3), ("Existing transaction history", 3)]
ds = [("Potential spending, consequence valued", 3), ("Manual entry questioned", 3), ("Automation desired", 3), ("Future context useful", 3), ("User wants agency", 3),
      ("Existing payment infrastructure referenced", 3), ("Moment of use questioned", 2), ("Pattern information needs action", 2)]


def unitrow(n, total):
    return '<span class="ur">' + "".join(f'<i class="{"on" if k < n else ""}"></i>' for k in range(total)) + "</span>"


page(SD,
     head("D.8  Pattern frequency", "Part D  /  What we found", "Counts of records, never percentages."),
     gr(col(kk("Records, out of 10"), '<div class="freq">' + "".join(f'<div><span>{t(a)}</span>{unitrow(n, 10)}<b>{n} / 10</b></div>' for a, n in pf) + "</div>"),
        col(kk("Direct prototype signals: P07, P08, P10"), '<div class="freq freq--3">' + "".join(f'<div><span>{t(a)}</span>{unitrow(n, 3)}<b>{n} / 3</b></div>' for a, n in ds) + "</div>"),
        cols="2", style="grid-template-columns:1.1fr 1fr"),
     tx("Agency appears in almost every record. The other patterns appear in fewer records, but the specific reasons differ while the opportunity keeps appearing."),
     pn(kk("The clearest signal from the prototype sessions", "kk--k") + '<p class="hx hx--xl hx--k">Not a need for another transaction tracker. A need for low-effort financial context that helps people judge a current or upcoming decision.</p>', "y", "", "padding:7mm 6mm"))

# ================================================================== part E
ROLL = [(1, "Decision moment or use situation unclear", "2", "Timing", "Blocker", "User cannot reliably identify when the product enters the behaviour"),
        (2, "Manual capture creates friction", "3", "Ability", "Drag", "Behaviour remains possible but requires extra effort"),
        (3, "Potential consequence not immediately legible", "3", "Evaluation", "Drag", "User eventually understands it, but only after explanation"),
        (4, "Future plans separated from current decision", "4+", "Timing / Evaluation", "Drag", "Relevant commitment sits outside the spend check"),
        (5, "Progress representation implied wrong objective", "1", "Experience", "Blocker", "Representation inverts the intended behaviour"),
        (6, "Actual vs estimated spending unclear", "1", "Experience", "Drag", "User needs clarification"),
        (7, "Interface architecture feels congested", "1", "Experience", "Drag", "Main interaction competes with secondary modules"),
        (8, "Existing transaction history duplicates current tools", "1 to 3", "Experience", "Noise", "Existing tool already performs the function"),
        (9, "Categorisation is ambiguous", "1", "Ability", "Drag", "Correct classification requires clarification"),
        (10, "New Plan interaction failed", "1", "Ability", "Blocker", "Prototype task could not proceed normally")]
SEVT = {"Blocker": "tagc tagc--red", "Drag": "tagc tagc--yellow", "Noise": "tagc"}
page(SE,
     band("Part E  /  What broke", "E.1  Ten breaks, ranked"),
     table(["#", "What broke", "Records", "Stage", "Severity", "Why"],
           [[f'<span class="hx">{r}</span>', f"<b style='color:var(--m-blue);font-weight:600'>{t(w)}</b>", f'<span class="hx">{t(n)}</span>', t(st), f'<span class="{SEVT[sv]}">{sv}</span>', t(why)]
            for r, w, n, st, sv, why in ROLL], "dense" + " rank", ["8mm", "46mm", "15mm", "26mm", "17mm", None], raw=True),
     gr(*[pn(f'<span class="{SEVT[s]}">{s}</span><p class="tx" style="margin:2mm 0 0">{t(d)}</p>', "", "pn--s") for s, d in [
         ("Blocker", "The action did not happen, or only happened after help."), ("Drag", "It was slow, effortful or incorrect."), ("Noise", "It was mentioned but did not change behaviour.")]], cols="3", cls="gr-s"))

bana = [("Use situation", "When exactly am I using this app? What is the situation?", "The interface was organised around features. The user was looking for a situation."),
        ("Manual entry", "You don't need to log every time.", "The behaviour requires financial information to be available. Manual capture becomes a separate task."),
        ("Progress metaphor", "Usually a progress bar means a goal. My goal will be to fill it.", "The representation suggested that filling the bar was the objective."),
        ("Later friction", "It becomes difficult to do later because you don't remember.", "Later logging loses contextual information."),
        ("Potential spending", "I think this is the highlight of the app.", "The strongest feature was not sufficiently central to the overall interaction.")]
page(SE,
     head("E.2  Break analysis", "Part E  /  What broke"),
     '<div class="bana">' + "".join(f'<div><p class="hx">{t(a)}</p><p class="q2">“{t(q)}”</p><p class="tx">{t(m)}</p></div>' for a, q, m in bana) + "</div>",
     gr(pn(kk("E.3  Choosing the one change") + tx("Choose the highest-severity problem that appeared in more than one session. If there is a tie, choose the one earliest in the CREATE funnel, because a Timing problem can stop the later stages from happening.")
           + '<p class="hx" style="margin-top:3mm">Row 1 is the only Blocker that appears in more than one record, and Timing comes before the other stages. So Row 1 is the change.</p>', "y", "", "padding:6mm"),
        pn(kk("E.4  What we are deliberately not fixing") + '<ul class="xlist">' + "".join(f"<li><b>{t(a)}</b><br><span class='small'>{t(b)}</span></li>" for a, b in [
            ("Interface congestion", "Drag, one record"), ("Categorisation ambiguity", "Drag, one record"), ("Actual vs estimated distinction", "Drag, raised again in V2, still backlog"),
            ("Historical transaction ledger", "Noise, not a behavioural blocker")]) + "</ul>", "l", "", "padding:6mm"), cols="2"))

# ================================================================== part F
page(SF,
     band("Part F  /  The change", "F.1  The change log", "One change only."),
     '<div class="clog">' + "".join(f'<div><span class="lbl lbl--{k}">{t(n)}</span><div class="tx">{v}</div></div>' for n, k, v in [
         ("Evidence", "ev", "".join(f"<p>{ptag(c)} {t(x)}</p>" for c, x in [
             ("P04", "demonstrates that a known future commitment can fail to become part of the current decision."),
             ("P05", "demonstrates that retrieving financial context can require too much calculation."),
             ("P07", "identifies potential spending as the most useful decision-support interaction."),
             ("P08", "demonstrates that transaction history already exists elsewhere and that future planning creates more differentiation."),
             ("P10", "asks for a clear situation in which the product is actually used.")])),
         ("Diagnosis", "fi", "<p>The main break is at <b>Timing</b>, not Cue. The prompt can be seen, but it appears when the user has little attention available and has to work out their own financial position. In Fogg's terms, the prompt arrives when ability is low.</p>"),
         ("The change", "re", "<p><b>Move the relevant financial consequence into the moment when the person is about to spend.</b> Instead of making them navigate, remember, calculate and compare, the system shows current money, the relevant upcoming commitment, the proposed expense and the projected remainder. One change only.</p>"),
         ("Prediction", "im", "<p>The participant will understand the financial consequence with fewer steps and will be more likely to mention it when making the decision.</p>"),
         ("Falsifier", "br", "<p>The participant does not notice the consequence, cannot explain it, still has to find and calculate the same information, or sees the consequence as irrelevant.</p>")]) + "</div>",
     pn(kk("Write the prediction before you build", "kk--w") + '<p class="tx" style="color:var(--m-paper);margin:0">After seeing a result, it is easy to explain why it happened. Writing the prediction first makes Round 2 a real test instead of a demonstration.</p>', "b"))

page(SF,
     head("F.2  The interaction", "Part F  /  The change"),
     eq([("", "Current money"), ("op", "−"), ("", "Upcoming commitments"), ("op", "−"), ("", "Proposed expense"), ("op", "="), ("", "Projected remaining money", "res")]),
     gr(pn(waterfall([("Current money", 4200, "start"), ("Upcoming commitment", -1000, "minus"), ("Proposed expense", -700, "minus"), ("Projected remaining", 2500, "end")], w=100, h=96), "w", "", "box-shadow:inset 0 0 0 0.3mm var(--m-paper-deep)"),
        col(pn(kk("Then ask", "kk--w") + '<p class="hx hx--xl hx--w">“Would you still like to spend ₹700?”</p>', "b", "", "padding:8mm 6mm"),
            pn(tx("The interface shows the consequence.", "The user decides what it means for them."), "l", "", "flex:1;display:flex;flex-direction:column;justify-content:center")), cols="73"),
     vs(pn(kk("From") + '<p class="q" style="margin:0">How much have I spent?</p>', "l", "", "padding:6mm"), pn(kk("To", "kk--k") + '<p class="q" style="margin:0;color:var(--m-ink)">What happens if I spend this?</p>', "y", "", "padding:6mm")))

dd = [("P04", "P04 knew a future dinner but did not consider it", "Future information can disappear from the active decision", "Show relevant upcoming commitments alongside proposed spending"),
      ("P05", "P05 found calculation effortful", "Calculation competes with the speed of decision", "Calculate the projected remaining amount"),
      ("P07", "P07 highlighted potential spending", "Consequence is more useful than generic history", "Make potential spending central"),
      ("P07", "P07 wanted a flag, not a command", "User wants agency", "Use reflective prompts rather than enforcement"),
      ("P08", "P08 already tracks through a payment app", "Transaction history is duplicated", "Prioritise context and consequence"),
      ("P08", "P08 uses self-set limits", "Users can create their own boundaries", "Keep limits user-defined"),
      ("P09", "P09 noticed accumulation", "Frequency can become salient", "Show cumulative patterns where meaningful"),
      ("P10", "P10 questioned the use situation", "The feature needs a clear behavioural entry point", "Frame interaction around “about to spend”"),
      ("P10", "P10 said later logging is harder", "Context decays after spending", "Move capture and relevance closer to the event"),
      ("P10", "P10 preferred seamless interaction", "Opening another app is friction", "Explore automation or embedded interaction")]
page(SF,
     head("F.3  From evidence to design decision", "Part F  /  The change"),
     '<div class="chain-h"><span class="lbl lbl--ev">Evidence</span><span class="lbl lbl--fi">Finding</span><span class="lbl lbl--re">Response</span></div>',
     '<div class="chain">' + "".join(f'<div class="ch"><div class="c1">{codes(c)}<span>{t(e)}</span></div><i class="ar"></i><div class="c2">{t(i)}</div><i class="ar"></i><div class="c3">{t(d)}</div></div>' for c, e, i, d in dd) + "</div>")

v12 = [("Understand use situation", "Unclear", "Still questioned initially", "Problem remains important", 0), ("Understand consequence", "Required explanation", "More explicit discussion", "Strengthened", 1),
       ("Distinguish actual and estimated", "Unclear", "Still questioned", "Requires clearer representation", 0), ("Manual capture", "Friction", "Still friction", "Automation remains important", 0),
       ("Spending moment", "Not central enough", "Explicitly discussed", "Stronger conceptual framing", 1), ("Financial consequence", "Useful but buried", "More central", "Stronger design direction", 1),
       ("Agency", "Valued", "Preserved", "Continue", 0)]
page(SF,
     head("F.4  V1 to V2", "Part F  /  The change"),
     gr(phone("v1-home.jpg", "V1 home, prototype-v1.html."), phone("v2-home.jpg", "V2 home, prototype-v2.html."),
        table(["Behaviour", "V1", "V2", "Direction"], [[f"<b style='color:var(--m-blue);font-weight:600'>{t(a)}</b>", t(b), t(c), f'<span class="tagc tagc--blue">{t(d)}</span>' if up else t(d)] for a, b, c, d, up in v12],
              "dense", ["28mm", None, None, "28mm"], raw=True), cols="3", style="grid-template-columns:30mm 30mm 1fr"),
     strong("V2 made the interaction clearer. The consequence became more central, and participants talked directly about the spending moment instead of leaving it unclear.", cls=""))

page(SF,
     head("F.5  The unit of value changed", "Part F  /  The change"),
     '<div>' + vs(pn(kk("Before") + '<p class="hx hx--xl">Transaction</p>' + tx("What was spent?"), "", "", "padding:7mm 6mm"),
                                                        pn(kk("After", "kk--w") + '<p class="hx hx--xl hx--w">Decision</p>' + chk(["Why now?", "What else was happening?", "What was known?", "What was not considered?", "What would change if the expense happened?"]), "b", "", "padding:7mm 6mm")) + "</div>",
     pn(rh(["Accounting", "Context", "Consequence", "Decision"], key="Decision"), "", "", "padding:6mm 4mm"),
     strong("The prototype is useful when it helps the user understand what a decision will change, not just record that a transaction happened.", cls=""))

# ================================================================== part G
meth = [("1", "Event log in the prototype", "Nothing. Asks the person nothing, reminds them of nothing.", "You have a working build. Take this if available at all.", ""),
        ("2", "Artefact trace", "Very little. Ask once, at the end, to see the residue.", "The behaviour leaves a physical or digital mark.", "use"),
        ("3", "Day-6 recall", "Accuracy. People round their behaviour up, in the direction they think you want.", "No trace and no log. Honest, as long as you say it is recall.", ""),
        ("4", "Daily check-in", "The most complete record and the worst method. Your message is a prompt your design did not earn.", "Last resort only.", "no")]
page(SG,
     band("Part G  /  Does the behaviour come back?", "Everything so far tests one occurrence.", "Behaviour change means seeing what happens the second time, the fifth time, and when nobody is there with a notebook."),
     kk("G.1  Four ways to record a repeat"),
     '<div class="meth">' + "".join(f'<div class="m {k}"><span class="nn">{n}</span><div><p class="hx">{t(a)}</p>{"<span class=tagc tagc--blue>Margin uses this</span>" if k == "use" else ""}{"<span class=tagc tagc--red>Ruled out</span>" if k == "no" else ""}</div>'
                                    f'<div><span class="kk">What it costs</span><p class="tx">{t(b)}</p></div><div><span class="kk">Use it when</span><p class="tx">{t(c)}</p></div></div>' for n, a, b, c, k in meth) + "</div>",
     gr(pn(kk("Why method 2", "kk--w") + '<p class="tx" style="color:var(--m-paper);margin:0">The target behaviour leaves a residue in the user\'s own payment app history, and both P08 and P10 confirmed the payment app is already their source of truth.</p>', "b"),
        pn(kk("Why not method 4") + tx("This research is about prompts and timing, so a daily message from the researcher would measure the researcher, not the design."), "l"), cols="2"))

loopo = [("Trigger, external", "Yes. You fired it.", "Team", 0), ("Trigger, internal", "No.", "The participant, and nobody else", 1),
         ("Action", "Yes, with a log or trace", "Team, confirmed by the participant", 0), ("Variable reward, what happened", "Yes. The design decides what it gave them.", "Team", 0),
         ("Variable reward, how it felt", "No. It is internal.", "The participant, and nobody else", 1), ("Investment", "Usually yes. Stored value shows up in the product.", "Team", 0)]
page(SG,
     head("G.2  The return visit, day 6  /  G.3  The loop log", "Part G  /  Does the behaviour come back?"),
     gr(pn('<p class="nbig">10</p><p class="tx" style="margin:1mm 0 0">minutes. Most of the useful evidence is in the first three minutes, before you ask anything.</p>'),
        pn(kk("Watch first. Ask last.", "kk--w") + rv([("Watch for what cued it", "If they act, work out what made them: the design's own prompt, a reminder they set themselves, the sight of the phone."),
                                                          ("Ask about the week", "How many times, and when was the most recent? Ask at the end so it cannot shape what you observed. Look at the artefact trace now.", None, "end")]), "b"), cols="37"),
     tx("Every method in G.1 records what can be seen from the outside. An internal trigger, a thought, feeling or routine, cannot be observed. The participant is the only person who can report it."),
     table(["Loop phase", "Can the team observe it?", "Who reports it"], [[(f"<b style='color:var(--m-route)'>{t(a)}</b>" if k else t(a)), (f"<b style='color:var(--m-route)'>{t(b)}</b>" if k else t(b)), (f"<b style='color:var(--m-route)'>{t(c)}</b>" if k else t(c))] for a, b, c, k in loopo],
           "dense", ["56mm", None, "56mm"], raw=True),
     strong("The participant reports only two things: the two things the team cannot observe any other way. It takes about five seconds.", cls=""))

letters = [("1st", "What brought you here", [("P", "the app pinged me"), ("W", "something around me"), ("M", "my own head")]),
           ("2nd", "What happened", [("D", "did it"), ("H", "half did it"), ("N", "did not")]),
           ("3rd", "How it felt right after", [("G", "good"), ("F", "flat"), ("B", "bad")])]
rules = [("The participant starts every message. You never do.", "The second you send a daily check-in, your message is the trigger and every entry after it is measuring you. This is the difference between a log and a nudge."),
         ("Sent after, never before.", "An entry is a record of something that already happened. If they message first and then do the thing, strike it out."),
         ("One pinned reference message at setup,", "then silence until day 6."),
         ("No streaks, no praise, no encouragement.", "Otherwise you build a reward loop around your own measurement."),
         ("Observer bias.", "Asking somebody to notice and record a behaviour makes them more aware of it. At scale this needs a control group.")]
page(SG,
     head("Three letters, sent once per loop", "Part G  /  G.3  The loop log"),
     gr(*[pn(f'<span class="kk">{t(n)}</span><p class="hx">{t(q)}</p><div class="lets">' + "".join(f'<div><b>{l}</b><span>{t(d)}</span></div>' for l, d in opts) + "</div>", "b" if n == "1st" else "") for n, q, opts in letters], cols="3", cls="gr-s"),
     gr(pn('<p class="mono">MDG bored</p><p class="tx" style="margin:2mm 0 0">One word is optional. This is a complete entry and takes four seconds.</p>', "y"),
        pn(kk("Reads as") + tx("My own head, did it, felt good. Bored."), "l"), cols="2"),
     '<div>' + kk("Five rules") + '<div class="rules5">' + "".join(f'<div><span class="nn">{i + 1}</span><p><b>{t(a)}</b> {t(b)}</p></div>' for i, (a, b) in enumerate(rules)) + "</div></div>")

page(SG,
     head("The setup message, and reading the first letter", "Part G  /  G.3  The loop log"),
     gr('<div class="script script--sm">' + "".join(f"<p>{p}</p>" for p in [
         "Thanks again. One small thing, and it is genuinely optional: if you ever end up using it again this week, could you send me three letters? Nothing else needed.",
         "What brought you to it: <b>P</b> if the app pinged you. <b>W</b> if something around you did, a person or a place or an object. <b>M</b> if it was your own head, a feeling or a thought.",
         "What happened: <b>D</b> did it. <b>H</b> half did it. <b>N</b> did not.",
         "How it felt right after: <b>G</b> good. <b>F</b> flat. <b>B</b> bad.",
         "So “MDG” means my own head, did it, felt good. Add a word if you want, like “MDG bored”. Send it after, not before, and please do not do it just because I asked. <b>If you never send one, that is a real answer and it helps me.</b>",
         "I will not message you until [day 6 date]. Delete this any time."]) + "</div>",
        col(pn(kk("That last line matters", "kk--w") + '<p class="tx" style="color:var(--m-paper);margin:0">Without it, a polite participant may make up entries just to help.</p>', "b"),
            pn(kk("The ceiling") + tx("Internal triggers take weeks or months of frequent usage to latch on. Over five days, expect a column of P and no M. That is the correct result. Write it down as expected before the week begins.")),
            pn(kk("Two entries, then quiet") + tx("They probably stopped logging rather than stopped using the product. Do not send a reminder: it would become a new trigger. Wait until day 6 and ask."), "l"), gap="3mm"), cols="2"),
     '<div>' + kk("Reading the first letter") + '<div class="reads">' + "".join(f'<div><p class="hx">{t(a)}</p><p class="tx">{t(b)}</p></div>' for a, b in [
         ("All P", "The design is still doing all the work. This is the normal state of a young design."),
         ("Mostly P, with a W or two", "Something in their environment has started standing in for your prompt. Find out what: that object or place is a cue you did not design and could."),
         ("Any M at all", "The most interesting entry of the week. Ask about it specifically on day 6. One M is a lead."),
         ("No entries at all", "Either nothing happened, or they stopped logging. Day 6 tells you which.")]) + "</div></div>")

# ================================================================== part H
props = [("Timely", "Financial information appears before the decision closes"), ("Contextual", "The information relates to the current proposed expense"),
         ("Low-effort", "The user does not reconstruct their financial position manually"), ("Consequence-oriented", "The system shows what changes if the expense happens"),
         ("Non-judgemental", "The product does not classify a decision as good or bad"), ("User-final", "The system surfaces information and questions; the user decides")]
page(SH,
     band("Part H  /  Synthesis", "H.1  The question is now sharper", None,
          '<div class="vs2" style="margin-top:2mm">' + pn(kk("The project began by asking", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">How do we help students track their money?</p>', "", "", "background:rgba(255,255,255,0.14)")
          + '<span class="v" style="background:var(--m-mustard);color:var(--m-ink)">to</span>' + pn(kk("The testing shifted the question to", "kk--k") + '<p class="q" style="margin:0;color:var(--m-ink)">How do we make financial consequences visible while the spending decision is still open?</p>', "y") + "</div>"),
     '<div class="shifts">' + "".join(f'<div><span class="a">{a}</span><i class="ar"></i><span class="b">{b}</span></div>' for a, b in [("Tracking", "Consideration"), ("Transaction", "Decision"), ("Information", "Consequence")]) + "</div>",
     kk("H.2  What a useful system must be"),
     gr(*[pn(f'<span class="num">{i + 1:02d}</span><p class="hx hx--xl{" hx--w" if i == 5 else ""}">{t(a)}</p><p class="tx" style="margin:2mm 0 0">{t(b)}</p>', "b" if i == 5 else "") for i, (a, b) in enumerate(props)], cols="3", cls="gr-s"))

challenged = ["More tracking equals more awareness", "More features equals more usefulness", "Historical spending is the main product value", "A warning should stop the purchase",
              "Spending less equals a successful intervention", "A future expense automatically influences current behaviour", "A user will open another app because financial information is useful"]
cpairs = [(("Future planning can be strong", "P03", "actively preserves money for future needs"), ("Future planning can disappear", "P04", "knew about Friday and did not consider it on Wednesday")),
          (("Tracking can increase awareness", "P09", "noticed repeated small spends"), ("Tracking can be redundant", "P08", "already has transaction history")),
          (("Financial information can alter spending", "P09", "reduced some spending"), ("Awareness can coexist with spending", "P01, P06", "")),
          (("Limits can help", "P08", "uses self-defined limits"), ("Limits can become control", "P08", "rejects enforced limits")),
          (("Historical data helps explain", "P07", "understands monthly spending"), ("Consequence is more useful", "P07", "values the potential-spend view more"))]
page(SH,
     head("H.3  Validated  /  H.4  Challenged", "Part H  /  Synthesis"),
     gr(pn(kk("Validated", "kk--w") + chk(["Financial visibility can create reflection", "Future commitments matter to spending decisions", "Future commitments are not always active when spending happens",
                                          "Manual financial capture introduces friction", "Potential spending is a meaningful decision-support direction",
                                          "Financial information does not need to change the final purchase to enter the reasoning", "Users want to retain decision ownership"]), "b", "cfill", "padding:7mm 6mm"),
        pn(kk("Challenged") + '<ul class="xlist xlist--big">' + "".join(f'<li><span class="m-strike">{t(x)}</span></li>' for x in challenged) + "</ul>", "", "", "padding:7mm 6mm"), cols="2"),
     "")

page(SH,
     head("H.5  Contradictions, kept rather than averaged away", "Part H  /  Synthesis"),
     '<div>' + '<div class="cp2">' + "".join(
         f'<div class="cpair"><div class="cs"><p class="hx">{t(a[0])}</p><div>{codes(a[1])}<span class="small">{t(a[2])}</span></div></div><span class="v">vs</span>'
         f'<div class="cs"><p class="hx">{t(b[0])}</p><div>{codes(b[1])}<span class="small">{t(b[2])}</span></div></div></div>' for a, b in cpairs) + "</div></div>",
     strong("There is no single “financially conscious” user behaviour. The intervention has to support consideration rather than assume the correct outcome.", cls=""))

evs = [("Future plans can fail to influence current decisions", "P04", "High"), ("Potential spend is useful", "P07", "High"), ("Existing transaction tracking reduces differentiation", "P08", "High"),
       ("Automation is desired", "P07, P08, P10", "High"), ("Social context affects spending", "P01, P04, P05, P07, P10", "High"), ("Agency matters", "P03, P06, P07, P08, P10", "High"),
       ("Visibility can increase awareness", "P09", "Medium"), ("Calculation effort can block consideration", "P05", "Medium"), ("Financial awareness can coexist with purchase", "P01, P06", "Medium")]
feat = [("Potential spending", "P07, P08, P10", "Strong decision-support direction", 3), ("Upcoming plans", "P07, P08, P10", "Strong contextual value", 3),
        ("Automatic transaction capture", "P07, P08, P10", "Strong infrastructure requirement", 3), ("Payment-app integration", "P08, P10", "Strong opportunity, technically unresolved", 2),
        ("Spending limits", "P08", "Useful when user-defined", 1), ("Patterns", "P07, P08", "Useful when actionable", 1), ("Monthly spending", "P07", "Useful contextual information", 1),
        ("Categories", "P07", "Supporting information, not core intervention", 1), ("Chatbot logging", "P10", "Attractive: matches an existing conversational behaviour", 1),
        ("Manual transaction entry", "P07, P08, P10", "Repeated friction", -1), ("Progress bar", "P10", "Problematic metaphor", -1), ("Historical transaction ledger", "P08", "Low differentiation", 0)]
FT = {3: "tagc tagc--blue", 2: "tagc tagc--sky", 1: "tagc", 0: "tagc", -1: "tagc tagc--red"}
page(SH,
     head("H.6  Evidence strength  /  H.7  Feature evidence", "Part H  /  Synthesis"),
     table(["Claim", "Records", "Strength"], [[f"<b style='color:var(--m-blue);font-weight:600'>{t(a)}</b>", codes(b), f'<span class="tagc{" tagc--blue" if s == "High" else " tagc--sky"}">{s}</span>'] for a, b, s in evs],
           "dense", [None, "44mm", "20mm"], raw=True),
     table(["Feature", "Evidence", "Conclusion"], [[f"<b style='color:var(--m-blue);font-weight:600'>{t(a)}</b>", codes(b), f'<span class="{FT[k]}">{t(c)}</span>'] for a, b, c, k in feat],
           "dense tight", ["50mm", "34mm", None], raw=True))

# ================================================================== part I
sec = [("Notice", "Did the participant look?"), ("Understanding", "Could they explain the consequence?"), ("Connection", "Did they relate it to the purchase?"),
       ("Consideration", "Did they mention a trade-off?"), ("Decision", "Changed / maintained / delayed"), ("Effort", "Steps required"), ("Time", "Time to understand"),
       ("Independence", "Needed help / unaided"), ("Repeat", "Happened again without prompting")]
page(SI,
     band("Part I  /  The next test", "The next test", None, '<div class="m-pullquote" style="margin-top:2mm"><p class="q">Does making the financial consequence of a proposed expense immediately visible increase financial consideration before commitment?</p><cite>Question</cite></div>'),
     pn(rh([("Baseline", "Observe relevant spending decisions"), ("Intervention", "Show current money, upcoming commitment, proposed expense and projected remaining money"),
            ("Observe", "Notice, understand, connect, consider, decide"), ("Return", "Observe whether the behaviour happens again without prompting")], key="Intervention"), "", "", "padding:6mm 3mm"),
     gr(pn(kk("Primary measure", "kk--w") + '<p class="hx hx--xl hx--w">Financial consideration</p>', "b", "", "display:flex;flex-direction:column;justify-content:center;padding:7mm 6mm"),
        pn('<p class="hx hx--k" style="text-align:center">Relevant decisions where financial context was noticed and incorporated into reasoning</p><div style="height:0.8mm;background:var(--m-route);margin:5mm 10mm;border-radius:1mm"></div><p class="hx hx--k" style="text-align:center">Total relevant decisions observed</p>', "y", "", "padding:7mm 6mm"),
        cols="37"),
     gr(pn(kk("Set before you run", "kk--k") + '<p class="tx" style="margin:0 0 3mm">Write the criterion as a count and date it:</p><p class="hx">Four of five participants mention the projected remaining amount without being prompted within thirty seconds, and three of five state a decision without being asked.</p><p class="tx" style="margin:3mm 0 0"><b>Do not change it after the first session.</b></p>', "y"),
        pn(tx("Run three V2 sessions with new participants. Keep the task and session length the same. Score each session against the five components. Record counts, not percentages.")), cols="2"))

outc = [("Changed", "Decision moved from the original choice"), ("Modified", "Amount or alternative changed"), ("Delayed", "Decision postponed"),
        ("Declined", "Purchase abandoned"), ("Maintained", "Original decision retained"), ("Conscious maintain", "Original decision retained after explicit financial consideration")]
page(SI,
     head("Measures, the working model, and decision outcomes", "Part I  /  The next test"),
     head("Measures, the working model, and decision outcomes", "Part I  /  The next test") if False else "",
     gr(col(kk("Secondary measures"), table(["Measure", "What is recorded"], [[f"<b style='color:var(--m-blue);font-weight:600'>{t(a)}</b>", t(b)] for a, b in sec], "dense", ["32mm", None], raw=True)),
        col(kk("The working model"), loop(["See", "Understand", "Consider", "Decide", "Reflect", "Next\ndecision"], r=20, w=84, h=74, key="Consider")), cols="2"),
     '<div>' + kk("Decision outcome categories") + gr(*[pn(f'<p class="hx{" hx--w" if a == "Conscious maintain" else ""}">{t(a)}</p><p class="tx" style="margin:1.4mm 0 0">{t(b)}</p>', "b" if a == "Conscious maintain" else "", "pn--s") for a, b in outc], cols="3", cls="gr-s") + "</div>",
     pn('<p class="hx hx--xl hx--w">Maintained does not equal failed.</p><p class="tx" style="margin:2mm 0 0;color:var(--m-paper)">A maintained decision can still demonstrate consideration.</p>', "r", "", "padding:8mm 7mm"))

# ================================================================== field guide
wrong = [("Nobody replies, and it is day three", "Drop the scheduling and go where people already are. Standing in a canteen and asking someone with a free twenty minutes converts far better than a message."),
         ("All three participants loved it and nothing broke", "Almost always one of three things. Your task named the control, so you tested their reading rather than your design. Your participants were friends who did not want to embarrass you. Or the task was too easy to be the real moment. Rewrite the task and run one more."),
         ("A participant could not finish and it got awkward", "That is a Blocker, and your most valuable result of the week. Close the session kindly, thank them properly, tell them the design failed rather than that they did, and write down the exact second it stopped."),
         ("Two teammates read the same session completely differently", "Write both readings on the sheet and take it to the next session as the thing you are watching for. Resolve with evidence."),
         ("You realise mid-week that you tested the wrong moment", "Say what you would test instead, and run round 2 on the right moment if there is time."),
         ("The change made things worse", "Report it exactly as it happened and work out which stage you misdiagnosed. Even good teams cannot predict which changes help."),
         ("Nobody used it again all week: three empty logs", "Three empty logs is a finding, and a sharp one. Report the zero, then work out which of two things it was: the behaviour never got cued a second time, or it got cued and was not worth doing. The day-6 visit tells you which."),
         ("Your participant sent two entries and went quiet", "Almost never means they stopped using it. Almost always means they stopped logging. Do not chase them. Wait for day 6 and ask.")]
page(SX,
     band("When it goes wrong", "Eight problems, and what to do"),
     gr(*[pn(f'<span class="num">{i + 1:02d}</span><p class="hx">{t(a)}</p><p class="tx" style="margin:2mm 0 0">{t(b)}</p>', "") for i, (a, b) in enumerate(wrong)], cols="2", cls="gr-s"))

ai = [("Drafting probes and debrief questions, then piloting them on a real person", "Generating synthetic users, personas-as-participants, or made-up quotes"),
      ("A first-pass clustering of notes you actually collected, reworked by hand", "Handing the model your sheets and using its themes as your findings"),
      ("Scaffolding the analysis: asking what a guardrail metric might be", "Letting it write your CREATE diagnosis or decide which change to make"),
      ("Rehearsing the hard questions a jury might ask", "Any fabricated result, count or citation")]
page(SX,
     head("The AI line", "Field guide"),
     '<div class="ailine"><div class="kh"><span class="lbl lbl--re">Allowed</span><span class="lbl lbl--br">Not allowed</span></div>' + "".join(
         f'<div class="kr"><p>{t(a)}</p><i class="ar"></i><p><span class="m-strike">{t(b)}</span></p></div>' for a, b in ai) + "</div>",
     pn(kk("Three-line note to attach", "kk--k") + '<div class="gr gr-3 gr-s" style="margin-top:2mm">' + "".join(f'<div><span class="num">{i + 1}</span><p class="hx hx--k">{t(x)}</p></div>' for i, x in enumerate(
         ["Where you used it", "Which prompts changed a decision", "One place you overruled it"])) + "</div>", "y", "", "padding:7mm 6mm"))

# ================================================================== cover and contents
SECS = [("Q", "The research question", SQ), ("A", "What we are testing", SA_), ("B", "The method", SB), ("C", "The participants", SC), ("D", "What we found", SD),
        ("E", "What broke", SE), ("F", "The change", SF), ("G", "Does the behaviour come back?", SG), ("H", "Synthesis", SH), ("I", "The next test", SI), ("", "When it goes wrong, the AI line", SX)]


def pages_of(sec):
    return [i + 3 for i, p in enumerate(PAGES) if f'data-sec="{sec}"' in p]


rows = []
for n, name, sec in SECS:
    idx = pages_of(sec)
    rng = f"{idx[0]:02d}" if len(idx) == 1 else f"{idx[0]:02d} to {idx[-1]:02d}"
    rows.append(f'<li><span class="n">{n}</span><span class="t">{t(name)}</span><span class="p">{rng}</span></li>')
contents = ('<section class="pg" data-sec="Contents"><div class="ct v2">' + head("Contents") + '<div class="gr" style="grid-template-columns:1fr 62mm;gap:10mm">'
            '<ol class="toc">' + "".join(rows) + "</ol>"
            + pn(kk("How to read this kit", "kk--w") + '<p class="tx" style="color:var(--m-paper);margin:0 0 3mm">Parts A and B set up the test. C and D are the evidence. E and F turn a break into one change. G checks whether the behaviour returns. H and I say what we know and what to test next.</p>'
                 + '<div class="stack">' + "".join(f'<div class="wk"><span class="lbl lbl--{k}" style="margin:0">{n}</span></div>' for k, n in [("ev", "Evidence"), ("fi", "Finding"), ("im", "Implication"), ("re", "Response")]) + "</div>", "b", "", "padding:6mm")
            + "</div></div></section>")

cover = """<section class="pg pg--field cover" data-bare>
  <div class="abs" style="left:18mm;top:16mm;right:18mm;display:flex;justify-content:space-between"><span class="fr">Designing for Influence, Module 4</span><span class="fr">September 2026</span></div>
  <div class="abs" style="left:18mm;top:40mm;width:92mm">
    <p class="big" style="margin:0;color:var(--m-paper)">Margin</p>
    <p class="mid" style="margin:3mm 0 0;color:var(--m-paper)">User testing kit</p>
  </div>
  <div class="abs" style="left:112mm;top:34mm;width:52mm;transform:rotate(-5deg)"><div class="ph" style="box-shadow:0 0 0 1mm rgba(255,255,255,0.3)"><img src="shots/v2-home.jpg" alt=""></div></div>
  <div class="abs" style="left:146mm;top:64mm;width:48mm;transform:rotate(6deg)"><div class="ph" style="box-shadow:0 0 0 1mm rgba(255,255,255,0.3)"><img src="shots/v2-result.jpg" alt=""></div></div>
  <div class="abs" style="left:18mm;top:82mm;width:88mm">
    <span class="fr fr--y">The research question</span>
    <p class="q" style="margin:4mm 0 0;color:var(--m-paper)">Can making financial consequences visible at the moment of spending make spending decisions more conscious?</p>
  </div>
  <div class="abs" style="left:0;right:0;bottom:0;height:74mm;background:var(--m-paper);border-radius:8mm 8mm 0 0;padding:9mm 18mm;box-sizing:border-box">
    <span class="kk">The kit</span>
    <div class="rh2" style="grid-template-columns:repeat(5,1fr);margin-top:4mm">
      <div><b>What we test</b></div><div><b>The method</b></div><div><b>What we found</b></div><div class="key"><b>The change</b></div><div><b>The next test</b></div>
    </div>
    <p class="small" style="position:absolute;left:18mm;right:18mm;bottom:10mm;margin:0;color:var(--m-blue);opacity:0.6;display:flex;justify-content:space-between"><span>Participants are shown by code only, P01 to P11.</span><span>Screens: Margin prototype V2, repository capture, sample names replaced.</span></p>
  </div>
</section>"""

HEAD = (Path(__file__).parent / "report_head.html").read_text()
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
print(f"{len(PAGES) + 2} pages")
