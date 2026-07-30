# Client from France post structure

## Working intent

One LinkedIn post combining:

1. Abdiel's first serious experience working closer to the global market.
2. A project expected to take a maximum of three months but requiring almost six
   months for the milestones handled by the team.
3. The difference between executing requests and questioning the complete
   input-to-output contract.
4. Honest technical proof from the accepted milestone.
5. A personal change in how Abdiel approaches requirements and execution.

The project name remains private. Publicly describe it as:

> project bareng client dari Prancis

When one technical description is necessary:

> sistem validasi bukti produk berbasis AI

## Dominant story

The post is not primarily about OCR, model performance, or a difficult client.

It is about Abdiel learning that questioning the work is part of doing the work.

The technical system proves why that change happened.

## Full narrative structure

### Paragraph 1: Start from the ending

Approved opening:

> Setelah hampir enam bulan, milestone yang kami pegang bareng client dari
> Prancis akhirnya diterima dan semua hasil implementasinya sudah gue handover
> ke developer berikutnya, tapi kalau project yang sama datang lagi besok, gue
> nggak akan mulai dari codebase.

Function:

- Establish that the project ended successfully.
- Introduce the counterfactual without using trailer-like fragments.
- Create curiosity about what Abdiel would do before opening the codebase.
- Keep the client and project anonymized.

### Paragraph 2: Original expectation

Approved direction:

> Awalnya gue masuk ke project ini sebagai pengalaman pertama gue kerja lebih
> dekat dengan global market. Timeline awalnya maksimal tiga bulan. Gue belum
> tahu kalau bagian tersulitnya bukan bikin modelnya jalan, tapi memastikan
> semua orang sedang membicarakan input, output, dan definisi “selesai” yang
> sama.

Function:

- Explain why the project mattered personally.
- Keep money out of the story.
- Establish the three-month expectation.
- Move naturally from ambition into process.

### Paragraph 3: Explain why the timeline expanded

Core points:

- No single model was broken for six months.
- Important parts of the execution contract became clear gradually.
- Canonical inputs, model revisions, crop provenance, gate behavior, and output
  semantics were not completely frozen at the beginning.
- Abdiel's team also entered implementation before completing a strict asset and
  contract audit.

Tone requirement:

Share responsibility. Do not make the client the antagonist.

Possible wording direction:

> Yang bikin timeline-nya melebar bukan satu model yang gagal terus-terusan.
> Beberapa bagian penting dari kontrak eksekusinya baru benar-benar jelas
> setelah mismatch muncul, dan dari sisi kami juga terlalu cepat masuk ke
> implementasi sebelum semua asset, input, dan expected output diaudit sampai
> habis.

### Paragraph 4: The technical clue

Use one comparison rather than the full architecture.

Core evidence:

- The initial run used raw product images.
- The baseline used canonical frozen crops.
- The downstream deterministic parser matched exactly when given the same
  multisource evidence.
- The main divergence was upstream.

Plain-language meaning:

> Script yang sama tetap bisa menghasilkan keputusan yang berbeda kalau bukti
> yang masuk ke dalamnya bukan bukti yang sama.

Do not claim there was one cinematic discovery. Explain that the understanding
formed through comparison and clarification.

### Paragraph 5: What changed in Abdiel's behavior

This is the personal turn.

Before execution, Abdiel would now freeze:

- official scope
- canonical inputs
- model and script revisions
- expected artifacts
- gate semantics
- missing-evidence behavior
- acceptance criteria
- recovery expectations

Do not present this as a checklist in the final caption. Convert it into natural
prose.

Possible wording direction:

> Sejak itu pertanyaan gue sebelum project jalan jadi jauh lebih banyak. Bukan
> cuma modelnya apa atau endpoint-nya dimana, tapi input resmi yang mana, versi
> mana yang dianggap benar, evidence yang hilang harus diapain, dan kondisi apa
> yang bikin satu output boleh jalan otomatis atau harus berhenti di manusia.

### Paragraph 6: What the team actually contributed

Keep attribution accurate.

The client supplied important scripts, model assets, frozen crops, metadata, and
weights. Abdiel's team:

- integrated the components
- hardened research scripts into recoverable workers
- added checkpoints, manifests, hashing, and evidence traceability
- implemented strict final gate combination
- projected results to PostgreSQL
- published artifacts to MinIO
- synchronized HITL results into the reviewer dashboard
- documented deployment and recovery

Condense this in the final caption. The honest claim is:

> Kami productionize dan validasi pipeline yang komponen intinya sudah disuplai
> client, lalu bikin semuanya bisa dijalankan, dihentikan, dilanjutkan,
> diperiksa, dan dihandover tanpa harus menebak-nebak ulang.

### Paragraph 7: Outcome

Use only publicly approved figures.

Supported result:

- 189 products
- 118 AUTO
- 71 HITL
- zero unsafe AUTO in the validated run
- technical demo completed
- milestone accepted
- implementation documented and handed over

Explain HITL:

> 71 produk yang masuk HITL bukan berarti pipeline gagal. Sistemnya memang
> memilih berhenti ketika evidence yang dibutuhkan belum cukup aman buat
> keputusan otomatis.

This line is important because it expresses Abdiel's human-in-the-loop position.

### Paragraph 8: Personal landing

Return to the opening counterfactual.

Preferred direction:

> Jadi kalau project yang sama datang lagi, gue tetap bakal buka codebase, tapi
> bukan itu yang pertama. Gue bakal mulai dari memastikan semua orang punya
> definisi yang sama tentang apa yang masuk, apa yang keluar, dan kapan satu
> hasil boleh dianggap selesai.

Optional final observation:

> Sekarang kalau satu requirement terasa terlalu cepat jelas, gue malah mulai
> curiga.

Use the optional final sentence only if the preceding paragraph earns it.

## What to omit

- ENOM or other internal project names
- Private client communication ratings
- Claims that the client replaced the team
- Claims that every model was built by Abdiel's team
- Exact private infrastructure and folder structures
- Full architecture inventory
- A complaint about the six-month duration
- Any claim of full production hardening
- Money as the reason the global market mattered

## Visual structure

This remains one LinkedIn post. A carousel is optional.

### Preferred three-slide carousel

1. An anonymized dashboard showing the accepted system in use.
2. A readable artifact demonstrating why identical code was not enough, if
   client-safe.
3. A final AUTO and HITL summary or handoff artifact.

### If using one image

Use a tightly cropped anonymized dashboard. Preserve enough context to show that
it is a real reviewer product, but remove:

- project and client names
- product identities
- URLs
- credentials
- internal IDs
- private data

Do not use a meme as the cover. Let the personal opening create curiosity and
let the dashboard prove the work.

