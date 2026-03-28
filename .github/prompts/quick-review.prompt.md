---
name: 'quick-review'
description: 'Quick review of files changed from HEAD or a specific commit SHA.'
argument-hint: '[sha] optional: focus=<security|performance|quality|architecture|tests>'
agent: 'Code Review Orchestrator'
---

## Task

Run a quick review of files changed from `HEAD` by default, or from a specific commit when `${input:sha:Optional commit SHA}` is provided.

Follow [review-output-format](../../docs/ai/review-output-format.md).

Optional commit SHA: ${input:sha:Optional commit SHA}

Optional focus: ${input:focus:Optional focus area (security|performance|quality|architecture|tests)}

## Scope Resolution

1. If `${input:sha}` is provided:
   - Validate the commit exists (for example `git rev-parse --verify <sha>^{commit}`).
   - Gather commit information for review context (for example `git show --no-patch --format=fuller <sha>`).
   - Determine files changed by that commit (for example `git diff-tree --root -m --no-commit-id --name-only -r <sha>`).
   - If changed files resolve to empty unexpectedly, fall back to `git show --pretty="" --name-only <sha>`.
2. If `${input:sha}` is not provided:
   - Determine changed files from `HEAD` (for example `git diff --name-only HEAD`).
3. Review only those changed files unless the user explicitly asks to expand scope.
4. If the SHA is invalid or changed files are unavailable, ask for the minimum missing input.
