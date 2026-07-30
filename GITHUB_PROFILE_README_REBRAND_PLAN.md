# GitHub Profile README Rebrand Plan

## Objective

Reposition Muhammad Abdiel Al Hafiz from a generic AI Engineer profile into a credible AI Project Manager with an AI/ML engineering foundation.

The README should communicate three things within ten seconds:

1. Abdiel understands how AI systems are built.
2. Abdiel now operates where ownership, evaluation, and shipping decisions happen.
3. Every claim leads to public evidence.

The portfolio carries the full narrative. GitHub should be the technical evidence layer.

## Current README Audit

### What currently weakens the profile

#### 1. The opening is generic

`Hi, I'm Muhammad Abdiel Al Hafiz` with a waving GIF resembles thousands of developer profiles. It introduces a person but not a point of view.

#### 2. The animated typing line is vague

`AI whispers... I translate` sounds creative, but it does not communicate reliability, evaluation, delivery, or leadership. It also depends on a third-party image service.

#### 3. The role is outdated

`AI Engineer` no longer captures the transition into project management or the responsibility for AI-assisted development workflows.

#### 4. “Currently exploring” understates the evidence

OCR, RAG, and AI agents are not merely topics Abdiel is exploring. He has built production pipelines, fine tuned models, published evaluation research, delivered work across countries, and led team execution.

#### 5. Profile views are a vanity metric

The visitor counter measures page traffic, not engineering credibility. It conflicts with the larger brand principle that metrics should reflect something useful.

#### 6. Tool badges and GitHub statistics would add noise

Technology badges describe familiarity but not judgment. GitHub already displays contribution activity and languages elsewhere. The README should use the space for systems, constraints, and results.

#### 7. The commented block is dead weight

The old language badges, stats widgets, and decorative GIF separators should be deleted rather than left commented inside the source.

## New Positioning

### Primary identity

**AI Project Manager. AI/ML engineer by training.**

### Supporting statement

**I build the system around AI output: ownership, evaluation, human review, and accountable delivery.**

### Signature line

**AI drafts. Engineers direct. Evaluation decides. A human still owns the result.**

This keeps the engineering identity while making the strategic transition explicit.

## Audience Priority

1. Senior engineers evaluating technical credibility
2. Recruiters and hiring managers evaluating role fit
3. Potential international clients evaluating delivery maturity
4. Early-career developers looking for evidence of what is possible

## Recommended Information Architecture

### 1. Identity

Use native Markdown. No centered HTML, waving GIF, typing animation, visitor counter, or badge wall.

Suggested hierarchy:

```md
# Muhammad Abdiel Al Hafiz

AI Project Manager. AI/ML engineer by training.

I build the system around AI output: ownership, evaluation, human review, and accountable delivery.
```

### 2. Operating model

Show the PM and engineering relationship in one compact line:

```text
AI draft → engineer review → evaluation gate → human decision → ship
```

Follow it with one sentence explaining that AI increases output, while the process protects correctness and accountability.

### 3. Selected evidence

Use three evidence records instead of generic project cards.

#### LLM scoring reliability and fairness

- Public repository: `dlzcods/llm-awe-reliability-fairness`
- Public visual report
- 150 IELTS-like essays
- Two models
- Five independent scoring runs per essay
- Core finding: consistency and review workload changed materially by model
- Brand role: proves evaluation design and human-review routing

#### Eye disease classification

- Public repository: `dlzcods/eye-disease-classification`
- Fine tuned EfficientNetB0
- 4,217 retinal images
- 90.64% held-out accuracy on 844 images
- Glaucoma recall of 80.33% exposed what the average concealed
- Brand role: proves computer vision depth, honest limitation reporting, and team product integration

#### Explainability research note

- DEV Community Grad-CAM article
- Explain why accuracy alone did not answer whether the model used relevant image regions
- Link the public notebook if it remains available
- Brand role: proves concern for inspectability in high-stakes AI

The Legal RAG system can be referenced as private client or private implementation work. Do not imply that its repository is public. Link the live demo only after Vercel deployment protection is removed.

### 4. How I work

Use three short principles:

1. **No unmeasured claims.** Every AI feature needs an evaluation that matches its failure cost.
2. **Human ownership is explicit.** A model may produce the output, but a named person owns the decision.
3. **The architecture follows the risk.** Sometimes the right AI system deliberately excludes GenAI.

This section translates the portfolio philosophy into language that engineers can evaluate quickly.

### 5. Current focus

Avoid “currently exploring.” Use active, credible language:

