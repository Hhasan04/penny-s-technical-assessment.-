# Implementation Notes

> Fill this in as part of your submission. 1–2 pages, bullet points are fine. Delete these
> instructions before submitting.

## 1. What I changed
<!-- Grouped by task: bugs fixed and features implemented (component + template). -->
- Gated the Approve and Reject actions so they are available only when the CR is `PENDING_APPROVAL` and the current user has an approval policy recognized by `canApprovePolicy`.
- Fixed line-item diff detection to classify a matched SKU as changed when its quantity or unit price differs.
- Added a status filter to the CR list. `ALL` shows every CR; another status shows only matching CRs.
- Sorted the timeline chronologically using a copy of the audit entries, leaving the loaded audit data unchanged.
- Implemented Approve and Reject actions. While a request is in progress, both actions are disabled. After success, the detail is updated and the list is reloaded.
- Added rejection reason validation so blank and whitespace-only reasons cannot be submitted. The reason is trimmed before it is sent to the API.
- On an action error, reload the detail and list and show an error message. This handles the mock API case where an error can happen after the stored CR has already changed.

## 2. Component & state model
<!-- The screens, the view-state each component exposes, and how data flows from the mock API into the
template. -->
- The detail component loads the selected CR into `ViewState`. When the selected ID changes, `ngOnChanges` loads the newly selected CR. The component derives the diff, chronological timeline, and action eligibility from the loaded CR and current user, and tracks action progress and errors explicitly.
- The list stores API results in `ViewState`; `visibleRows` derives the displayed rows from that data and the selected `statusFilter`.
- The detail component tracks action progress with `submitting`, displays action failures with `actionError`, and uses a form control to validate the rejection reason.
- The app connects the list and detail components. When an action changes a CR, the detail emits `crChanged`; the app uses that event to reload the list.

## 3. Invariants I keep
<!-- Which properties the UI guarantees, and where in the component/template each is enforced. -->

| Invariant | How / where |
|---|---|
|Approve and Reject require both a pending CR and approval permission.|`canApprove` and `canReject` in `CrDetailComponent`; the template uses these values to control the actions.
| A rejection reason must contain at least one non-whitespace character. | Validators on `rejectControl`, with a guard in `reject()`. |
| Filtering does not change the list data returned by the API. | `visibleRows` derives the displayed rows from the loaded data and `statusFilter`. |
| The timeline is displayed oldest first without sorting the loaded audit array in place. | The detail component sorts a copied audit array. |
| The list reflects an action’s resulting CR state. | The detail emits `crChanged` and the app reloads the list. 

## 4. Testing strategy
<!-- What you tested (component/DOM vs pure) and why; what you deliberately skipped given the budget. -->
- Ran `npm test -- --runInBand` after fixing the two initial failures; all 7 tests passed.
- Manually checked the status filter with `ALL` and individual statuses, including a status with no matching rows.
- Manually checked that the timeline is chronological and that Approve and Reject update the detail and list.
- Checked that an empty or whitespace-only rejection reason cannot be submitted.
- Checked slow requests: both action buttons are disabled while the request is pending.
- Checked simulated failures for Approve and Reject: the UI reloads the CR state and displays an error message.
- Automated tests for the later list and detail changes are deferred until the assessment tasks are complete.
- I reached the assessment time limit before adding automated tests for the later list and detail behavior. The original provided tests passed after the initial fixes, and I manually checked the later behavior. Additional automated tests remain unfinished.
-

## 5. Assumptions
<!-- Where the requirements left room for interpretation, the calls you made and why. -->
- The diff matches line items by SKU and classifies them as changed when quantity or unit price differs. Description-only differences are intentionally ignored because this review focuses on commercial changes.
- When a selected status has no matching CRs, I leave the loaded table visible with no data rows; the brief doesn’t specify a separate filtered-empty message.
- The mock API can report a network error after changing its stored CR. On an error, the UI reloads the CR to show the state currently held by the API rather than assuming the action was rolled back.

## 6. Where I used AI
- Used AI for codebase orientation, explaining test failures, and reviewing implementation decisions. I wrote the changes and used the explanations to understand and verify them.

## 7. What I'd improve with more time
- Add automated rendered tests for list loading, empty, error, and filtered states; detail permissions and timeline; and action success, failure, slow responses, and rejection validation.
- Improve the timeline’s date formatting and spacing so entries are easier to scan.
