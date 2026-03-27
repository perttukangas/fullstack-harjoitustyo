---
description: 'Use when generating code review results (including review prompts and Code Review Orchestrator) to standardize severity labels and fix guidance format.'
---

# Standard Review Output Format

Use this format for every code review response.

## Severity Labels

Use only these labels:

- `[CRITICAL]`
- `[HIGH]`
- `[MEDIUM]`
- `[LOW]`
- `[INFO]`

Do not invent custom severity names.

## Ordering Rules

- Present findings first.
- Order findings by severity: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`.
- Within each severity, order by impact and confidence.

## Required Fields Per Finding

Each finding must include:

- `Title`: concise issue summary
- `Severity`: one allowed label
- `File`: precise path and line when available (for example `src/app.ts:42`)
- `Problem`: why this is a risk or defect
- `Suggested change`: actionable fix
- `Rationale`: short reason the fix is appropriate

## Example Finding Block

Use this structure as a template:

```markdown
Title: Missing authorization check for profile update endpoint
Severity: [HIGH]
File: services/server/src/routes/v1/profile.ts:88
Problem: The handler updates user profile data without verifying that the authenticated user owns the target resource. This can allow unauthorized modification of another user's data.
Suggested change: Add an ownership/permission check before mutation and return `403` when authorization fails.
Rationale: Enforcing authorization at the mutation boundary prevents privilege escalation and data tampering.
```

## No-Finding Rule

When no defects are found, explicitly state that no findings were identified.
Also call out residual risk from unavailable context or unreviewed scope.

## Test and Docs Expectation

Always mention testing and documentation status:

- Missing tests or weak coverage
- Missing or outdated documentation
