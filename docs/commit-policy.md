# Commit policy

The agent commits approved TDD iterations locally, one commit per artifact scope. I cherry-pick commits by scope to control release order, so a scoped commit touches only its artifact.

The rules live in the `renze-tdd` skill, section "Commits". In short:

- Headers use Conventional Commits: `type(scope): subject`. The scope names an application or library in the repository.
- A diff that touches several artifacts becomes one commit per artifact. Hunks in one file are split across commits when possible.
- A change that cannot be split, such as a shared pipeline or CI template, gets one commit with no scope.

## Hook

`plugins/renze-workflow/hooks/block-human-git.mjs` runs as a `PreToolUse` hook. It blocks `git push`, `git merge`, `gh pr merge`, and completing a PR with `az repos`. It allows `git commit`.

The hook matches the whole command text, so a command that only mentions a blocked action (for example, in a heredoc) is blocked too.

## How to test it

    node --test plugins/renze-workflow/hooks/block-human-git.test.mjs

## Related

- [renze-tdd skill](../plugins/renze-workflow/skills/renze-tdd/SKILL.md)
- [README](../README.md)
