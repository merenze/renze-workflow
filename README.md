# renze-workflow

My personal Claude Code marketplace, holding my development workflow as skills.

| Skill                | Purpose                                                                                 |
|----------------------|-----------------------------------------------------------------------------------------|
| `renze-tdd`          | Strict red-green-refactor loop with an approval pause after every iteration             |
| `renze-architecture` | Architecture rules, the heavy-collaborator test, refactoring checklist, smell reporting |
| `renze-working-agreement` | Evidence before claims, exact scope, look before asking, plans, writing |

A `PreToolUse` hook blocks `git commit`, `git push`, `git merge`, `gh pr merge`, and completing a PR with `az repos`. Commits belong to me.

## Install

```text
/plugin marketplace add C:/Users/mrenze/source/repos/renze-workflow
/plugin install renze-workflow@renze-workflow
```

The always-on pointers live in `~/.claude/CLAUDE.md` and `~/.claude/renze/ARCHITECTURE.AGENTS.md`. They name these skills so the skills trigger on every code change.
