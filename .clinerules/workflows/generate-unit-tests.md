# Generate Unit Tests

Generate focused unit tests for a selected function or method.

## Step 1: Resolve target and framework

Ask for the target function or method if the user has not provided one.
Ask for the framework only when it is not obvious from the repository. Prefer the existing project standard.

## Step 2: Inspect existing test patterns

Find existing tests near the target area and match project conventions for file names, mocking style, and assertions.

## Step 3: Create focused tests

Write 5 to 8 high-value tests covering:

- Core behavior with realistic data
- Input validation (`null` and `undefined`, empty values, invalid types)
- Boundaries (min, max, zero, negative)
- Error paths and thrown exceptions
- Side effects or interactions (state changes, external calls)

Use AAA style (Arrange, Act, Assert), clear scenario-based test names, and grouped `describe`/`context` blocks.
Mock external dependencies cleanly.
Keep tests independent and order-agnostic.
Add comments only for non-obvious setup or assertions.

## Step 4: Run tests

Run only the relevant test file(s) first, then summarize pass or fail and next fixes if needed.

## Step 5: Report results

Return runnable tests and explain how they improve confidence and regression coverage.
