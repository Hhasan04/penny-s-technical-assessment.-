# Frontend Take-Home: Change Request Review UI (Angular)

Thanks for your time. This exercise mirrors a normal slice of frontend work on our team: complete an
existing Angular UI against a fixed API contract, get the component state, templates, and permission
logic right, handle the unhappy paths, and test the behavior that matters.

We're looking at how you model component state, build templates that reflect it, respect permissions,
handle the unhappy paths, and test rendered behavior.

**Time budget:** ~10–16 focused hours across 4 days. If you run out of time, **stop and document what's
left** — scoping is part of the signal.

## 1. Scenario

Organizations ("buyers") purchase under **Purchase Agreements**. When an agreement needs to change, a
**Change Request (CR)** is raised and routed for approval. Your job is the **reviewer UI**: the screens
an approver uses to find a CR, understand exactly what it changes, see its history, and approve or
reject it — with the UI only ever offering/enabling actions the current user is allowed to take.

You consume the provided mock API service (`src/api/cr-api.service.ts`). You do not build a backend.

## 2. The provided scaffold

An Angular 15 app (standalone components, reactive forms; tested with Jest + TestBed — see `README.md`):

- Models, a mock `CrApiService` (org-scoped, with injectable `latencyMs` and a `failNext` switch),
  fixtures, a `SessionService` holding the current user, and permission helpers.
- Two components (list + detail) with **real `.html` templates** — some parts work, some are `TODO`, and
  a couple have bugs.
- A test suite. Some tests pass; two fail on purpose. Treat the provided tests as a starting point, not
  the full specification.

## 3. Required tasks

**Task 0 — Orient (no code).** Read the README and skim the models/fixtures/templates. In
`IMPLEMENTATION_NOTES.md` describe the screens and state in your own words (3–5 sentences).

**Task 1 — Fix the two failing tests at the root.**
- The **diff/preview** misclassifies a changed line item (`diff.spec.ts`).
- The **detail** page enables Approve for a user who isn't permitted (`cr-detail.component.spec.ts`).

Find and fix the underlying cause of each.

**Task 2 — Change Request list UI.** In `cr-list.component`:
- the loading / loaded / empty / error states are wired — keep them correct, and
- implement the **status filter** so `visibleRows` (and the rendered table) narrows by status.

**Task 3 — Change Request detail UI.** In `cr-detail.component` + its template:
- the **diff/preview panel** (added / removed / changed / unchanged rows, with totals and delta),
- the **approval timeline**, rendered **chronologically**,
- **permission-aware action visibility**: whether Approve/Reject are offered/enabled must respect both
  the CR's status and the user's policies,
- **Approve / Reject actions** that call the API and behave correctly on a slow or failing response,
- **Reject reason validation**: a reason is required before Reject can proceed.

**Task 4 — Role/permission-aware + UX states.** A read-only user sees the data but cannot see/enable
actions; loading, empty, and error states are represented explicitly in the templates (no blank
screens).

**Task 5 — Tests.** Add your own tests (component/DOM where relevant). Cover the behavior you built —
list states and filter, the diff, the timeline, the permission logic, the action flows and their
unhappy paths, and validation. We value tests that pin rendered behavior and edge cases over a coverage
number.

Some of the details are left for you to decide — where you make a call, state it in
`IMPLEMENTATION_NOTES.md`.

## 4. Acceptance criteria

- Both originally-failing tests pass.
- List renders correct loading/empty/error states and a working status filter.
- Detail renders a correct diff, a chronological timeline, and correct totals/delta.
- Action controls respect **both** CR status and user permissions; read-only users get no enabled actions.
- Approve/Reject behave correctly on slow and failing responses and keep the view coherent.
- Reject is blocked until its reason is valid.
- Your added tests meaningfully cover the behavior you built.

## 5. Non-functional requirements

- Keep the existing structure and Angular patterns; match the code style (ESLint + Prettier ship).
- Keep component state explicit; avoid hidden mutable state and template logic that can't be tested.
- No new heavyweight dependencies (no UI kit needed) without a note explaining why.

## 6. Testing expectations

`npm test` must pass on a clean `npm ci`. Prefer fast, deterministic tests; drive `latencyMs`/`failNext`
on the mock API rather than real delays. We value tests that pin **rendered behavior and edge cases**
(disabled buttons, shown errors, ordering) over a coverage number.

## 7. Documentation — `IMPLEMENTATION_NOTES.md`

A short, honest note (1–2 pages): what you changed, your component/state model, the invariants you keep,
your testing strategy, assumptions and judgment calls, where you used AI, and what you'd improve with
more time.

## 8. AI usage policy

Using AI tools is allowed and expected. No penalty. Briefly disclose where you used it, and be ready in
the interview to explain and **modify your own code** live (e.g. add an action or a filter). Surface-level
generated code you can't reason about will show — through conversation and live changes, not detection
tools.

## 9. Submission

- A **git repository** with full commit history (please don't squash).
- `IMPLEMENTATION_NOTES.md` at the root.
- A **5–8 minute screen-recording**: walk through the list + detail screens (including a rejection and an
  error state) and one non-trivial decision.
- Ensure `npm ci && npm test` works from a clean clone.

## 10. Suggested 4-day timeline

| Day | Focus |
|---|---|
| 1 | Set up, read, orient. Fix the two failing tests (Task 1). |
| 2 | List states + filter (Task 2). |
| 3 | Detail: diff, timeline, permission gating, actions, validation (Task 3–4). |
| 4 | Your tests (Task 5), polish empty/error states, notes, record the video. |

## 11. Follow-up interview

A 45–60 min session on **your** submission: walk us through your component state and templates; make a
**live change** (e.g. add a "Return" action or a new filter); debug a scenario we describe (e.g. "Approve
was clicked twice on a slow network — how does your template/component prevent a double action?"); and
discuss one tradeoff.
