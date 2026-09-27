"""Builds process.html: Margin in-depth process documentation (client's content).

Text is the client's, carried over as written with small typo fixes, em dashes
replaced, and "Kharcha" read as Margin. Tables that were images in the source are
rebuilt as tables. Participant names in wireframes are replaced; hi-fi screens are
the redacted repository captures. Run:
    python3 margin/process/build_process.py
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent / "report"))
from rlib import *  # noqa: F401,F403
from rlib import PAGES, page, head, band, MARK

OUT = HERE / "process.html"
S1, S2, S3, S4, S5, S6 = ("01  Hypotheses and primary research", "02  Diagnosing the behaviour", "03  Methods of ideation",
                          "04  From explorations to prototype", "05  Testing", "06  Considerations and steps ahead")


def fig(src, cap=None, h=None, cls=""):
    st = f"max-height:{h}mm;" if h else ""
    c = f'<p class="ph-cap">{t(cap)}</p>' if cap else ""
    return f'<figure class="fig {cls}"><img src="{src}" alt="" style="{st}">{c}</figure>'


def screen(name, cap=None):
    return phone("../../report/shots/" + name, cap or "Hi-fi screen, repository capture, sample names replaced.")


def dtable(head_, rows, widths=None):
    return table(head_, [[f"<b style='color:var(--m-blue);font-weight:600'>{t(r[0])}</b>"] + [t(x) for x in r[1:]] for r in rows], "dense", widths, raw=True)


def arrow_rows(pairs, lh="By looking at", rh_="we ideated on"):
    return ('<div class="arrows"><div class="ah"><span class="kk">' + t(lh) + '</span><span></span><span class="kk">' + t(rh_) + "</span></div>"
            + "".join(f'<div class="ar-row"><span class="hx">{t(a)}</span><i class="ar"></i><span class="tx">{t(b)}</span></div>' for a, b in pairs) + "</div>")


# ================================================================== PART 01
page(S1,
     head("Initial exploration", "Part 01  /  Making hypotheses and primary research"),
     gr(tx("The project began from a broad observation: students and young adults sometimes spend more than they intended in social settings.",
           "The easiest explanation was that friends, FOMO and social pressure were pulling people away from their financial intentions."),
        tx("While this framing of the problem was easy to translate into the product brief of “help people resist spending pressure”, we realised that our research had to uncover what actually happens between a social suggestion and the eventual payment.",
           "The interview approach therefore moved toward critical incidents: reconstruct the moment, what was said, what the participant thought, what they looked at, what they did, and what happened afterwards."), cols="2"),
     '<div>' + kk("Research goals") + gr(*[pn(f'<span class="num">{i + 1}</span>' + hx(x), "", "pn--s") for i, x in enumerate(
         ["Separate ability failure from motivation failure.", "Locate the moment of compliance.", "Identify what wins in that moment.", "Understand the second party's role.", "Surface the target action."])],
         cols="5", cls="gr-s", style="grid-template-columns:repeat(5,1fr)") + "</div>",
     pn(kk("Interview flow logic", "kk--w") + rh(["Warm-up and introduction", "Critical incident", "Laddering internal experience", "Bring in the other party",
                                                 "What's already been tried and why it failed", "Close"], key="Critical incident"), "b", "", "padding:6mm 3mm"))

page(S1,
     head("First behavioural hypothesis", "Part 01  /  Making hypotheses and primary research", "And why it needed to change."),
     tx("The early working hypothesis treated the problem as social spending being driven by peer influence. The implied behavioural solution was therefore closer to helping a person resist, refuse or constrain the social spend."),
     pn(kk("Gaps in the hypothesis") + '<ul class="xlist">' + "".join(f"<li>{t(x)}</li>" for x in [
         "“Overspending” is an outcome, not a sufficiently specific target action.",
         "“Friends cause it” treats the second party as the villain before establishing the mechanism.",
         "“Make people spend less” ignores cases where additional spending is consciously valued.",
         "A budget dashboard assumes the problem is missing information rather than missing access or use at a particular moment.",
         "A refusal tool would be inappropriate if people can say no but sometimes deliberately choose the social experience."]) + "</ul>", "l", "", "padding:4mm 0 0"),
     tx("We began distinguishing an outcome (“spent more”) from the process that produced it. That distinction became the foundation for the later target behaviour."),
     vs(pn(kk("Our question shifted from") + '<p class="q" style="margin:0">How do we stop overspending?</p>', "l", "", "padding:6mm"),
        pn(kk("To", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">What actually happens at the decision moment?</p>', "b", "", "padding:6mm")))

reframe = [("Friends cause overspending", "Friends can increase, reduce, accommodate or establish spending norms.", "The friend or group becomes a second party, not an antagonist."),
           ("Users lack financial knowledge", "Participants use GPay, Notes, Excel, Splitwise, mental ranges, separate pools and personal rules.", "Financial literacy should not be the primary intervention."),
           ("Users lack motivation", "People want financial control and genuinely value social experiences.", "Motivation is divided, not absent."),
           ("Users do not evaluate purchases", "They evaluate price, value, occasion and affordability.", "The gap is between transaction evaluation and future consequence."),
           ("People need stricter budgets", "Some already use thresholds, ranges and precommitment.", "We must surface existing self-defined context."),
           ("Regret means spending is unwanted", "Some spending is consciously accepted because the experience is worthwhile.", "Do not optimise for lower spend at the expense of autonomy.")]
page(S1,
     head("Hypothesis testing and reframing", "Part 01  /  Making hypotheses and primary research",
          "Our first round of interviews revealed decisions made in the moment of a social plan; however, they failed to account for factors like the value of a social outcome, an individual's own financial tracking methods, and how previous and upcoming transactions influenced the social spend."),
     kk("Findings that changed our hypothesis"),
     '<div class="reframe"><div class="rh3"><span class="kk">We assumed</span><span class="kk">We found</span><span class="kk">Thus</span></div>' + "".join(
         f'<div class="rr"><p class="hx"><span class="m-strike">{t(a)}</span></p><p class="tx">{t(b)}</p><p class="hx">{t(c)}</p></div>' for a, b, c in reframe) + "</div>")

page(S1,
     head("Sequence of events", "Part 01  /  Making hypotheses and primary research", "What happens between a social suggestion and the eventual payment."),
     gr(pn(rv([("Social plan", "The suggestion arrives"), ("Social value and financial intention exist", "Both are present at once"), ("Decision locks", "", None, "key"),
               ("++ Marginal spends", "Accumulation builds without a clear decision point"), ("Consequences visible later", ""), ("“I should plan”", "The loop returns to the next social plan", None, "end")]), "", "cfill", "padding:6mm"),
        col(pn(kk("The loop") + tx("Planning intentions return after the consequences are visible, but the next social plan arrives with the same sequence: the financial intention exists, yet the decision locks before it is used.")),
            pn(kk("The key research question became", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">Is what they know available and meaningful at the moment they decide?</p>', "b", "", "padding:7mm 6mm;flex:1;display:flex;flex-direction:column;justify-content:flex-end")),
        cols="2"))

patterns = [("Planned vs spontaneous", "Planning creates a preparation window; spontaneity removes it."), ("Mental ranges", "People often think in contextual ranges rather than one universal ceiling."),
            ("Transaction vs impact", "A transaction feels reasonable while cumulative impact is never evaluated."), ("Small-spend accumulation", "Individually acceptable purchases can add up without a clear decision point."),
            ("Precommitment", "Separate accounts can create a boundary before the decision moment."), ("Environment", "Proximity can create purchases that were not strongly desired beforehand."),
            ("Social value", "Friendship, memories and occasions can legitimately justify additional spend.")]
page(S1,
     head("Primary research: what did it reveal?", "Part 01  /  Making hypotheses and primary research"),
     gr(col(kk("Rigour in behavioural interview design"),
            tx("We deliberately used <b>incident reconstruction</b>: what happened immediately before, what the person noticed, what they thought, what they said, what they checked, how long they took, and what happened afterwards. This is stronger for behaviour design than asking whether participants “usually overspend,” because it creates a traceable sequence.".replace("<b>", "**").replace("</b>", "**"))),
        col(kk("Distinct respondents"), tx("Respondents were kept distinct rather than collapsing all participants into one generic persona. This prevented a single strong case from becoming a universal diagnosis.")), cols="2"),
     kk("Patterns surfaced"),
     gr(*[pn(hx(a) + f'<p class="tx" style="margin:1.4mm 0 0">{t(b)}</p>', "", "pn--s") for a, b in patterns]
        + [pn(kk("Limitations of the research", "kk--k") + tx("The strongest evidence remains qualitative and incident-based. A defensible percentage for the current rate of financial consideration before commitment cannot be derived from retrospective interviews alone. A live or diary study is required."), "y")],
        cols="2", cls="gr-s"))

# ================================================================== PART 02
page(S2,
     head("Evolution of the defined behaviour", "Part 02  /  Diagnosing the behaviour"),
     '<div class="swap">' + "".join(f'<div><span class="m-strike">{t(a)}</span><i class="ar"></i><b>{t(b)}</b></div>' for a, b in [
         ("Spend less.", "Measure decision process."), ("Avoid social spending.", "Preserve social participation."),
         ("Say no to friends.", "Treat friends as second party."), ("Track every expense.", "Use tracking as data infrastructure.")]) + "</div>",
     pn(kk("Final target behaviour", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">Before committing to a new or additional social spend, consider the relevant financial trade-off and make a <b>deliberate decision</b>.</p>', "b", "", "padding:7mm 6mm"),
     '<div>' + kk("How can it be observed?") + gr(*[pn(f'<p class="hx hx--xl">{a}</p><p class="tx" style="margin:2mm 0 0">{t(b)}</p>', "y" if a == "Stretch." else "") for a, b in [
         ("Keep.", "Proceed with the plan within the existing intention or context."), ("Stretch.", "Proceed while consciously accepting that the decision stretches the usual boundary."),
         ("Change.", "Modify the amount, activity, timing or plan.")]], cols="3", cls="gr-s") + "</div>",
     ins("Financial consideration enters while the decision is still open, the person can understand what the new spend changes, and the choice remains theirs.", "What defines success", cls=""))

page(S2,
     head("Diagnosis frameworks: what did they reveal?", "Part 02  /  Diagnosing the behaviour"),
     kk("B = MAP"),
     dtable(["", "Diagnosis", "Notes for design"], [
         ("Motivation", "High but divided: financial control and social experience are both valued.", "Do not manufacture motivation; lower the effort of accessing financial value."),
         ("Ability", "Available but costly in the moment; current spending + new cost + future commitments may require reconstruction.", "Collapse reconstruction into contextual information."),
         ("Prompt", "Weak or mistimed; social suggestion is a strong cue to act, financial evaluation lacks an equally salient cue.", "Make the financial context appear because the decision is happening.")], ["30mm", None, None]),
     kk("CREATE"),
     dtable(["Stage", "Diagnosis", "Notes for design"], [
         ("Cue", "Financial or cumulative context not consistently noticeable.", "Create a relevant financial cue."),
         ("Reaction", "Immediate social value competes strongly.", "Don't assume a financial message will automatically win."),
         ("Evaluation", "Present but flexible; value or occasion can override.", "Help evaluate rather than dictate."),
         ("Ability", "Immediate social value competes strongly.", "Reduce retrieval and calculation."),
         ("Timing", "Immediate social value competes strongly.", "Intervene while commitment is still reversible."),
         ("Experience", "Social reward reinforces spending; later regret can reinforce planning.", "Preserve the social experience and autonomy.")], ["30mm", None, None]))

links = [("Time", "Hard", "Decision may occur in seconds.", 3), ("Money", "Medium", "Affordability is personal; do not impose a universal ceiling.", 2),
         ("Physical effort", "Easy", "Not the core bottleneck.", 1), ("Mental effort", "Hardest", "Reconstructing current position + new cost + future impact is costly.", 4),
         ("Routine", "Medium", "Social spending is irregular; trigger should be situational.", 2)]
page(S2,
     head("Five ability links", "Part 02  /  Diagnosing the behaviour"),
     '<div class="links">' + "".join(f'<div class="{"hard" if n == 4 else ""}"><p class="hx">{t(a)}</p><span class="diff">' + "".join(f'<i class="{"on" if k < n else ""}"></i>' for k in range(4))
                                     + f'</span><span class="kk" style="margin:0">{t(b)}</span><p class="tx">{t(c)}</p></div>' for a, b, c, n in links) + "</div>",
     kk("SDT and expectancy-value"),
     gr(*[pn(kk(a) + hx(b), "", "pn--s") for a, b in [("Competence", "“I understand my position and can handle this trade-off.”"), ("Autonomy", "The user decides whether the experience is worth it."),
                                                     ("Relatedness", "Financial intentionality should not require abandoning social participation.")]], cols="3", cls="gr-s"),
     tx("SDT moved the intervention toward situational competence while protecting autonomy and relatedness.",
        "Expectancy-value clarified that the user is not choosing valuable social experience versus meaningless spending. Both have value."),
     ins("The design task is to lower the effort needed to access the financial value of conscious decision-making without devaluing the social experience.", cls=""))

mech = ["Mental accounting", "Present bias", "Reference points", "Social norms", "Precommitment", "Environmental cueing", "Self-licensing", "Information pipeline"]
page(S2,
     head("Supporting mechanisms, and the core behavioural loop", "Part 02  /  Diagnosing the behaviour"),
     '<div class="mech">' + "".join(f'<div><span>{t(m)}</span></div>' for m in mech) + "</div>",
     gr(pn(loop(["Cue", "Decision", "Experience", "Logging", "Informing\ndata", "Visualisation /\ncommunication", "Reinforcing"], r=34, w=118, h=108, key="Decision"), "w", "", "display:flex;justify-content:center"),
        col(kk("The core behavioural loop, broken down"),
            tx("Seven stages, read clockwise from the cue. The loop became the frame for ideation in Part 03: each stage is a different place the intervention could act.")),
        cols="2", style="grid-template-columns:1.4fr 1fr"))

# ================================================================== PART 03
page(S3,
     head("Overview of ideation methods", "Part 03  /  Methods of ideation"),
     tx("As a rule, we established that rather than ideating on “features for spending”, a method that can end up generating familiar product patterns (dashboards, trackers, reminders), we chose to ideate on ways to alter the diagnosed behavioural mechanism."),
     arrow_rows([("Diagnosis", "Mechanism-level intervention opportunities."), ("Behaviour-loop stage", "Different ways to intervene at different points."),
                 ("Intrinsic journey", "Ways to change the internal decision process."), ("System layer", "Features separated from infrastructure."),
                 ("Touchpoints", "Where the mechanism could operate."), ("Falsifiers", "Testable hypotheses instead of aesthetic concepts.")]),
     kk("Ideation by diagnosis"),
     '<div class="rules5" style="grid-template-columns:repeat(5,1fr)">' + "".join(f'<div><span class="nn">{i + 1:02d}</span><p><b>{t(a)}</b> {t(b)}</p></div>' for i, (a, b) in enumerate([
         ("Mental effort is the weakest link.", "Our intervention must not make the user reconstruct information."),
         ("Timing is the failing gate.", "We must provide a cue when the decision happens, not after."),
         ("Motivation is divided.", "We must respect both values and not make one choice seem “better”."),
         ("Help the user understand what changes,", "but leave the decision in the user's hands."),
         ("Preserve the user's participation.", "")])) + "</div>")

page(S3,
     head("Ideation by stages of the behavioural loop", "Part 03  /  Methods of ideation", "Ideas mapped to each of the seven loop stages."),
     fig("img/ideation-loop.jpg", "Ideation board: ideas placed at each stage of the core behavioural loop.", 200))

page(S3,
     head("Ideation by intrinsic journey", "Part 03  /  Methods of ideation", "Ideas mapped to the internal decision process, from the hangout being introduced to money being spent."),
     fig("img/ideation-journey.jpg", "Ideation board: the intrinsic journey of a social spending decision.", 200))

# ================================================================== PART 04
layers = [("Transactions", "Capture or import financial events.", "Infrastructure."), ("Plans", "Store future intentions and commitments.", "Supporting mechanism; behaviourally unproven."),
          ("Personal rules and ranges", "Store or infer reference points.", "Potentially high-value context; test required."), ("Context interpretation", "Turn raw data into personally relevant meaning.", "Core synthesis layer."),
          ("Profile", "Learn own patterns; maintain context.", "Reflective, context-building layer."), ("Decision surface", "Surface only what is needed now.", "Primary intervention surface."),
          ("Choice", "KEEP / STRETCH / CHANGE.", "Autonomy-preserving outcome."), ("Update", "Use outcomes to improve future context.", "Learning loop.")]
page(S4,
     head("Integrating with existing systems and forms", "Part 04  /  From explorations to prototype"),
     tx("A central design decision was to distinguish the behavioural mechanism from the form factor. The intervention could appear as a widget, app surface, overlay, chatbot, notification, plan interaction or existing-tool extension. The mechanism should remain stable even when the form changes."),
     dtable(["Layer", "Role", "Behavioural status"], layers, ["44mm", None, None]),
     kk("Architectural decisions"),
     tx("The product should not become a giant financial dashboard. The profile can carry richer pattern information because the user is intentionally learning about themselves. The decision surface should be sparse because the user is already inside a time-constrained social choice."))

page(S4,
     head("The profile", "Part 04  /  Integrating with existing systems and forms", "The place where the user establishes and maintains the personal context that the decision intervention uses."),
     gr(col(*[pn(f'<span class="num">{l}</span>' + hx(a) + f'<p class="q2" style="margin:1.4mm 0 0">{t(q)}</p>', "", "pn--s") for l, a, q in [
         ("A", "Financial context", "“What is my current position?”"), ("B", "Personal reference points", "“What counts as normal for me?”"),
         ("C", "Future commitments", "“What have I already mentally allocated?”"), ("D", "Data control", "“What does the system know, and what am I allowing it to use?”")]], gap="3mm"),
        pn(rv(["Profile", "User defines or reviews personal context", "System uses it", ("Decision moment", "", None, "key"), "Relevant context", ("See, consider, choose", "", None, "end")]), "b", "cfill", "padding:7mm 6mm"),
        cols="2"))

touch = [("UPI apps", "Payment is close to commitment.", "App-specific access, privacy and platform constraints; also potentially too late."),
         ("Bank SMS / OCR", "Could reduce manual logging and unify transaction data.", "Technical coverage + privacy; infrastructure, not automatically intervention."),
         ("Existing financial apps", "Users already have balances, categories and histories.", "The problem may be activation or use, not absence of tools."),
         ("Notes / calculator", "Available everywhere; useful as low-fi research instruments.", "Good for mechanism testing; manual reconstruction may reproduce the diagnosed friction."),
         ("WhatsApp", "Already part of social planning.", "Useful for participant-started traces or social context; researcher messages can become cues."),
         ("Widgets", "Potentially low-friction decision surface.", "Risk of generic always-on salience and notification fatigue."),
         ("Chatbot / natural language", "Can externalise anticipated spending with low-structure input.", "Need to test whether articulation itself changes consideration or only improves data capture."),
         ("AI", "Potentially useful for classification and insight synthesis.", "Backend accuracy is not the first behavioural question; Wizard-of-Oz can test mechanism first."),
         ("Overlay / contextual prompt", "Could appear at the moment of a social decision.", "Strong fit with timing diagnosis but high precision, trust and privacy requirements.")]
page(S4,
     head("Exploration of touchpoints", "Part 04  /  From explorations to prototype"),
     gr(fig("img/touchpoints.jpg", "The app ecosystem mapped onto the behavioural loop.", 110),
        tx("The app ecosystem is already a workaround system. GPay/UPI, Notes, Excel, Splitwise, calculators, bills and food or location apps each carry part of the job. Our process involved studying the distinct role each individual app played, and where hand-offs occurred. This gave us clear points in the journey where current apps proved unsatisfactory and the user has to compensate with multiple apps at a single stage."), cols="2", style="grid-template-columns:1.3fr 1fr"),
     vs(pn(kk("Not") + '<p class="q" style="margin:0"><span class="m-strike">Build the one app that replaces everything.</span></p>', "l"),
        pn(kk("But", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">Find the stage where we can intervene, and how our intervention can work alongside the user\'s existing apps and patterns, rather than forcing adoption.</p>', "b")),
     "")

page(S4,
     head("Touchpoints explored", "Part 04  /  Exploration of touchpoints"),
     dtable(["Touchpoint", "Why it was explored", "Critical issue / decision"], touch, ["40mm", None, None]))

page(S4,
     head("Framing relevant information", "Part 04  /  From explorations to prototype"),
     gr(tx("Upon deciding the optimal touchpoint, we also needed to consider the framing of information provided to the user. The intervention depended on the right information being delivered in the right moment."),
        tx("More information can increase context but also increase cognitive load. The decision surface therefore cannot be the place where every pattern is shown. The profile can carry the complexity; the decision moment should carry only the relationship needed for the choice."), cols="2"),
     vs(pn(kk("We shifted from questioning") + '<p class="q" style="margin:0"><span class="m-strike">What information should be on the dashboard?</span></p>', "l", "", "padding:6mm"),
        pn(kk("To", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">What is the smallest amount of information that allows them to understand the financial trade-off in the current decision?</p>', "b", "", "padding:6mm")),
     tx("We experimented with various ways to frame information by looking at the behavioural function each would have. For example:"),
     gr(pn('<p class="hx hx--xl">Your usual social outing: ₹500 to ₹800.</p><p class="tx" style="margin:2mm 0 0">Function: gives the user a reference point.</p>'),
        pn('<p class="hx hx--xl">Your last 3 outings were above ₹800.</p><p class="tx" style="margin:2mm 0 0">Function: makes a repeated pattern visible.</p>'), cols="2"),
     '<div>' + kk("Defining rules for insight language") + '<div class="dodont"><div class="kh"><span class="lbl lbl--re">Do</span><span class="lbl lbl--br">Don\'t</span></div>' + "".join(
         f'<div class="kr"><p>{t(a)}</p><i class="ar"></i><p><span class="m-strike">{t(b)}</span></p></div>' for a, b in [
             ("Describe patterns.", "“You are a high spender.”"), ("Use self-to-self comparisons.", "“You spend more than X.”"),
             ("State consequences neutrally.", "“You need to shop less.”"), ("Use personal context.", "Generic financial scores.")]) + "</div></div>")

page(S4,
     head("Cue and trigger research", "Part 04  /  From explorations to prototype",
          "The project's timing hypothesis was strengthened by research on just-in-time interventions: the core logic is to provide support when a need or opportunity is present, using decision points and tailoring variables rather than only fixed schedules."),
     pn(kk("We realised that") + '<ul class="xlist">' + "".join(f"<li>{t(x)}</li>" for x in [
         "An intervention can fail if it arrives when the person cannot or does not need to act.", "Contextual triggering requires a defensible decision rule.",
         "Real-time tailoring is promising but technically and behaviourally difficult.", "A scheduled reminder is not equivalent to a decision-moment cue."]) + "</ul>", "l", "", "padding:4mm 0 0"),
     kk("Researching types of triggers"),
     dtable(["Trigger type", "Example", "Test question"], [
         ("Time-based", "8 PM reminder to check spending.", "Does generic salience help? Likely poor fit with diagnosis."),
         ("Event-based", "Plan accepted / expected social spend appears.", "Does the cue arrive while choice is open?"),
         ("Transaction-based", "Additional spend is about to occur.", "Is this too late?"),
         ("Context-based", "User is in a relevant location / plan context.", "Can detection be accurate enough?"),
         ("User-triggered", "User opens Make a Decision.", "Does requiring the user to remember recreate the problem?"),
         ("Hybrid", "System suggests a moment; user confirms.", "Can precision and autonomy coexist?")], ["36mm", None, None]),
     tx("We investigated various types of triggers, to understand which kind would be most appropriate for our intervention. We concluded this phase by determining that the most effective cue type would have to be tested; however, as illustrated above, it would be technically difficult for prototype testing, since it would need to appear in the participants' devices in real time."),
     ins("Systematic reviews of self-monitoring and tailored feedback report small or mixed effects, with substantial heterogeneity and methodological limitations. This supports treating personal insights as hypotheses to test rather than assuming that personalisation itself produces behaviour change.", "Conclusion", cls=""))

reps = [("Raw numbers", "Plan amount + current spend + usual range."), ("Range", "Plan amount positioned against personal range."),
        ("Accumulation", "Current social spend + proposed spend = projected total."), ("Sentence", "Natural-language interpretation of the relationship."),
        ("Consequence", "Explicit statement of what the new spend changes.")]
page(S4,
     head("Visualisation research", "Part 04  /  From explorations to prototype"),
     tx("A 2023 Journal of the Association for Consumer Research study found that visual aids communicating mutual-fund fees changed investor decisions in three studies, including two incentivised national samples. The study is not evidence that visualisation will work for our intervention; it is evidence that how quantitative information is represented can matter for financial decisions."),
     vs(pn(kk("Our key visualisation research question shifted from") + '<p class="q" style="margin:0"><span class="m-strike">Which chart looks best?</span></p>', "l", "", "padding:6mm"),
        pn(kk("To", "kk--w") + '<p class="q" style="margin:0;color:var(--m-paper)">Which representation lets the person correctly understand the decision-relevant relationship within the available seconds?</p>', "b", "", "padding:6mm")),
     '<div>' + kk("Representations explored") + gr(*[pn(f'<span class="num">{i + 1}</span>' + hx(a) + f'<p class="tx" style="margin:1.4mm 0 0">{t(b)}</p>', "y" if a == "Consequence" else "", "pn--s") for i, (a, b) in enumerate(reps)],
                                                   cols="5", cls="gr-s", style="grid-template-columns:repeat(5,1fr)") + "</div>",
     ins("Rather than choose a visually attractive representation, we chose to include visualisations as a testable feature of our prototype. Our main aim was to understand: can the person understand and use the financial relationship conveyed before commitment?", "Decision", cls=""))

evo = [("Constant spending widget", "Keep money salient.", "Questioned because constant salience can be intrusive and mistimed.", "no"),
       ("Quick logging widget", "Small expenses are forgotten.", "Retained as infrastructure; not the core intervention.", "infra"),
       ("Bank SMS / OCR", "Reduce manual logging and unify data.", "Technical hypothesis; privacy and coverage questions.", "open"),
       ("GPay / UPI overlay", "Place context inside payment flow.", "Platform and app constraints; potentially too late.", "no"),
       ("Plans: confirmed / to-be-decided", "Externalise future commitments.", "Useful hypothesis; needs to be behaviourally proven.", "open"),
       ("Make a Decision widget", "Direct path into decision context.", "Promising delivery mechanism; must not add reconstruction.", "yes"),
       ("Impact analysis", "Show what a new spend changes.", "Candidate core mechanism.", "core"),
       ("Profile", "Learn own financial patterns.", "Reframed as context-building, not generic dashboard.", "yes")]
ET = {"no": ("tagc", "Questioned"), "infra": ("tagc tagc--sky", "Infrastructure"), "open": ("wtag", "To test"), "yes": ("tagc tagc--blue", "Kept"), "core": ("tagc tagc--yellow", "Core mechanism")}
page(S4,
     head("Evolution of the prototype", "Part 04  /  From explorations to prototype",
          "The main iterations were conceptual: what the product is responsible for, where information lives, and which features are infrastructure versus intervention."),
     table(["Concept", "Reason it might work", "Final thoughts", ""], [[f"<b style='color:var(--m-blue);font-weight:600'>{t(a)}</b>", t(b), t(c), f'<span class="{ET[k][0]}">{ET[k][1]}</span>'] for a, b, c, k in evo],
           "dense roomy", ["44mm", "44mm", None, "30mm"], raw=True))

page(S4,
     head("Building the product architecture", "Part 04  /  From explorations to prototype"),
     tx("Initially, we also considered including logging as a separate feature, due to data privacy concerns of directly linking our app to the users' bank accounts."),
     fig("img/architecture.jpg", "Two goals of the intervention, broken into the data and features each needs.", 80),
     tx("After deliberation, we determined that requiring the user to manually log purchases, no matter how frictionless the process, would go against our target behavioural change, as manual actions increased effort automatically."),
     ins("While the feature was preserved for logging cash transactions or split bills, we unified digital transactions by linking the app to the user's bank account, the mechanism used by many financial tracking and budgeting apps today.", "Decision", cls=""))

insights = [("Self / reference", "“Your usual outing = ₹500 to ₹800”", "Anchoring / mental accounting", "Very high", "Low"),
            ("Trend", "“You've spent ₹400 more than usual this week”", "Salience", "High", "Medium"),
            ("Context", "“Weekend outings average ₹760”", "Pattern recognition", "High", "Causal overreach"),
            ("Commitment", "“Concert ₹2,500 is already committed”", "Present bias / precommitment", "High", "If commitment is inferred wrongly"),
            ("Accumulation", "“5 small outings = ₹2,900”", "Choice bracketing", "High", "Could induce guilt"),
            ("Projection", "“At this rate ≈ ₹5,400/month”", "Future consequence", "Medium-high", "Prediction uncertainty"),
            ("Normative", "“Peers spend ₹700”", "Social norm", "Medium", "Can backfire"),
            ("Judgement", "“You're overspending”", "Shame / persuasion", "Unclear", "High: avoid"),
            ("Recommendation", "“Don't go”", "Direct persuasion", "Potentially high", "Violates autonomy")]
RISK = {"Low": "tagc tagc--blue", "High: avoid": "tagc tagc--red", "Violates autonomy": "tagc tagc--red"}
page(S4,
     head("Every insight type explored, classified", "Part 04  /  From explorations to prototype"),
     table(["Insight type", "Example", "Mechanism", "Behavioural potential", "Risk"],
           [[f"<b style='color:var(--m-blue);font-weight:600'>{t(a)}</b>", f"<span class='q2'>{t(b)}</span>", t(c), t(d), f'<span class="{RISK.get(e, "tagc")}">{t(e)}</span>'] for a, b, c, d, e in insights],
           "dense roomy", ["32mm", "44mm", None, "28mm", "34mm"], raw=True),
     tx("Judgement and recommendation insights were ruled out: they rely on shame or direct persuasion and remove the decision from the user."))

page(S4,
     head("Core decision CTA flow", "Part 04  /  From explorations to prototype",
          "The structure and form of the social-spend decision flow came first from defining the core mechanism displayed in the decision moment, then linking it to a refined UI flow."),
     gr(pn(kk("Basic mechanism structure", "kk--w") + '<div class="mechs">' + "".join(f"<p>{t(x)}</p>" for x in [
         "Plan changed", "You were around ₹800 to ₹1,000", "You've spent ₹540", "This change adds ~₹300", "Still worth it?"]) + '<div class="kscs"><span>Keep</span><span>Stretch</span><span>Change</span></div></div>', "b", "", "padding:7mm 6mm"),
        col(kk("Low-fidelity prototyping"), tx("Determining the flow of user actions and relevant screens."),
            fig("img/lofi-cta-flow.jpg", "Lo-fi flow: from the home prompt to the estimate, the category insight and the result.")), cols="2", style="grid-template-columns:1fr 1.5fr"),
     '<div>' + kk("High-fidelity prototype screens") + gr(screen("v2-home.jpg", "Home: the decision prompt."), screen("v2-estimate.jpg", "Write an estimate."),
                                                        screen("v2-result.jpg", "Here's the picture: the consequence."), cols="3", cls="gr-s", style="grid-template-columns:repeat(3,44mm);justify-content:start") + "</div>")

page(S4,
     head("The home page", "Part 04  /  From explorations to prototype", "Where the decision prompt lives, and how it was ordered against the at-a-glance view."),
     kk("Low-fidelity screen iterations"),
     fig("img/lofi-home-a.jpg", "Option 1 and option 2: decision first, or at a glance first.", 120),
     fig("img/lofi-home-b.jpg", "Further iterations of the home page copy and hierarchy.", 60))

page(S4,
     head("The home page, high fidelity", "Part 04  /  From explorations to prototype"),
     gr(screen("v2-home.jpg", "Hi-fi home, repository capture, sample names replaced."),
        pn(kk("Where it landed") + tx("The decision prompt sits at the top of home, above the monthly picture, so the path into a decision needs no reconstruction."), "l"), cols="2", style="grid-template-columns:70mm 1fr"))

page(S4,
     head("The profile page", "Part 04  /  From explorations to prototype", "Reframed from a financial dashboard into context-building: the user learning their own patterns."),
     kk("Low-fidelity screen iterations"),
     gr(fig("img/lofi-profile-a.jpg", "Early profile: limit and analytics dashboard.", 90), fig("img/lofi-profile-b.jpg", "Profile with transaction history.", 90), cols="2", style="grid-template-columns:1fr 2.2fr"),
     kk("High-fidelity prototype screens"),
     gr(screen("v2-profile.jpg", "Your profile."), screen("v2-txns.jpg", "What it was for."), screen("v2-exp.jpg", "How your money moved."), cols="3", cls="gr-s", style="grid-template-columns:repeat(3,34mm);justify-content:start"))

page(S4,
     head("Upcoming plans", "Part 04  /  From explorations to prototype", "Externalising future commitments, so a known plan can enter a present decision."),
     kk("Low-fidelity screen iterations"),
     gr(fig("img/lofi-plans-d.jpg", "Analytics with plans."), fig("img/lofi-plans-c.jpg", "Scheduled and to be decided."), fig("img/lofi-plans-b.jpg", "Scheduled log and maybe plans."),
        fig("img/lofi-plans-a.jpg", "Upcoming events and scheduled log."), cols="4", cls="gr-s"),
     kk("High-fidelity prototype screens"),
     gr(screen("v2-plans.jpg", "What's planned."), screen("v2-estimate.jpg", "Write an estimate."), cols="2", cls="gr-s", style="grid-template-columns:repeat(2,44mm);justify-content:start"))

# ================================================================== PART 05
page(S5,
     head("Testing", "Part 05  /  Testing"),
     pn(kk("Covered separately", "kk--w") + '<p class="hx hx--xl hx--w">Testing is documented in the evidence and test plan, with test results.</p>', "b", "", "padding:9mm 7mm"),
     tx("That document covers the target behaviour, the method, the participants, what was found, what broke, the one change, the next test and the final results."))

# ================================================================== PART 06
threats = [("Financial priming", "Asking about balance immediately before the decision makes money salient.", "Collect or preload data earlier."),
           ("Researcher cue", "Facilitator saying “check your spending” becomes the intervention.", "Stay quiet; let the artefact cue."),
           ("Think-aloud effect", "Verbalising reasoning may change a normally rapid decision.", "Observe first; probe after."),
           ("Scenario learning", "Participant remembers the first scenario.", "Matched or different scenarios."),
           ("Prototype novelty", "New UI attracts attention unrelated to the mechanism.", "Use low-fi mechanism tests first."),
           ("Diary reactivity", "Recording expenses changes awareness and behaviour.", "Neutral factual logging; disclose limitation."),
           ("Multiple manipulations", "Cannot identify which feature caused the effect.", "One-change rule."),
           ("Spending-reduction bias", "Lower spend is treated as success even if autonomy is lost.", "Primary outcome = consideration."),
           ("Small sample", "Counts are overinterpreted.", "Report behavioural signal, not population effect."),
           ("False baseline", "Retrospective memory is treated as a rate.", "Use live or diary decision capture."),
           ("Inference misfire", "Incorrectly detected social moment creates distrust or fatigue.", "Measure precision and misfires before claiming contextual intelligence.")]
page(S6,
     head("Research rigour", "Part 06  /  Process considerations and steps ahead"),
     pn(kk("Defined rules as researchers") + '<div class="rules7">' + "".join(f'<div><span class="nn">{i + 1}</span><span>{t(x)}</span></div>' for i, x in enumerate([
         "Watch first. Help last.", "Record what participants did and said, not “they were confused.”", "Predefine pass criteria.", "Write the falsifier before seeing the result.",
         "Keep one change between comparable rounds.", "Distinguish researcher-triggered from participant-triggered behaviour.", "Do not turn a preference result into a behavioural claim."])) + "</div>", "l", "", "padding:4mm 0 0"),
     "")

page(S6,
     head("Threats to research validity, and our workarounds", "Part 06  /  Research rigour"),
     dtable(["Threat", "How it could distort Margin", "Response"], threats, ["38mm", None, None]))

conf = [("Spend less vs spend intentionally", "Lower spend looks easy to measure.", "Intentionality protects autonomy and matches diagnosis.", "Measure consideration, not reduction."),
        ("Dashboard vs decision surface", "More data feels comprehensive.", "More data increases cognitive effort.", "Profile can be detailed; decision surface stays sparse."),
        ("Always-on visibility vs contextual cue", "Constant reminders keep money salient.", "Can be intrusive and mistimed.", "Cue because a relevant decision is happening."),
        ("Logging as intervention vs logging as infrastructure", "Logging may increase awareness.", "Logging is needed to keep data current.", "Treat as infrastructure unless tested as mechanism."),
        ("Generic categories vs hyper-personal categories", "Generic is simple.", "Personal may map better to mental accounting.", "Make categorisation a falsifiable experiment."),
        ("AI automation vs Wizard-of-Oz", "Automation feels like a complete product.", "Backend accuracy can distract from mechanism testing.", "Test behavioural response manually first."),
        ("Chatbot vs conventional UI", "Chat can externalise intention naturally.", "Chat can become a long conversational path.", "Test articulation as a mechanism, not chat preference."),
        ("UPI integration vs standalone product", "Payment is close to commitment.", "Platform access, privacy and latency constrain the intervention.", "Treat touchpoint as a delivery hypothesis."),
        ("Information richness vs cognitive load", "More context can be more personalised.", "Too much context undermines the time constraint.", "Find minimum decision-relevant information."),
        ("Researcher help vs clean measurement", "Helping prevents participant frustration.", "Help can erase the real bottleneck.", "Stuck moments are data; rescue only when required.")]
page(S6,
     head("Conflicts and design trade-offs", "Part 06  /  Process considerations and steps ahead"),
     pn(kk("The core conflict our team grappled with", "kk--w") + '<p class="hx hx--xl hx--w">How do we make the system more helpful without making the user less autonomous?</p>', "b", "", "padding:7mm 6mm"),
     table(["Conflict", "Side A", "Side B", "Resolution"], [[f"<b style='color:var(--m-blue);font-weight:600'>{t(a)}</b>", t(b), t(c), f"<b style='color:var(--m-ink);font-weight:600'>{t(d)}</b>"] for a, b, c, d in conf],
           "dense", ["40mm", None, None, "44mm"], raw=True))

claims = ["The original peer-pressure framing was too narrow for the evidence.", "Participants can have financial intentions, tools and personal rules while still making socially driven spending decisions.",
          "Social value and financial control can coexist; additional spending is not always regretted.", "Spontaneous plans reduce preparation time.",
          "Financial context can require retrieval, calculation and projection.", "The strongest design opportunity identified is to make relevant financial context usable while the decision is still open.",
          "Logging is currently better understood as data infrastructure than as the primary intervention.", "A decision-moment intervention should preserve autonomy and social participation."]
openq = [("What is the baseline rate of financial consideration before commitment?", "Live / diary / captured decision data."), ("Does personally relevant context increase consideration?", "Matched control / prototype test."),
         ("Which insight is useful?", "One-insight-at-a-time decision tests."), ("Does personal categorisation matter?", "Matched generic / personal representation test."),
         ("Does anticipatory input itself create consideration?", "Amount-only vs natural-language test."), ("Which visual representation survives the decision window?", "Same information, different representation."),
         ("Can the cue fire at the right moment?", "Trigger precision / misfire study."), ("Does behaviour repeat without researcher prompting?", "Participant-started repeat probe."),
         ("Does the intervention preserve autonomy?", "Guardrail + post-decision measures."), ("Does the intervention change behaviour outside a study?", "Real-world longitudinal evidence.")]
page(S6,
     head("Current state of the intervention", "Part 06  /  Process considerations and steps ahead", "And what is yet to be uncovered."),
     pn(kk("Through the process thus far, the project can currently claim that", "kk--w") + chk(claims, cols=2), "b", "", "padding:7mm 6mm"),
     kk("Yet to be proven by testing"),
     dtable(["Open question", "Required evidence"], openq, [None, "64mm"]),
     '<p class="small" style="margin:0;opacity:0.7">This document ends here. Kindly refer to the testing documentation for further process details.</p>')

# ================================================================== dividers, cover, contents
DIVS = [(S1, "01", "Making hypotheses and primary research"), (S2, "02", "Diagnosing the behaviour"), (S3, "03", "Methods of ideation"),
        (S4, "04", "From explorations to prototype"), (S5, "05", "Testing"), (S6, "06", "Process considerations and steps ahead")]
out, done = [], set()
for p in PAGES:
    for sec, n, name in DIVS:
        if f'data-sec="{sec}"' in p and sec not in done:
            done.add(sec)
            titles = []
            for q in PAGES:
                if f'data-sec="{sec}"' in q:
                    m = re.search(r'<h1 class="h1 m-display-xl"[^>]*>(.*?)</h1>', q)
                    if m and m.group(1) not in titles:
                        titles.append(m.group(1))
            out.append(f'<section class="pg pg--field divider" data-bare data-sec="{sec}"><div class="dv-in"><span class="dv-l">{n}</span>'
                       f'<p class="dv-t">{t(name)}</p><ol class="dv-list">' + "".join(f"<li>{x}</li>" for x in titles) + "</ol></div></section>")
    out.append(p)
PAGES[:] = out


def pages_of(sec):
    return [i + 3 for i, p in enumerate(PAGES) if f'data-sec="{sec}"' in p]


rows = []
for sec, n, name in DIVS:
    idx = pages_of(sec)
    rows.append(f'<li><span class="n">{n}</span><span class="t">{t(name)}</span><span class="p">{idx[0]:02d} to {idx[-1]:02d}</span></li>')
contents = ('<section class="pg" data-sec="Contents"><div class="ct v2">' + head("Contents") + '<ol class="toc" style="max-width:120mm">' + "".join(rows) + "</ol></div></section>")

cover = """<section class="pg pg--field cover" data-bare>
  <div class="abs" style="left:18mm;top:16mm;right:18mm;display:flex;justify-content:space-between"><span class="fr">Designing for Influence</span><span class="fr">Year 03, Semester 05</span></div>
  <div class="abs" style="left:18mm;top:40mm;width:120mm">
    <p class="big" style="margin:0;color:var(--m-paper)">Margin</p>
    <p class="mid" style="margin:3mm 0 0;color:var(--m-paper)">In-depth process documentation</p>
    <p class="q" style="margin:14mm 0 0;color:var(--m-paper)">A behavioural design project on social-financial decision making.</p>
  </div>
  <div class="abs" style="left:0;right:0;bottom:0;height:74mm;background:var(--m-paper);border-radius:8mm 8mm 0 0;padding:9mm 18mm;box-sizing:border-box">
    <p class="small" style="position:absolute;left:18mm;right:18mm;bottom:10mm;margin:0;color:var(--m-blue);opacity:0.6">Testing is documented separately in the evidence and test plan.</p>
  </div>
