# Refactor Safely

Refactor a target area for clarity and maintainability while preserving behavior.

## Step 1: Resolve scope

Identify the refactor target (file, module, function, or method) and optional focus area (naming, structure, duplication, error-handling, maintainability).

## Step 2: Optional tests-first mode

If tests-first mode is requested:

- Run `/generate-unit-tests.md` for the same target before refactor edits.
- If target is a specific function or method, pass it as the function name focus.
- Prefer the project's existing framework.
- Run the tests and capture baseline behavior.

## Step 3: Highlight risks before editing

Call out risky behavior areas before changes, especially validation, side effects, state transitions, data persistence, and auth or security paths.

## Step 4: Refactor in small steps

Make focused internal improvements without changing externally observable behavior.
Keep public APIs stable unless explicitly requested.
Prefer small, reviewable commits.

## Step 5: Verify parity

Run relevant tests again and report behavior parity evidence.
If tests are missing, add or run the smallest meaningful checks to demonstrate parity.

## Step 6: Return summary

Return:

- What was refactored and why
- Any risk points
- Evidence of behavior parity (tests and checks)
