# Cleaner

Clean up messy code and documentation for clarity, consistency, and maintainability without changing behavior.

## Step 1: Determine cleanup scope using strict order

1. If a code selection exists, prioritize cleanup within the selection.
2. If `function_name` is provided, limit cleanup to that function and directly related local helpers.
3. Else if `file` or `dir` is provided, limit cleanup to that file/directory.
4. Else scan the repository and prioritize highest-impact cleanup first.
5. Do not modify unrelated areas.

## Step 2: Apply cleanup priorities

1. Dead code removal
   - Remove unused imports, variables, functions, branches, and stale comments
2. Duplication reduction
   - Consolidate repeated code into reusable utilities
   - Remove duplicated docs/comment sections
3. Structure simplification
   - Flatten unnecessary nesting and simplify complex logic
   - Improve naming and local readability
4. Consistency updates
   - Align formatting/patterns with nearby project conventions
   - Replace outdated patterns with current local equivalents
5. Documentation hygiene
   - Remove stale docs, fix broken references, reduce boilerplate

## Step 3: Guardrails

- Preserve observable behavior and public APIs.
- Prefer small, low-risk, incremental edits.
- No feature additions.
- Keep compatibility with existing framework/tooling.
- If intent is ambiguous, state brief assumptions before edits.

## Step 4: Validation

- Run relevant compile/lint/tests when available.
- If tests are unavailable, run the smallest reliable checks.
- Confirm removals do not break imports/usages.

## Step 5: Output format

Return changes grouped by:

- Dead code removed
- Duplication reduced
- Readability/structure improved
- Docs cleaned

For each change, include file path and short rationale.
Add a short behavior safety check describing verification.
If no safe cleanup exists, state that and explain why.
