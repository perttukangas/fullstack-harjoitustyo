---
name: 'run-code-review-orchestrator'
description: 'Run Code Review Orchestrator for a file, commit/diff, or pull request'
argument-hint: 'scope=<file|commit|pr> target=<path|sha|pr_url_or_id> optional: focus=<security|performance|quality|architecture|tests>'
agent: 'Code Review Orchestrator'
---

## Task

Run a full review using `Code Review Orchestrator` for the requested scope and target.

Follow the standardized review output contract in [review-output-format](../instructions/review-output-format.instructions.md).

Input scope: ${input:scope:Review scope (file|commit|pr)}
Input target: ${input:target:File path, commit SHA/range, or PR URL/number}
Optional focus: ${input:focus:Optional focus area (security|performance|quality|architecture|tests)}

## Scope Handling

- If `scope=file`: review only the specified file path in the workspace.
- If `scope=commit`: review a single commit SHA, commit range, or diff represented by `target`.
- If `scope=pr`: review the pull request represented by `target` (PR URL or PR number).

If required data for commit/PR review is not directly available in the current context, request the minimum missing details (for example repo/provider for a PR, or a diff/range for a commit) and then continue.

## Output Requirements

Return one consolidated report from the orchestrator with:

- Findings first, ordered by severity
- Precise file references when available
- Clear suggested fixes
- Missing-test or documentation gaps

Use the exact severity labels and required per-finding fields defined in the linked instruction.

If no issues are found, explicitly say so and call out any residual risk from unavailable context.
