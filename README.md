# renze-workflow

My personal Claude Code marketplace, holding my development workflow as skills.

| Skill                | Purpose                                                                                 |
|----------------------|-----------------------------------------------------------------------------------------|
| `renze-tdd`          | Strict red-green-refactor loop with an approval pause after every iteration             |
| `renze-architecture` | Architecture rules, the heavy-collaborator test, refactoring checklist, smell reporting |
| `renze-working-agreement` | Evidence before claims, exact scope, look before asking, plans, writing |

The agent commits approved iterations locally, one commit per artifact scope. A `PreToolUse` hook blocks `git push`, `git merge`, `gh pr merge`, and completing a PR with `az repos`.

Test the hook with `node --test plugins/renze-workflow/hooks/block-human-git.test.mjs`.

## Install

```text
/plugin marketplace add merenze/renze-workflow
/plugin install renze-workflow@renze-workflow
```

The hook needs Node.js on `PATH`. Without it, the hook fails and push and merge are not blocked.

To work on the plugin, add the local clone instead: `/plugin marketplace add <path-to-clone>`.

Bump `version` in `plugins/renze-workflow/.claude-plugin/plugin.json` and in `.claude-plugin/marketplace.json` when publishing changes, so installed copies update.

The always-on pointers live in `~/.claude/CLAUDE.md` and `~/.claude/renze/ARCHITECTURE.AGENTS.md`. They name these skills so the skills trigger on every code change.
