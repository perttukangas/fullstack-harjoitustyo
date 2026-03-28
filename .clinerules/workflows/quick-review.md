# Quick Review

Quick review of files changed from HEAD or from a specific commit SHA.

Follow [review-output-format](../../docs/ai/review-output-format.md).

## Step 1: Collect optional inputs

Use values from the user request when present:

- `sha` (optional): specific commit SHA
- `focus` (optional): one of `security`, `performance`, `quality`, `architecture`, `tests`

If either value is missing and needed, ask one concise follow-up question.

## Step 2: Resolve scope

If `sha` is provided:

1. Validate the commit exists:
   - `git rev-parse --verify <sha>^{commit}`
2. Gather commit metadata for context:
   - `git show --no-patch --format=fuller <sha>`
3. Determine files changed by that commit:
   - `git diff-tree --root -m --no-commit-id --name-only -r <sha>`
4. If changed files resolve to empty unexpectedly, fall back to:
   - `git show --pretty="" --name-only <sha>`

If `sha` is not provided:

1. Determine changed files from HEAD:
   - `git diff --name-only HEAD`

Review only resolved changed files unless the user explicitly asks to expand scope.
If the SHA is invalid or changed files are unavailable, ask for the minimum missing input.

## Step 3: Run the review orchestration

Use the `code-review-orchestrator` skill logic and run five specialist passes over the same resolved scope:

1. Security
2. Performance
3. Code quality
4. Architecture
5. Testing and documentation

If `focus` is provided, prioritize that area first without skipping full coverage.

## Step 4: Consolidate and report

Return one consolidated report with deduplicated findings, preserving severity guarantees from the orchestrator guidance.

Include precise file references and concrete remediation guidance.
