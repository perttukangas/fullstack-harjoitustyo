# Cleaner

Clean up messy code and documentation for clarity, consistency, and maintainability without changing behavior.

## Inputs

- `function_name` (optional): Target function or method to clean up
- `file` (optional): Target file to clean up
- `dir` (optional): Target directory to clean up
- `scope` (optional): `focused|module|repo`
- `sha` (optional): Commit SHA to resolve cleanup targets

## Step 1: Resolve change targets

1. If `sha` is provided:
   - Validate the commit exists (for example `git rev-parse --verify <sha>^{commit}`).
   - Gather commit information for cleanup context (for example `git show --no-patch --format=fuller <sha>`).
   - Determine files changed by that commit (for example `git diff-tree --root -m --no-commit-id --name-only -r <sha>`).
   - If changed files resolve to empty unexpectedly, fall back to `git show --pretty="" --name-only <sha>`.
2. If `sha` is not provided:
   - Determine changed files from `HEAD` (for example `git diff --name-only HEAD`).
3. Use resolved changed files as the default cleanup target when no explicit function, file, dir, or selection is provided.
4. If the SHA is invalid or changed files are unavailable, ask for the minimum missing input.

## Step 2: Determine cleanup scope using strict order

1. If a code selection exists, prioritize cleanup within the selection.
2. If `function_name` is provided, limit cleanup to that function and directly related local helpers.
3. Else if `file` or `dir` is provided, limit cleanup to that file/directory.
4. Else if `sha` is provided, limit cleanup to files changed by that commit.
5. Else limit cleanup to files changed from `HEAD`.
6. If no changed files are found, do not continue and ask for the minimum missing scope input.
7. Do not modify unrelated areas.

## Step 3: Apply cleanup priorities

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

## Step 4: Guardrails

- Preserve observable behavior and public APIs
- Prefer small, low-risk, incremental edits
- No feature additions
- Keep compatibility with existing framework/tooling
- If intent is ambiguous, state brief assumptions before edits

## Step 5: Validation

- Run relevant compile/lint/tests when available
- If tests are unavailable, run the smallest reliable checks
- Confirm removals do not break imports/usages

## Step 6: Output requirements

1. Return changes grouped by category:
   - Dead code removed
   - Duplication reduced
   - Readability/structure improved
   - Docs cleaned
2. For each change, include file path + short rationale.
3. Add a short "Behavior safety check" describing verification.
4. If no safe cleanup exists, say so and explain why.

Return concise, information-dense output only.
