---
name: 'generate-unit-tests'
description: 'Generate unit tests for selected functions or methods'
argument-hint: 'Optional: function_name=<target> framework=<jest|vitest|mocha|pytest|rspec|...>'
agent: 'agent'
---

## Task

Generate focused unit tests for the selected function/method.

Target function: ${input:function_name:Which function or method should be tested?}
Testing framework: ${input:framework:Which framework? (jest/vitest/mocha/pytest/rspec/etc)}

## Coverage Checklist

- Core behavior with realistic data
- Input validation (`null`/`undefined`, empty values, invalid types)
- Boundaries (min/max/zero/negative)
- Error paths and thrown exceptions
- Side effects/interactions (state changes, external calls)

## Requirements

- Use existing project framework/patterns.
- Follow AAA (Arrange, Act, Assert).
- Write clear, scenario-based test names.
- Group related tests in `describe`/`context`.
- Mock external dependencies cleanly.
- Create 5-8 high-value tests focused on behavior (not implementation).
- Keep tests independent and order-agnostic.
- Add comments only for non-obvious setup/assertions.

Return runnable tests that improve confidence and catch regressions.
