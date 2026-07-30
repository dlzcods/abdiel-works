# Portfolio copy · full inventory for review

Every word on the site, in reading order, isolated from the design so you can eval the writing on its own.
Mark each block: **pass** / **rewrite** (and how). Voice rules in force: no dashes in prose, short sentences, technical claim + plain gloss in the same breath, one dry line max per section, no invented numbers.

---

## 0 · SEO layer (invisible on page, visible on Google and link previews)

**Browser tab / search result title**
> Abdiel · AI Project Manager & AI/ML Engineer · Indonesia / SEA

**Search result description**
> AI project manager and AI/ML engineer in Indonesia. Selected work in legal RAG, LLM evaluation, computer vision, and human-in-the-loop delivery.

**Link preview (WhatsApp / LinkedIn) title + description**
> Abdiel · AI Project Manager & AI/ML Engineer
> AI drafts. Humans direct. Nothing ships unmeasured. Work across language, judgment, and vision, delivered from Indonesia across SEA.

- [ ] verdict:

---

## 0b · Rail + hero frame

**Rail (fixed bar):** `Abdiel · 2026` · counter `n/7`
**Meta row:** `AI engineer → project manager` · `IDN / SEA`
**Scroll cue:** `Scroll ↓`

- [ ] verdict:

---

## 1 · Hero

**Headline**
> Systems that don't hallucinate.
> Teams that don't either.

**Manifesto**
> I'm Abdiel. AI project manager, AI/ML engineer by training. My team ships with AI in every loop and a human at every gate: RAG systems, vision models, evaluation harnesses. Everything measured, because it-feels-right is not an evaluation. The board below is how we actually run. Watch the eval column.

**Client proof line**
> Work delivered for clients in Singapore and Australia · based in Indonesia

- [ ] verdict:

---

## 1b · The board (all card and label text)

**Columns:** `AI draft` · `Human review` · `Eval` · `Shipped`
**Card anatomy:** `run-041` / task name / `eval pending` → `eval 0.94 ✓` or `eval 0.61 ✗` / `owner: human`
**Task pool:** query reformulation · grounding eval · essay score repeatability · retrieval reranker · retinal model validation · glaucoma recall review · severity bias analysis · Grad-CAM inspection · human review thresholds · cohort consistency check · JSON schema validation · acceptance criteria
**The recurring signature card:**
> abdiel v2.0 / role: engineer → pm / eval: passed / owner: still human

**Tally line**
> shipped 132 · rejected 23        humans in loop: always

- [ ] verdict:

---

## 2 · Section 01 · The situation

**Heading:** Make AI work where it isn't supposed to.

> That's been the job for the past two years. Scanned Indonesian legal documents that off-the-shelf OCR refused to read, so I fine-tuned PaddleOCR until it read them. Stamps, smudges and all. Retrieval systems (RAG) that answered legal questions confidently and wrongly, so I built query reformulation: restate the question in the language the documents actually use, and retrieval stops guessing.

> When a client needed document extraction they could defend in an audit, I made the unfashionable call: no GenAI in the pipeline at all. Fine-tuned OCR, deterministic rules, and a human in the loop for anything below a confidence threshold. Boring. Deterministic. Correct.

> The work traveled further than I planned. Clients in Singapore and Australia. Three competition placements with Jaya Koding. Invitations to speak at universities across Indonesia about how these systems actually get built.

**Statement (bold close):**
> Many engineers can call an API. I build the systems that make those APIs reliable.

- [ ] verdict:

---

## 3 · Section 02 · The friction

**Heading:** Then AI got good at my job.

> Not the whole job. Just the typing part. Models now write code faster than any team I've worked with, and most of it even runs. Which is exactly the problem.

> Speed was never the bottleneck. The bottleneck is knowing what's true: whether the output is correct, whether it should ship, and how you'd know either way. AI made code cheap and judgment expensive.

> I watched review queues grow faster than the velocity charts. Teams celebrated output while shipping slop at scale. The conclusion was obvious: the most useful place for an engineer who hates slop is no longer inside the editor. It's above the pipeline.

- [ ] verdict:

---

## 4 · Section 03 · The turn

**Heading:** AI made code cheap. Judgment got expensive. I moved where judgment lives.

**Intro**
> As a project manager I don't write most of the code anymore. AI drafts it, my engineers direct it. My job is the system around that: who owns which decision, what gets measured, and where a human must be in the loop. Every card on the board above runs this exact sequence:

**Pipeline log**
> a · AI drafts · code, docs, test plans ............ done
> b · Human directs · every output has a named owner ............ reviewed
> c · Eval gate · if we can't measure it, we don't merge it ............ passed · 3/3
> d · Ship · accountable to a person, not a prompt ............ shipped

**Diff**
> `- v1: answered confidently, wrongly. rejected.`
> `+ v2: query reformulation added. shipped.`

- [ ] verdict:

---

## 5 · Section 04 · Operating principles

**Heading:** Three rules I don't negotiate.

**i · No slop.**
> If it reads like it was generated, it gets regenerated. By a human. Output volume is not output.

**ii · Human in the loop.**
> Not a compliance checkbox. It's how a system stays honest when the model is confidently wrong.

**iii · Measured, or it didn't happen.**
> Every AI feature we ship has an evaluation behind it. "It feels smarter" is not a metric.

- [ ] verdict:

---

## 6 · Section 05 · Selected work

**Heading:** Three places where an average can lie.

> Language, judgment, and vision. Different models, same responsibility: find where the output breaks before someone else depends on it.

