# Generate Unit Tests

Generate comprehensive, maintainable unit tests that maximize behavior coverage and regression safety.

## Step 1: Gather inputs

Collect or infer the following:

- `function_name` (optional): target symbol
- `framework`: test framework (vitest/jest/mocha/pytest/rspec/etc.)
- `scope`: `focused`, `standard`, or `thorough`
- `file` (optional): target source file path

If required context is missing, ask the minimum clarifying questions.

## Step 2: Analyze before writing tests

1. Identify contract: inputs, outputs, side effects, and errors.
2. Identify boundaries to isolate: network, filesystem, DB, env, time, randomness, external services.
3. Follow local test conventions (naming, helpers, fixtures, mocks, setup files).
4. Extend an existing test file when possible; otherwise create an adjacent one.

## Step 3: Apply test strategy in this priority order

1. Happy-path behavior
   - Typical valid inputs and outputs
   - Realistic data
2. Boundary and edge cases
   - Empty, min/max, zero, negative, large values (when relevant)
   - Null/undefined and optional fields
   - Unicode/whitespace handling for string logic
3. Invalid input and defensive behavior
   - Type mismatches and malformed structures
   - Expected errors and meaningful messages
4. Side effects and interactions
   - Correct collaborator calls and arguments
   - Correct number/order when significant
   - State changes or emitted events
5. Determinism and stability
   - Control time and randomness
   - No order dependency or shared mutable state

## Step 4: Enforce quality requirements

- Use AAA (Arrange, Act, Assert)
- Descriptive test names (behavior + condition)
- Group by behavior with describe/context
- Independent, idempotent tests
- Assert behavior over implementation details
- Use parameterized/table-driven tests for repeated scenarios
- One behavior per test
- Minimal explicit fixtures/builders
- Mock only true external boundaries
- Comment only for non-obvious setup

## Step 5: Align to framework and project conventions

- Use existing project framework, utilities, and assertion style.
- Reuse setup files, helpers, and factories when possible.
- Match local conventions for async tests, fake timers, and module mocking.
- For TypeScript, keep test data and mocks strongly typed.

## Step 6: Produce output

1. Return runnable test code only.
2. Include required imports and mock setup.
3. If creating a new test file, print first: `File: <relative/path/to/test-file>`.
4. Test count by scope:
   - `focused`: 4-6 tests
   - `standard`: 6-10 tests
   - `thorough`: 10-16 tests
5. End with `Coverage summary` including:
   - Behaviors covered
   - Edge/error cases covered
   - What remains intentionally out of scope

## Constraints

- Do not change production code unless explicitly asked.
- Do not invent unsupported APIs; infer from visible code.
- If behavior is ambiguous, state brief assumptions before tests.
