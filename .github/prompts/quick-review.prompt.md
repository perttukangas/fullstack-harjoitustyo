---
name: 'quick-review'
description: 'Quick review of files changed from HEAD.'
argument-hint: 'optional: focus=<security|performance|quality|architecture|tests>'
agent: 'Code Review Orchestrator'
---

## Task

Run a quick review of files changed from `HEAD`.

Optional focus: ${input:focus:Optional focus area (security|performance|quality|architecture|tests)}

## Scope Resolution

1. Determine changed files from `HEAD` (for example `git diff --name-only HEAD`).
2. Review only those changed files unless the user explicitly asks to expand scope.
3. If changed files are unavailable, ask for the minimum missing input.