### 01 / Language · AWAM: legal RAG that can say “I don't know”
> A wrong legal answer is liability wearing a confident tone.
>
> **Situation** Indonesian legal questions need answers grounded in the documents, not the model's confidence.
>
> **Friction** Standard retrieval found passages that looked relevant for edge cases, then produced fluent answers from the wrong context.
>
> **Turn** I added query reformulation before retrieval. The system restates the question in language closer to the legal corpus before it searches.
>
> **Landing** The safer failure became no answer instead of a persuasive wrong one. The implementation remains private. The working interaction is available in the demo.

**Evidence:** Indonesian legal RAG · query reformulation · grounded-answer review · private repository

**Link:** Open access-controlled demo

### 02 / Judgment · When two LLM judges disagreed
> A score is only useful when it survives being repeated.
>
> **Situation** I tested whether LLMs could score IELTS-like essays consistently enough to support human graders.
>
> **Friction** Both models returned convincing scores. Repeating the judgment exposed different levels of stability, bias, and review workload.
>
> **Turn** I scored 150 essays with two models, five independent runs per essay, then tested agreement, variability, format validity, and human review flags.
>
> **Landing** GPT was more consistent. Qwen scored 74 of 95 matched essays higher and sent 92.2% of outputs to human review. The recommendation was simple: do not mix models within one cohort.

**Evidence:** 150 essays · 2 models × 5 runs · GPT ICC 0.943 · Qwen ICC 0.844

**Links:** Open visual report · Inspect research repository

### 03 / Vision · Know Your Sight: accuracy was not the final review
> 90.64% looked good. Glaucoma recall told us where it was not enough.
>
> **Situation** Jaya Koding built a browser-based screening prototype for cataract, diabetic retinopathy, glaucoma, and normal retinal images.
>
> **Friction** One accuracy number hid the class that needed the most scrutiny. Glaucoma recall was 80.33%, below the other three conditions.
>
> **Turn** I fine tuned EfficientNetB0, evaluated precision and recall per class, then integrated the model into the team's web product.
>
> **Landing** The prototype placed first at INVFEST X ISF 9.0 and second at PROXOCORIS International 2025. Strong competition proof, not a claim of clinical validation.

**Evidence:** 4,217 images · 844 held-out test images · 90.64% accuracy · 80.33% glaucoma recall

**Links:** Open product · Inspect repository · Read notebook

### Research note / Explainability
**What Grad-CAM showed me about Alzheimer's predictions**

> A model can be right for the wrong reason. I used Grad-CAM to inspect which image regions influenced a prediction, then wrote down what the heatmap can and cannot prove.

- [ ] verdict row 1:
- [ ] verdict row 2:
- [ ] verdict row 3:

---

## 7 · Section 06 · Field record

**Heading:** The work had to survive more than a benchmark.

> Competitions tested how we built under pressure. Invited sessions tested whether I could explain the decisions without hiding behind model jargon.

### Team execution · Three placements with Jaya Koding
> Two first places. One second place. The useful proof is how the team kept shipping under a deadline.

**Entries:**

> Nov 2024 · 1st · FAST Programming Problem Solving 2024 · Trunojoyo Madura University
>
> Jan 2025 · 1st · INVFEST X ISF 9.0 · Telkom Purwokerto University
>
> Apr 2025 · 2nd · PROXOCORIS International 2025 · Klabat University

Each entry links to its original LinkedIn story.

### Public communication · Two invited university sessions
> A technical decision is not useful if only the person who built it can understand it.

**Entries:**

> Nov 2025 · When AI Goes Viral: Creativity or Manipulation? · Soedirman Digital School
>
> Dec 2025 · AI and The Future: AI Potential in the Digital World · Software Engineering Event 9th

Each entry links to its original LinkedIn story.

- [ ] verdict:

---

## 8 · Section 07 · Working fit

**Heading:** Bring me in when output is moving faster than judgment.

> A useful engagement usually begins with one of these conditions.

**Fit conditions**

> 01 · AI is already producing work. Nobody can clearly explain what is safe to ship.
>
> 02 · The feature can be built. Ownership between product, model, and human review is still unclear.
>
> 03 · The demo looks convincing. You still want evaluation criteria before calling it done.
>
> 04 · The architecture is still open. You can accept that GenAI may not be the right tool.

**Rejected fit**

> If the brief begins and ends with “make it AI-powered,” I am probably not the right person.

- [ ] verdict:

---

## 9 · Section 08 · Model card + contact

**Heading:** Documented like everything else I ship.

**CTA**
> Building with AI and want it to hold up under scrutiny? Talk to me. I answer email written by humans faster.

**Spec block**
> name · Abdiel
> version · 2.0, the project manager release. 1.0 was the engineer
> built · reliable systems across language, judgment, and vision. 2 years in
> proof · clients in Singapore and Australia · 3 competition placements with Jaya Koding · published evaluation research
> status · shipping, humans in every loop
> known flaws · allergic to unmeasured claims. will ask "how do you know?"
> contact · hafd324@gmail.com

**Link rows:** `/in/muhammad-abdiel-al-hafiz · LINKEDIN ↗` · `@dlzcods · GITHUB ↗`

- [ ] verdict:

---

## 10 · Footer · The last review

**Diff**
> `- made with ❤️ and the latest AI models`   ← struck in red
> `+ drafted by AI. argued with, corrected, and shipped by a human.`

**Sign-off line**
> © 2026 Abdiel · v2.0        shipped: everything above · rejected: the parts you'll never see

- [ ] verdict:

---

## 11 · Recurring micro-copy

**Gate line (ends sections 01 through 07):** `Section reviewed · passed`
**Board aria label (screen readers):** A live kanban board: work cards move from AI draft to human review to an eval column, where failing cards are struck through in red and removed; passing cards ship.

- [ ] verdict:
