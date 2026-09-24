# Change Request Review UI — Frontend Exercise (Angular)

A small **Angular** exercise for a procurement platform. You'll complete the UI an approver uses to
review and act on **Change Requests (CRs)** — proposed amendments to a live Purchase Agreement.

You do **not** build a backend. A mock API service (`src/api/cr-api.service.ts`) with realistic fixtures
is provided; treat it as the contract your components talk to. Start with
[`CANDIDATE_BRIEF.md`](./CANDIDATE_BRIEF.md) for the scenario, tasks, and acceptance criteria.

## Stack & setup

Angular 15 (standalone components, reactive forms). It's a real, runnable app: `npm start` serves the UI
in a browser, and `npm test` renders the components via `jest-preset-angular` (TestBed in jsdom). Plain
HTML/CSS.

```bash
nvm use            # Node 18.20.3
npm ci             # uses .npmrc (legacy-peer-deps) — please keep it
npm start          # ng serve -> http://localhost:4200  (run the UI to click through / record your demo)
npm test           # Jest — two tests fail on purpose; fixing them is task 1
npm run build      # ng build (production)
npm run lint
npm run format
```

### Running the UI

`npm start` boots a small demo shell (`src/app/`) that hosts the list + detail screens. Use the
**"Acting as"** switcher in the header to change the current user (approver / viewer / other-org) so you
can show your permission-aware action states in the walkthrough video. The shell is just glue for the
demo — the exercise itself is the list/detail components and their templates.

## Policy-string convention

The current user (from `SessionService`) carries permission strings shaped **`cr_{action}_{scope}`**:

| action | meaning | | scope | meaning |
|---|---|---|---|---|
| `r` | read | | `u` | user — own CRs |
| `a` | approve | | `w` | workspace |
| `x` | apply | | `o` | org |

e.g. `cr_a_o` = may approve any CR in the org; a user with only `cr_r_o` is read-only. The UI must only
offer/enable an action the current user is actually permitted to perform.

## CR statuses (read-only context)

`DRAFT → SUBMITTED → PENDING_APPROVAL → APPROVED → APPLIED`, with `REJECTED` / `CANCELLED` terminal.
Approve/Reject act on a `PENDING_APPROVAL` CR. You consume these statuses; you don't drive backend
transitions.

## Where to work

- `src/components/cr-list/cr-list.component.{ts,html}` — list page; the **status filter**
  (`visibleRows`) is a TODO.
- `src/components/cr-detail/cr-detail.component.{ts,html}` — detail page; **timeline ordering**,
  **permission-aware** `canApprove`/`canReject`, the **approve/reject actions**, and **reject-reason
  validation** are yours.
- `src/components/diff.util.ts` — the preview-panel diff; its change-detection has a defect surfaced by
  `diff.spec.ts`.

The visible tests are a starting point, not the full specification.

## Testing components

Component tests use `TestBed` and assert on rendered DOM. The mock API resolves on a timer, so tests are
real `async`: render with `detectChanges()`, let the API settle, then `detectChanges()` again. See the
provided `*.component.spec.ts` files for the exact pattern (it's a 6-line helper you can copy).

## Files

```
src/
  models/cr.models.ts              # CrSummary, CrDetail, LineItem, TimelineEntry, ReqUser
  common/                          # view-state, money.util, permissions (policy helpers)
  api/                             # fixtures + CrApiService (mock, org-scoped, latency/failNext)
  session/session.service.ts       # current user
  components/
    diff.util.ts                   # baseline-vs-proposed line-item diff
    cr-list/cr-list.component.{ts,html}
    cr-detail/cr-detail.component.{ts,html}
    diff.spec.ts                            # one failing case to start from
    cr-list/cr-list.component.spec.ts       # passing example (loaded / empty render)
    cr-detail/cr-detail.component.spec.ts   # one failing case to start from
```

## A note on AI tools

Using AI tools is allowed and expected — see the brief for the (light) disclosure policy. The follow-up
interview is built around your own code, so make sure you understand what you submit.
