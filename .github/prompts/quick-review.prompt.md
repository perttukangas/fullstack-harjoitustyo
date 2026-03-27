---
name: 'quick-review'
description: 'Quick review of files changed from HEAD using Code Review Orchestrator'
argument-hint: 'optional: focus=<security|performance|quality|architecture|tests>'
agent: 'Code Review Orchestrator'
---

## Task

Run a quick code review focused on files changed from `HEAD`.

Optional focus: ${input:focus:Optional focus area (security|performance|quality|architecture|tests)}

## Scope Resolution

1. Determine changed files from `HEAD` (for example using git diff name-only against `HEAD`, or equivalent VCS context if available).
2. Review only those changed files.
3. If changed files cannot be determined from available context, ask for the minimum missing input (for example the changed file list).

## Output Requirements

Return findings first, ordered by severity, with:

- File references
- Why each issue matters
- Suggested fix and short rationale

If there are no findings, explicitly state that and mention residual risk due to quick scope.
