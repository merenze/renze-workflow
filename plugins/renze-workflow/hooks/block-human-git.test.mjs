import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HOOK = fileURLToPath(new URL("./block-human-git.mjs", import.meta.url));

const TROUBLESHOOTER = "some-plugin:fixer";
const GRANT_ENV = { ...process.env, RENZE_PUSH_GRANTED_AGENTS: `other:agent, ${TROUBLESHOOTER}` };

function runHook(command, agentType) {
  return spawnSync(process.execPath, [HOOK], {
    env: GRANT_ENV,
    input: JSON.stringify({ tool_input: { command }, agent_type: agentType }),
    encoding: "utf8",
  });
}

test("allows git commit", () => {
  assert.equal(runHook('git commit -m "feat(api): add thing"').status, 0);
});

test("blocks git push", () => {
  assert.equal(runHook("git push origin main").status, 2);
});

test("blocks git merge", () => {
  assert.equal(runHook("git merge feature").status, 2);
});

test("allows git push for an agent in RENZE_PUSH_GRANTED_AGENTS", () => {
  assert.equal(runHook("git push origin bugfix/build", TROUBLESHOOTER).status, 0);
});

test("blocks git push for agents not in RENZE_PUSH_GRANTED_AGENTS", () => {
  assert.equal(runHook("git push origin bugfix/build", "Explore").status, 2);
});

test("blocks force push for a granted agent", () => {
  assert.equal(runHook("git push --force origin bugfix/build", TROUBLESHOOTER).status, 2);
});

test("blocks git merge for a granted agent", () => {
  assert.equal(runHook("git merge feature", TROUBLESHOOTER).status, 2);
});