- Designing evaluation systems for LLM and RAG workflows
- Running AI-assisted development with explicit review gates
- Building deterministic extraction and human-in-the-loop pipelines
- Translating model behavior into product and delivery decisions

### 6. Field proof

Keep this compact. Do not reproduce the full portfolio ledger.

Suggested line:

> Two years building AI systems. Clients in Singapore and Australia. Three competition placements with Jaya Koding. Invited to speak at Indonesian universities about how these systems are actually built.

Link the portfolio Field Record or LinkedIn for details.

### 7. Contact

Use plain links:

- Portfolio
- LinkedIn
- Email: `hafd324@gmail.com`

Replace the current Framer About link after the new portfolio is deployed. Do not publish a placeholder domain.

## Visual Direction

### Keep

- Native GitHub typography
- Clear section headings
- Short paragraphs
- One compact process line
- Direct repository and report links
- Metrics only where they prove something

### Remove

- Waving GIF
- Animated typing SVG
- Centered HTML layout
- Profile-view counter
- Emoji bullets
- Tool badge wall
- GitHub statistics widgets
- Decorative separators and animation GIFs
- Commented legacy markup

### Why

The absence of decoration becomes part of the brand. The README should feel like technical documentation written by someone who reviews systems, not a template assembled from profile widgets.

## Voice Rules

- Write in first person.
- Prefer direct sentences.
- Pair technical evidence with a plain-language consequence.
- Do not use hype words.
- Do not call work revolutionary, groundbreaking, or game-changing.
- Do not describe production experience as exploration.
- Do not hide limitations behind a headline metric.
- Avoid em dashes and decorative punctuation.
- Keep dry humor to one line at most.

## Recommended README Skeleton

```md
# Muhammad Abdiel Al Hafiz

AI Project Manager. AI/ML engineer by training.

I build the system around AI output: ownership, evaluation, human review, and accountable delivery.

`AI draft → engineer review → evaluation gate → human decision → ship`

## Selected evidence

### When two LLM judges disagreed
[Plain-language problem]
[Method and evidence]
[Repository] · [Visual report]

### Know Your Sight
[Plain-language problem]
[Method, metric, and visible limitation]
[Repository] · [Live product] · [Notebook]

### Explainability beyond accuracy
[Plain-language problem]
[Grad-CAM research note]
[Article] · [Notebook]

## How I work

1. No unmeasured claims.
2. Human ownership is explicit.
3. The architecture follows the risk.

## Current focus

[Four active focus areas]

## Field proof

[One compact evidence paragraph]

## Contact

[Portfolio] · [LinkedIn] · [Email]
```

## Implementation Plan

### Phase 1. Rewrite

1. Replace the current profile README completely.
2. Remove all decorative and commented legacy markup.
3. Write the identity, operating model, evidence records, principles, focus, proof, and contact sections.
4. Verify every metric against its source repository or report.

### Phase 2. Repository alignment

1. Pin the LLM reliability repository.
2. Pin the eye disease classification repository.
3. Rewrite both repository descriptions so they state the problem and evidence, not only the technology.
4. Add consistent repository topics such as `llm-evaluation`, `ai-reliability`, `computer-vision`, `human-in-the-loop`, and `model-evaluation` where accurate.
5. Improve each project README so the profile links into strong evidence rather than unfinished documentation.

### Phase 3. Portfolio alignment

1. Deploy the new portfolio.
2. Replace the Framer About link with the final portfolio URL.
3. Ensure role wording, project metrics, email, GitHub, and LinkedIn match across both surfaces.
4. Keep GitHub technical and the portfolio narrative-driven.

### Phase 4. Quality review

1. Check the README in GitHub light and dark themes.
2. Check desktop and mobile line wrapping.
3. Verify all external links.
4. Confirm that no private client implementation is presented as public.
5. Confirm that every number has a visible source.
6. Remove any sentence that could belong to another AI engineer.

## Acceptance Criteria

- The role transition is visible above the fold.
- A visitor can understand the operating philosophy within ten seconds.
- At least two public repositories support the positioning.
- Every displayed metric has a public source.
- Technical readers can reach methodology and code directly.
- General readers can understand why each project mattered.
- No GIFs, typing animations, visitor counters, badge walls, or stats widgets remain.
- No private repository is presented as public.
- Portfolio, LinkedIn, GitHub, and email links are correct.
- The README feels concise, specific, and human.

## Decision Before Writing the Final README

Use the deployed portfolio URL only after deployment. Until then, retain the current portfolio link or omit it. Do not replace it with `abdiel.dev` unless that domain is actually configured.
