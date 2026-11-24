---
name: renze-tdd
description: My strict red-green TDD loop with an approval pause after every iteration. WHEN: any code change -- implementing a feature or use-case step, fixing a bug, adding or changing tests, extending a component, choosing the next slice. Takes precedence over lean-build, surgical-patch, safe-refactor, and verify-and-stop.
---

# Renze TDD

Follow this loop by default unless I explicitly say otherwise.

## Precedence over other skills

- This loop replaces the caveman workflow skills (`lean-build`, `surgical-patch`, `safe-refactor`, `verify-and-stop`) for the same jobs. Use their checks only if they fit inside this loop.
- The commit rules below replace `caveman-commit`.
- The approval pause summary is required even when a terse voice (caveman) is active.
- Subagents do not see this skill. Do not dispatch an iteration to a subagent unless the brief includes the approval pause.

## The iteration

1. Identify the **next logical step in the application use case** being implemented.
2. Write or update the **smallest failing test case(s)** needed for that step.
3. Run the tests and confirm the new test(s) fail for the expected reason.
4. Implement the **smallest change** needed to make those test(s) pass.
5. Run the relevant tests again and confirm they pass.
6. Refactor code added in this iteration or earlier in the current PR, using the `renze-architecture` Refactoring checklist. Look specifically for chunks worth extracting into a well-named function, repeated literals worth a named constant, and hand-rolled wiring the framework already provides. Re-run the tests.
7. Summarize: tests added or changed, implementation added or changed, use-case step completed, and what the refactor step considered and changed (or why it changed nothing).
8. Propose the commits, split by scope (see Commits).
9. **Stop and wait for approval.**
10. On approval, make the proposed commits, then start the next iteration.

Never pause between red and green. Red, green, and refactor all complete before the pause.

Never continue automatically. Do not begin the next test, slice, refactor, or follow-up until I approve.

## Commits

- When I approve an iteration, commit its diff unless it is already committed. Do not commit before approval.
- Only an explicit approval of this iteration counts. An answer to a different question (a plan choice, a PR split, "sure, 3") is not approval of the next slice; ask again.
- Never push, merge, or complete a pull request. The only exception is an agent the hook grants push to (see `docs/commit-policy.md`).

### Revert commits

Never keep git's default revert header. Make it Conventional, with the scope of the reverted commit, and keep the default text after the prefix:

```text
revert(api): Revert "feat(api): add thing"

This reverts commit <full sha>.
```

Use `git revert --no-commit <sha>`, then `git commit` with that message. This applies to every revert, not only in a TDD loop.

### Header

Use Conventional Commits: `type(scope): subject`.

- The scope names the artifact the change belongs to: most often an application or library in the repository.
- The scope may be shorter than the artifact's directory name, but it must identify one artifact without doubt. Reuse the scope that `git log` already uses for that artifact.
- I cherry-pick commits by scope to control release order. A commit with a scope must touch only that artifact.

### Splitting by scope

- If the diff touches several artifacts, make one commit per artifact, each with its own scope.
- If one file holds hunks for several artifacts (for example, a doc updated for two libraries), split the file's hunks across those commits. Stage hunks without an interactive command: write the hunks for one scope to a patch and apply it with `git apply --cached`.
- If a change cannot be split because one hunk affects several artifacts (for example, a shared pipeline or CI template), put it in one commit with no scope: `type: subject`.
- After committing, confirm with `git status` that nothing from the approved diff is left uncommitted.

## Ready means proven

Do not call an iteration, PR, or change done or ready until:

- the tests pass, and any CI or build validation you can see is green
- the diff is visible where I will look: the right repo, submodule, and branch
- the production entry point actually invokes the new behavior, not only the tests

## Choosing the next slice

Choose the next step based on the **next logical action in the application use case**. Prefer workflow-driven vertical slices, not "complete the whole component up front."

- Base the next iteration on what the user or system logically needs next.
- Implement only the behavior that step requires.
- Do not build out a component just because it has been introduced. Defer capabilities until the workflow needs them.

### Backend before frontend

If the next step needs both backend and frontend changes, do the backend in this iteration and the frontend in the next. Combine them only when I explicitly ask.

### Dependencies before callers

When a step depends on behavior in another component, implement the dependency first with its own failing tests. Implement the caller in a later iteration.

If `Gadget.DoThis()` must call `Gizmo.DoThis()` and then `Gizmo.DoThat()`:

1. `Gizmo.DoThis()` with tests.
2. The `Gadget.DoThis()` behavior that uses `Gizmo.DoThis()`.
3. `Gizmo.DoThat()` with tests.
4. The `Gadget.DoThis()` behavior that uses `Gizmo.DoThat()`.

## Scope control

- Make the smallest change that satisfies the current failing test(s).
- Add no member, field, parameter, dependency, or test that the current failing test does not exercise. An unused logger field is scope creep.
- Do not test purely declarative configuration (one column mapping, one attribute) unless every sibling would get the same test.
- Before proposing a slice, name the use-case or card requirement it satisfies. If it satisfies none, do not propose it. Verification that belonged in an earlier slice is not a slice of its own.
- No speculative abstractions, no unrelated refactors, no future workflow steps.
- Do not propose a standalone refactor PR or a large redesign mid-task. Fold small fixes into the current slice; write larger ideas up as a deferred proposal.
- A fix is never too small for the loop. A one-line bug fix is still a full slice with a red test.
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

Proposed commits:
<commit header here>
- <files or hunks in this commit>

Awaiting approval to commit and continue.
```

Each commit header must be a fenced code block tagged `text`, never a file link. List under it the files, or the hunks of a split file, that the commit holds.

Derive the headers from the actual uncommitted diff at the pause, not from the session's topic. If the diff contains a breaking change, say so in the summary and name the contract it breaks. Never call a change breaking without naming that contract.

Acceptable:

````markdown
```text
refactor(normalizer): extract merge logic into named helpers
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
