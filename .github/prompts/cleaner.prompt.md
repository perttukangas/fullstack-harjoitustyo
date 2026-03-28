---
name: 'cleaner'
description: 'Clean up messy code/docs, remove duplication, and improve maintainability safely.'
argument-hint: '[sha] optional: function_name=<symbol> file=<path> dir=<path> scope=<focused|module|repo>'
---

## Task

Refactor and clean existing code/docs for clarity, consistency, and maintainability without changing behavior.

Target function (optional): ${input:function_name:Which function or method should be cleaned up? (optional)}
Target file (optional): ${input:file:Which file should be cleaned up? (optional)}
Target directory (optional): ${input:dir:Which directory should be cleaned up? (optional)}
Cleanup scope: ${input:scope:How wide should cleanup be? (focused|module|repo)}
Optional commit SHA: ${input:sha:Optional commit SHA}

## Change Target Resolution

1. If `${input:sha}` is provided:
   - Validate the commit exists (for example `git rev-parse --verify <sha>^{commit}`).
   - Gather commit information for cleanup context (for example `git show --no-patch --format=fuller <sha>`).
   - Determine files changed by that commit (for example `git diff-tree --root -m --no-commit-id --name-only -r <sha>`).
   - If changed files resolve to empty unexpectedly, fall back to `git show --pretty="" --name-only <sha>`.
2. If `${input:sha}` is not provided:
   - Determine changed files from `HEAD` (for example `git diff --name-only HEAD`).
3. Use resolved changed files as the default cleanup target when no explicit function, file, dir, or selection is provided.
4. If the SHA is invalid or changed files are unavailable, ask for the minimum missing input.

## Scope (strict order)

1. If a code selection exists, prioritize cleanup within the selection.
2. If function_name is provided, limit cleanup to that function and directly related local helpers.
3. Else if file or dir is provided, limit cleanup to that file/directory.
4. Else if `${input:sha}` is provided, limit cleanup to files changed by that commit.
5. Else limit cleanup to files changed from `HEAD`.
6. If no changed files are found, do not continue and ask for the minimum missing scope input.
7. Do not modify unrelated areas.

## Cleanup Priorities

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

## Guardrails

- Preserve observable behavior and public APIs
- Prefer small, low-risk, incremental edits
- No feature additions
- Keep compatibility with existing framework/tooling
- If intent is ambiguous, state brief assumptions before edits

## Validation

- Run relevant compile/lint/tests when available
- If tests are unavailable, run the smallest reliable checks
- Confirm removals do not break imports/usages

## Output Requirements

1. Return changes grouped by category:
   - Dead code removed
   - Duplication reduced
   - Readability/structure improved
   - Docs cleaned
2. For each change, include file path + short rationale.
3. Add a short "Behavior safety check" describing verification.
4. If no safe cleanup exists, say so and explain why.

Return concise, information-dense output only.
