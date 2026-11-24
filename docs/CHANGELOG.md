# Changelog

## Unreleased

### Changed

- The agent now commits approved iterations itself, with Conventional Commit headers scoped to one artifact each. Push and merge stay blocked. See [Commit policy](commit-policy.md).
- The push hook lets subagent types listed in `RENZE_PUSH_GRANTED_AGENTS` run a plain `git push`. Force push stays blocked for everyone.
