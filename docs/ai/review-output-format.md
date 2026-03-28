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
- In `Suggested change`, include a concrete code-level change suggestion when applicable.
- If no code change is applicable, provide exact non-code remediation steps.
- Use the shared severity rubric below when assigning finding severity.

## Shared Severity Rubric

- `CRITICAL`: Active or highly likely issue with severe impact that should block release or immediate merge.
- `HIGH`: Significant risk with clear impact and high confidence; should be fixed before release or in the current change window.
- `MEDIUM`: Important issue with meaningful impact, but not release-blocking by itself.
- `LOW`: Minor but actionable issue with limited impact.
- `INFO`: Improvement note or clarification with minimal direct risk.

## Finding Template

````md
### <Title>

**Severity**: CRITICAL|HIGH|MEDIUM|LOW|INFO
**File**: <path>[:line]
**Problem**: <what is wrong and why it matters>
**Suggested change**: <specific fix guidance>

Optional: What to change (code-level only, include only when a concrete code edit is proposed)

```<language>
<concrete code change suggestion>
```

If no direct code edit is applicable, provide exact non-code remediation steps.

**Rationale**: <why this fix is appropriate>
````

## No-Findings Contract

If no findings exist, state that explicitly and note residual risk from missing context or unreviewed scope.
