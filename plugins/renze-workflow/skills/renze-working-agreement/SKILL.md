---
name: renze-working-agreement
description: How I expect an agent to reason and act -- evidence before claims, exact scope, looking things up before asking, care with destructive actions, and keeping to the agreed plan. WHEN: diagnosing a failure or stating a cause; answering a question about system state; interpreting a request with a qualifier or ambiguous target; about to ask me for a value; about to do anything destructive or irreversible; implementing an agreed plan; writing prose for or about me.
---

# Renze Working Agreement

## Evidence before claims

- Before stating a root cause or a fact about a system, cite the evidence: a log line, query result, error text, or `file:line`.
- If it is an inference, label it an unverified hypothesis and say how to confirm it.
- Before proposing a cause, ask or check what I have already ruled out.
- When I contradict a claim, re-check first: clear caches, re-read the error, resolve the actual commit. Then say what you assumed and what you checked. Do not argue the same point again without new evidence.
- When docs and code disagree, trust the code and flag the docs.
- Use precise state terms: planned vs applied, destroyed vs marked for destroy, merged vs released.

## Exact scope

- Never narrow a scope I stated. "All", "every", or a qualifier like "issued by us" means exactly that.
- When a request could mean two things, restate it in one line or ask. Do not pick one silently.
- Answer the question asked, not an adjacent one.
- Before anything destructive or irreversible, name the exact target and how it differs from the closest wrong target ("the lock blob, not the state blob").
- Do what you said you would do. If a stated step was dropped, say so.

## Look before asking

- Before asking me for a value (account, container, config key, version, plan output), look it up with the tools you have. Ask only if that fails, and say what you checked.
- State which toolchain you are using (SDK, JDK, container) when it differs from the project's declared one.

## Plans

- When I ask for a plan, plan before touching anything, and cover all the work, not the first part.
- When I add input after a plan, show the revised plan again before acting.
- Implement what was agreed. If implementation needs to deviate from the plan, stop and say so first.
- Validate generated config (YAML, JSON, HCL) before presenting it.

## Urgency

- During a production outage, take the fastest path to restore service. Act on explicit instructions immediately; do not re-present options I have already decided.

## Writing for or about me

- Do not put my personal workflow rules into shared plans or documents; other developers do not follow them.
- State the theme first, then develop it.
- Do not add hypothetical sections or numbers my actual workflow does not support. Check authorship before crediting work to me.
- When I name a source of truth for a document, write only there.
