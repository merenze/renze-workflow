---
name: renze-tdd
description: Matthew Renze's strict red-green TDD loop with an approval pause after every iteration. WHEN: any code change -- implementing a feature or use-case step, fixing a bug, adding or changing tests, extending a component, choosing the next slice. Takes precedence over lean-build, surgical-patch, safe-refactor, and verify-and-stop.
---

# Renze TDD

Follow this loop by default unless Matthew explicitly says otherwise.

## Precedence over other skills

- This loop replaces the caveman workflow skills (`lean-build`, `surgical-patch`, `safe-refactor`, `verify-and-stop`) for the same jobs. Use their checks only if they fit inside this loop.
- The commit header format below replaces `caveman-commit` and Conventional Commits.
- The approval pause summary is required even when a terse voice (caveman) is active.
- When an organization skill requires a verification artifact, record it in step 5: command, exit code, criterion met.
- Subagents do not see this skill. Do not dispatch an iteration to a subagent unless the brief includes the approval pause.

## The iteration

1. Identify the **next logical step in the application use case** being implemented.
2. Write or update the **smallest failing test case(s)** needed for that step.
3. Run the tests and confirm the new test(s) fail for the expected reason.
4. Implement the **smallest change** needed to make those test(s) pass.
5. Run the relevant tests again and confirm they pass.
6. Refactor code added in this iteration or earlier in the current PR, using the `renze-architecture` Refactoring checklist. Re-run the tests.
7. Summarize: tests added or changed, implementation added or changed, use-case step completed.
8. Suggest a commit header.
9. **Stop and wait for approval.**

Never continue automatically. Do not begin the next test, slice, refactor, or follow-up until Matthew approves.

## Choosing the next slice

Choose the next step based on the **next logical action in the application use case**. Prefer workflow-driven vertical slices, not "complete the whole component up front."

- Base the next iteration on what the user or system logically needs next.
- Implement only the behavior that step requires.
- Do not build out a component just because it has been introduced. Defer capabilities until the workflow needs them.

### Backend before frontend

If the next step needs both backend and frontend changes, do the backend in this iteration and the frontend in the next. Combine them only when Matthew explicitly asks.

### Dependencies before callers

When a step depends on behavior in another component, implement the dependency first with its own failing tests. Implement the caller in a later iteration.

If `Gadget.DoThis()` must call `Gizmo.DoThis()` and then `Gizmo.DoThat()`:

1. `Gizmo.DoThis()` with tests.
2. The `Gadget.DoThis()` behavior that uses `Gizmo.DoThis()`.
3. `Gizmo.DoThat()` with tests.
4. The `Gadget.DoThis()` behavior that uses `Gizmo.DoThat()`.

## Scope control

- Make the smallest change that satisfies the current failing test(s).
- No speculative abstractions, no unrelated refactors, no future workflow steps.
- If you notice other useful work, mention it in the summary. Do not do it before approval unless the current tests need it.

## Testing

- Write tests before implementation.
- Make the failure mode explicit.
- Run the smallest relevant test scope first, then broader scopes if needed.
- Report results clearly. If tests cannot run, say so and state what must be run.

## Communication

- Start by stating the current workflow step.
- State the phase: test writing, implementation, refactor, or approval pause.
- Keep summaries concise but complete.

## Approval pause format

```text
Summary:
- Added failing test(s) for ...
- Implemented ...
- Verified relevant tests pass.

Suggested commit header:
<commit header here>

Awaiting approval to continue.
```

The commit header must be a fenced code block tagged `text`. It has no Conventional Commit prefix or scope, and is never a file link.

Acceptable:

````markdown
```text
extract merge logic into named helpers in normalizer
```
````

Unacceptable: a markdown link to a file, plain unfenced text, or inline backtick code.

## Priority order

When goals conflict:

1. Follow strict TDD.
2. Stop after each successful iteration and wait for approval.
3. Choose the next slice by the next logical workflow step.
4. Backend before frontend.
5. Keep changes minimal and scoped.
