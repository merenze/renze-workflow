---
name: renze-architecture
description: My architecture rules -- responsibilities, organization, layers, interfaces and the heavy-collaborator test, external systems, invariants, functions, naming, mappers, comments, refactoring checklist. WHEN: designing or adding a component, class, interface, or service; deciding whether to extract a class or interface; placing code in a namespace or folder; the refactor step of a TDD iteration; reporting a structural smell; settling a conflict between these rules.
---

# Renze Architecture

Follow these rules unless there is a compelling reason not to.

## Responsibilities

- Apply single responsibility to functions, classes, namespaces, packages, and modules.
- Keep code that changes together together. Separate code that changes independently.
- Do not mix business logic, infrastructure, formatting, and integration concerns.
- Judge extraction by volatility, not size. Split a unit that changes for two reasons; leave a long unit that changes for one.

## Organization

Organize by resource first, feature second. Do not organize primarily by technical category or layer.

Prefer `Accounts.Persistence`, `Accounts.Importing`, `Currencies.Configuration`.
Over `Repositories.Accounts`, `Services.Accounts`, `Infrastructure.Accounts`.

Framework integration points such as Controllers and Middleware may follow framework conventions.

Directory paths mirror namespaces.

## Layers

Layers are dependency rules, not namespaces. Enforce the direction; do not name folders after it.

- Domain: business concepts, rules, policies. No dependency on databases, filesystems, web frameworks, UIs, third-party APIs, or DI containers.
- Application: coordinates business operations and workflows.
- Infrastructure: implementation details and integrations. No business rules.
- Adapters: translate between this application and external systems. No business rules.
- Composition root: constructs dependencies. The only place that knows every concrete type.

Dependencies point toward business logic. The domain never depends on application or infrastructure code.

## Dependencies

- Prefer composition over inheritance. Inherit only for a true "is-a" relationship or a framework requirement.
- Depend on abstractions at boundaries and on heavy collaborators. Depend on concrete classes for light in-process collaborators.
- Use explicit dependency injection.
- No hidden dependencies, service locators, or global state.

## Interfaces

Extract classes freely for single responsibility. Extract an interface only when it:

- Isolates an external or nondeterministic dependency (I/O, persistence, third-party APIs, time, randomness)
- Defines an architectural boundary between layers
- Shields a caller's tests from a heavy collaborator
- Has a second implementation that exists now

Do not create an interface just because a class exists, or just to mock a light, pure, in-process collaborator. Inject the concrete class and test against the real one.

Prefer platform abstractions (e.g. `TimeProvider`) over custom ones.

## Use what already exists

- Prefer the framework's idiomatic mechanism over hand-rolled wiring: the Options pattern and injected options objects rather than raw values, DI-managed instances rather than static singletons, `IHttpClientFactory` or a shared `HttpClient` rather than one per call.
- Prefer an upstream API's own capability (OData filtering, server-side queries, a stored procedure the design agreed on) over reimplementing it locally.
- Before deleting a resource, trace its callers. A resource something still calls is in use.

### The heavy-collaborator test

`Gadget` depends on `Gizmo`. Treat `Gizmo` as heavy, and introduce `IGizmo` with a test double, when any of these is true:

- `Gadget`'s tests must craft inputs to steer `Gizmo` down particular branches.
- `Gadget` reacts differently to several distinct `Gizmo` outcomes, each needing a test.
- `Gadget`'s test setup duplicates setup in `Gizmo`'s tests.
- `Gizmo` has collaborators that `Gadget`'s tests would have to construct.
- A change to `Gizmo`'s rules would plausibly break `Gadget`'s tests without changing `Gadget`'s behavior.

If none apply, use the real `Gizmo`. If one starts to apply later, extract `IGizmo` then, not in advance.

## External systems

- Keep external concerns at architectural boundaries.
- Wrap third-party APIs when that reduces coupling or improves testability.
- Do not let vendor-specific types spread. Translate them into application types as early as practical.

## Invariants

- Enforce an invariant where the value is constructed, not where it is consumed.
- When a caller normalizes, re-checks, defaults, or compensates for a value it was given, the defect is in the type that produced it. Fix it there and delete the compensation.
- Several callers each compensating confirms the defect. It is not a reason for a shared helper.
- Prefer fixing or upgrading an upstream dependency over a local workaround. When a workaround is still right, state what upstream change retires it.
- Put a cross-cutting concern in the library that owns the surrounding mechanism, so every consumer gets it. Disclose the release-coupling cost; do not let it decide alone.

## Functions

- One thing per function. Do not mix levels of abstraction.
- Prefer small functions; extract meaningful helpers when they improve clarity.
- Prefer pure functions when practical. Keep side effects few and at the edges.
- Order functions breadth-first within a file.
- A long parameter list signals a missing abstraction or a second responsibility. Find out which; do not just bundle arguments into an options object.

## Naming

Name by responsibility: Repository, Importer, Formatter, Validator, Calculator, Mapper.
Avoid: Manager, Helper, Utility, Processor, Service.

Do not abbreviate names or add arbitrary prefixes. When a length limit forces an abbreviation, name the limit.

## Mappers

Mappers translate between representations. No business rules, no persistence, no workflow orchestration.

## Comments

Default to zero comments. A comment is a failure to write sufficiently expressive code. First rename, extract, or restructure until the code explains itself.

These rules apply equally to infrastructure and configuration: Terraform, YAML, pipeline definitions. Before keeping any comment, delete every clause the code already states or implies.

Allowed only for a non-obvious why that code cannot express:

- A workaround for an external bug or platform quirk
- An outside constraint (regulation, contract, vendor limit)
- A deliberate trade-off with a known ceiling
- A comment convention the project requires

Never write: comments restating the code, step narration, banners or section dividers, change notes (`// Added for X`, `// Fixed`), commented-out code, doc comments on non-public members, or doc comments on public members unless the project already uses them or publishes API docs.

Leave existing rule-breaking comments alone unless asked; do not add more in that style.

## Refactoring checklist

Before finalizing code, evaluate naming, responsibilities, dependency structure, abstraction levels, duplication, and testability. Refactor when it improves clarity or maintainability.

Code added earlier in the current PR is in scope. Restructuring it is the refactor step of the same red-green-refactor cycle, not an unrelated refactor. Deferring it ships a structure already known to be wrong, plus the scaffolding holding it up.

## Reporting a smell

Report a structural problem with:

- its `file:line`
- the concrete cost it will impose
- the specific restructure

"Feels wrong" is a prompt to look harder, not a finding.

## Settling conflicts

When these rules pull in different directions, prefer the design that, in this order:

1. Is easiest to understand.
2. Has the fewest responsibilities per unit.
3. Minimizes coupling.
4. Maximizes testability.
5. Depends on abstractions rather than implementations, where the Interfaces rules call for one.
6. Keeps external concerns at architectural boundaries.
7. Needs the fewest comments to explain.
8. Can be changed with the least impact on surrounding code.

## Avoid

God objects, utility classes, service locators, static global state, business logic in controllers, persistence layers, or adapters, premature abstraction, generic manager classes.
