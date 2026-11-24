import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HOOK = fileURLToPath(new URL("./block-human-git.mjs", import.meta.url));

function runHook(command) {
  return spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({ tool_input: { command } }),
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
