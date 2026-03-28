---
name: 'generate-unit-tests'
description: 'Generate comprehensive, maintainable unit tests for selected code.'
argument-hint: 'optional: function_name=<symbol> framework=<jest|vitest|mocha|pytest|rspec|...> scope=<focused|standard|thorough> file=<path>'
---

## Task

Generate unit tests that maximize behavior coverage, regression safety, and maintainability.

Target function or method: ${input:function_name:Which function or method should be tested? (optional)}
Testing framework: ${input:framework:Which framework? (jest/vitest/mocha/pytest/rspec/etc)}
Coverage scope: ${input:scope:How deep should coverage be? (focused|standard|thorough)}
Target file (optional): ${input:file:Which file contains the target code? (optional)}

## Analyze First

1. Identify contract: inputs, outputs, side effects, and errors.
2. Identify boundaries to isolate: network, filesystem, DB, env, time, randomness, external services.
3. Follow local test conventions (naming, helpers, fixtures, mocks, setup files).
4. Extend an existing test file when possible; otherwise create an adjacent one.

## Test Strategy (priority order)

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

## Quality Requirements

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

## Framework and Project Alignment

- Use existing project framework, utilities, and assertion style.
- Reuse setup files, helpers, and factories when possible.
- Match local conventions for async tests, fake timers, and module mocking.
- For TypeScript, keep test data and mocks strongly typed.

## Output Requirements

1. Return runnable test code only.
2. Include any required imports and mock setup.
3. If creating a new test file, print this first:
   - File: <relative/path/to/test-file>
4. Test count by scope:
   - focused: 4-6 tests
   - standard: 6-10 tests
   - thorough: 10-16 tests
5. End with "Coverage summary" including:
   - Behaviors covered
   - Edge/error cases covered
   - What remains intentionally out of scope

## Constraints

- Do not change production code unless explicitly asked.
- Do not invent unsupported APIs; infer from visible code.
- If behavior is ambiguous, state brief assumptions before tests.
- If context is missing, ask the minimum clarifying questions.

Goal: high confidence, fast regression detection, low test maintenance cost.