</section>"""

HEAD = (HERE.parent / "report" / "report_head.html").read_text()
HEAD = (HEAD.replace('href="report.css"', 'href="../report/report.css"').replace("<title>Margin evidence and test plan</title>", "<title>Margin process documentation</title>")
        .replace('<body class="m-paper">', '<body class="m-paper" data-title="Process documentation" data-foot="Margin, designing for influence. Year 03, Semester 05.">')
        .replace("</style>", """  .fig { margin: 0; }
  .fig img { display: block; max-width: 100%; margin: 0 auto; border-radius: 3mm; box-shadow: 0 0 0 0.3mm var(--m-paper-deep); }
  .reframe { display: flex; flex-direction: column; }
  .rh3, .rr { display: grid; grid-template-columns: 1fr 1.3fr 1.1fr; gap: 6mm; }
  .rr { padding: 3.6mm 0; border-top: 0.3mm solid var(--m-blue); align-items: start; }
  .rr .tx, .rr .hx { margin: 0; }
  .rr .hx:last-child { color: var(--m-route); }
  .swap { display: grid; gap: 2.4mm; }
  .swap > div { display: grid; grid-template-columns: 1fr 12mm 1fr; align-items: center; padding: 2.4mm 0; border-top: 0.3mm solid var(--m-blue); font: 400 13.5pt/1.2 var(--m-font-display); color: var(--m-blue); }
  .swap .m-strike { color: var(--m-stone); }
  .links { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4mm; }
  .links > div { border-top: 0.3mm solid var(--m-blue); padding-top: 3mm; display: flex; flex-direction: column; gap: 1.6mm; }
  .links .hard { border-top: 1mm solid var(--m-route); }
  .links .tx { margin: 0; font-size: 8.5pt; }
  .diff { display: flex; gap: 1mm; } .diff i { width: 5mm; height: 2mm; border-radius: 1mm; background: var(--m-paper-deep); } .diff i.on { background: var(--m-route); }
  .mech { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; }
  .mech > div { aspect-ratio: 1; border-radius: 50%; background: var(--m-paper-deep); display: flex; align-items: center; justify-content: center; text-align: center; padding: 4mm; }
  .mech span { font: 400 13.5pt/1.2 var(--m-font-display); color: var(--m-blue); }
  .arrows { display: flex; flex-direction: column; }
  .ah, .ar-row { display: grid; grid-template-columns: 50mm 14mm 1fr; align-items: center; }
  .ar-row { padding: 2.6mm 0; border-top: 0.3mm solid var(--m-blue); }
  .ar-row .tx { margin: 0; }
  .dodont { display: flex; flex-direction: column; gap: 2mm; }
  .dodont .kh, .dodont .kr { display: grid; grid-template-columns: 1fr 10mm 1fr; align-items: center; }
  .dodont .kh .lbl:nth-child(2) { grid-column: 3; }
  .dodont .kr p { margin: 0; padding: 2.4mm 0 0; border-top: 0.3mm solid var(--m-blue); font: 400 13.5pt/1.3 var(--m-font-display); color: var(--m-blue); }
  .dodont .kr p:last-child { border-top-color: var(--m-route); font: 400 10.5pt/1.35 var(--m-font-text); color: var(--m-route); }
  .mechs p { margin: 0 0 2.4mm; font: 400 13.5pt/1.2 var(--m-font-display); color: var(--m-paper); }
  .mechs p:first-child { font: 600 8.5pt/1 var(--m-font-text); color: var(--m-mustard); letter-spacing: 0.03em; }
  .mechs p:nth-last-child(2) { color: var(--m-mustard); }
  .kscs { display: flex; gap: 2mm; margin-top: 4mm; } .kscs span { padding: 2mm 3.4mm; border-radius: 999px; background: var(--m-paper); color: var(--m-blue); font: 600 8.5pt/1 var(--m-font-text); }
  .rules7 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm 5mm; margin-top: 2mm; }
  .rules7 > div { display: flex; flex-direction: column; gap: 1.2mm; font: 400 10.5pt/1.3 var(--m-font-text); color: var(--m-blue); }
</style>"""))
TAIL = """
<script src="../js/route.js"></script>
<script src="../report/report.js"></script>
</body>
</html>
"""
doc = HEAD + cover + contents + "\n".join(PAGES) + TAIL
doc = doc.replace(">—<", '><i class="mk mk--none"></i><')
assert "—" not in doc and "·" not in doc and "Kharcha" not in doc and "Parisha" not in doc and "Vartika" not in doc
OUT.write_text(doc)
print(f"{len(PAGES) + 2} pages")
