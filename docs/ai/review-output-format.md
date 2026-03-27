# Review Output Contract

Use this format for every code review response so findings are easy to scan, consistent, and actionable.

## Rules

- Put findings first.
- Use severity labels exactly as written:
  - `CRITICAL`
  - `HIGH`
  - `MEDIUM`
  - `LOW`
  - `INFO`
- Sort findings by severity in this exact order: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`.
- Within each severity label, sort findings by impact and confidence.
- Every finding must include all required fields:
  - `Title`
  - `Severity`
  - `File` (path + line when available)
  - `Problem`
  - `Suggested change`
  - `Rationale`

## Finding Template

```md
### <Title>

- Severity: CRITICAL|HIGH|MEDIUM|LOW|INFO
- File: <path>[:line]
- Problem: <what is wrong and why it matters>
- Suggested change: <specific fix guidance>
- Rationale: <why this fix is appropriate>
```

## No-Findings Contract

If no findings exist, state that explicitly and note residual risk from missing context or unreviewed scope.
