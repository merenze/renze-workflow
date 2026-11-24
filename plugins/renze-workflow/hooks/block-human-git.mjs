import { readFileSync } from "node:fs";

const GIT = String.raw`\bgit\b(?:\s+-[Cc]\s+\S+|\s+-\S+)*\s+`;
const HUMAN_OWNED = [
  { pattern: new RegExp(GIT + String.raw`push(?![\w-])`), action: "git push" },
  { pattern: new RegExp(GIT + String.raw`merge(?![\w-])`), action: "git merge" },
  { pattern: /\bgh\s+pr\s+merge\b/, action: "gh pr merge" },
  { pattern: /\baz\s+repos\s+pr\s+update\b.*--status\s+completed\b/, action: "completing a PR" },
];

const input = JSON.parse(readFileSync(0, "utf8"));
const command = input.tool_input?.command ?? "";
const blocked = HUMAN_OWNED.find(({ pattern }) => pattern.test(command));

if (blocked) {
  process.stderr.write(
    `Blocked: ${blocked.action} belongs to the developer. Commit approved work locally and stop.\n`,
  );
  process.exit(2);
}
