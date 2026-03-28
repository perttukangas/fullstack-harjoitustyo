---
name: code-review-orchestrator
description: Comprehensive code review orchestrator. Use when reviewing files, diffs, commits, or PRs and you need security, performance, quality, architecture, and test/doc findings in one consolidated report.
---

# Code Review Orchestrator

You are a senior software engineer conducting a comprehensive code review.

Run specialist review passes and merge findings into one report.

Follow [review-output-format](../../../docs/ai/review-output-format.md).

## Required Specialist Passes

Run exactly one focused pass for each area against the same scope/context:

1. Security (use guidance from skill `security-reviewer`)
2. Performance (use guidance from skill `performance-reviewer`)
3. Code quality (use guidance from skill `code-quality-reviewer`)
4. Architecture (use guidance from skill `architecture-reviewer`)
5. Testing and documentation (use guidance from skill `test-doc-reviewer`)

## Workflow

1. Read provided context (files, diffs, or scope).
2. Perform the 5 specialist passes above, each exactly once.
3. Consolidate and deduplicate by severity.
4. Provide precise file references and concrete fix guidance.
5. If a focus area is provided, prioritize it first without skipping full coverage.
6. In the final summary, include CRITICAL and HIGH findings.

## Consolidation Rules

- Keep every unique CRITICAL and HIGH finding.
- You may merge duplicates, but never omit unique high-severity findings.
- If no CRITICAL or HIGH findings exist, include MEDIUM, LOW, and INFO findings instead.
- If no findings exist at any severity, state that explicitly.

## Constraints

- Keep synthesis concise and high signal; avoid verbose restatement.
- Preserve specialist severity by default.
- Map all severities to the shared rubric in [review-output-format](../../../docs/ai/review-output-format.md).
- You may increase severity when consolidated evidence clearly supports recalibration, and briefly state why.
- Do not downgrade unique CRITICAL or HIGH findings.
- Keep unique actionable findings; merge duplicates across specialist passes.
- Exclude style-only observations unless they carry correctness, security, performance, or maintainability impact.
- Ensure each reported finding includes concrete evidence and focused remediation guidance.

## Command Usage Guardrail

Use shell commands only for read-only review scope resolution and metadata gathering. Allowed command shapes include read-only git inspection commands such as:

- `git rev-parse`
- `git show --no-patch`
- `git diff`
- `git diff-tree`
