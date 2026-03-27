---
name: 'refactor-safely'
description: 'Refactor code for readability and maintainability without behavior change'
argument-hint: 'target=<file|module|function|method> optional: focus=<naming|structure|duplication|error-handling|maintainability> tests_first=<yes|no>'
agent: 'agent'
---

## Task

Refactor the target area for clarity and maintainability while preserving behavior.

Target: ${input:target:What should be refactored? (file/module/function/method)}
Focus: ${input:focus:Optional focus (naming/structure/duplication/error-handling/maintainability)}
Tests first: ${input:tests_first:Optional tests-first mode (yes/no)}

## Optional Tests-First Mode

- If `tests_first=yes`, start by invoking `/generate-unit-tests` for the target area before any refactor edits.
- If `target` is a specific function or method, pass that exact target to `/generate-unit-tests` as `function_name=<target>`.
- When applicable, pass parameters to `/generate-unit-tests`:
  - `function_name=<target function or method>`
  - `framework=<jest|vitest|mocha|pytest|rspec|...>`
- Run those tests, then refactor, then run them again to confirm behavior parity.

## Requirements

- Do not change externally observable behavior.
- Prefer small, reviewable commits of change.
- Highlight risky areas before editing.
- Add or run tests that demonstrate behavior parity.
- Keep public APIs stable unless explicitly requested.

## Output

Return:

- What was refactored and why
- Any risk points
- Evidence of behavior parity (tests/checks)
