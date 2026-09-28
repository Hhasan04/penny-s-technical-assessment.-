# Implementation Notes


## 1. What I changed

- Gated the Approve and Reject actions so they are available only when the CR is `PENDING_APPROVAL` and the current user has an approval policy recognized by `canApprovePolicy`.
- Fixed line-item diff detection to classify a matched SKU as changed when its quantity or unit price differs.
- Added a status filter to the CR list. `ALL` shows every CR; another status shows only matching CRs.
- Sorted the timeline chronologically using a copy of the audit entries, leaving the loaded audit data unchanged.
- Implemented Approve and Reject actions with permission, status, and duplicate-submission guards. While a request is in progress, both actions are disabled. On success, the detail is updated and the list is reloaded.
- Added rejection reason validation so blank and whitespace-only reasons cannot be submitted. The reason is trimmed before it is sent to the API.
- On an action error, reload the detail and list and show an error message. This handles the mock API case where an error can happen after the stored CR has already changed.
- Updated detail loading so it loads the initial CR and reloads when the selected CR ID changes.

## 2. Component & state model

- The detail component loads the initial CR into `ViewState` and reloads when its selected ID changes. It derives the diff, chronological timeline, and action eligibility from the loaded CR and current user, and tracks action progress and errors explicitly.
- The list stores API results in `ViewState`; `visibleRows` derives the displayed rows from that data and the selected `statusFilter`.
- The detail component tracks action progress with `submitting`, displays action failures with `actionError`, and uses a form control to validate the rejection reason.
- The app connects the list and detail components. When an action changes a CR, the detail emits `crChanged`; the app uses that event to reload the list.

## 3. Invariants I keep

| Invariant | How / where |
|---|---|
|Approve and Reject require both a pending CR and approval permission.|`canApprove` and `canReject` in `CrDetailComponent`; the template uses these values to control the actions.|
| A rejection reason must contain at least one non-whitespace character. | Validators on `rejectControl`, with a guard in `reject()`. |
| Filtering does not change the list data returned by the API. | `visibleRows` derives the displayed rows from the loaded data and `statusFilter`. |
| The timeline is displayed oldest first without sorting the loaded audit array in place. | The detail component sorts a copied audit array. |
| The list reflects an action’s resulting CR state. | The detail emits `crChanged` and the app reloads the list. |
| Only one review action can be in progress at a time. | The action methods check `submitting`, and the template disables both buttons while a request is pending. |

## 4. Testing strategy

- Ran `npm test` after the input lifecycle change; all 7 provided tests passed. No additional assessment tests were added.
- Manually checked the status filter, CR selection, chronological timeline, permission states, approval and rejection, and rejection-reason validation.
- Manually checked slow requests and simulated API failures. The controls are disabled while submitting; after a simulated failure, the detail and list reload and display the state held by the mock API.
- I reached the assessment time limit before adding the requested rendered-behavior tests. A clean `npm ci` run and final build, lint, and formatting checks after the last code change remain outstanding.

## 5. Assumptions

- The diff matches line items by SKU and classifies them as changed when quantity or unit price differs. Description-only differences are intentionally ignored because this review focuses on commercial changes.
- When a selected status has no matching CRs, I leave the loaded table visible with no data rows; the brief doesn’t specify a separate filtered-empty message.
- The mock API can report a network error after changing its stored CR. On an error, the UI reloads the CR to show the state currently held by the API rather than assuming the action was rolled back.

## 6. Where I used AI
- Used AI for codebase orientation, explaining test failures, and reviewing implementation decisions. I wrote the changes and used the explanations to understand and verify them.

## 7. What I'd improve with more time
- Add automated rendered tests for list loading, empty, error, and filtered states; detail permissions and timeline; and action success, failure, slow responses, and rejection validation.
- Improve the timeline’s date formatting and spacing so entries are easier to scan.
