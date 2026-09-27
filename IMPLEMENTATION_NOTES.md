# Implementation Notes

> Fill this in as part of your submission. 1–2 pages, bullet points are fine. Delete these
> instructions before submitting.

## 1. What I changed
<!-- Grouped by task: bugs fixed and features implemented (component + template). -->
- Gated the Approve and Reject actions so they are available only when the CR is `PENDING_APPROVAL` and the current user has an approval policy recognized by `canApprovePolicy`.
- Fixed line-item diff detection to classify a matched SKU as changed when its quantity or unit price differs.
- Added a status filter that narrows the loaded CR list. A filter with no matches leaves the table empty.

## 2. Component & state model
<!-- The screens, the view-state each component exposes, and how data flows from the mock API into the
template. -->
- The detail component loads one CR into `ViewState` and derives the diff and action eligibility from the CR data and current user’s approval policies. Timeline ordering and action flows remain to be completed.
- The list stores API results in `ViewState`; `visibleRows` derives the displayed rows from that data and the selected `statusFilter`.

## 3. Invariants I keep
<!-- Which properties the UI guarantees, and where in the component/template each is enforced. -->

| Invariant | How / where |
|---|---|
|Approve and Reject require both a pending CR and approval permission.|`canApprove` and `canReject` in `CrDetailComponent`; the template uses these values to control the actions.

## 4. Testing strategy
<!-- What you tested (component/DOM vs pure) and why; what you deliberately skipped given the budget. -->
- Ran `npm test -- --runInBand` after fixing the two initial failures; all 7 tests passed.
- Manually verified the status filter in the browser. An automated rendered test for the filter is still to be added.

-

## 5. Assumptions
<!-- Where the requirements left room for interpretation, the calls you made and why. -->
- The diff matches line items by SKU and classifies them as changed when quantity or unit price differs. Description-only differences are intentionally ignored because this review focuses on commercial changes.
- When a selected status has no matching CRs, I leave the loaded table visible with no data rows; the brief doesn’t specify a separate filtered-empty message.

## 6. Where I used AI
- Used AI for codebase orientation, explaining test failures, and reviewing implementation decisions. I wrote the changes and used the explanations to understand and verify them.

## 7. What I'd improve with more time
-
