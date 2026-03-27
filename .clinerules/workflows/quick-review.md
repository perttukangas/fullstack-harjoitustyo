# Quick Review

Run a quick review of files changed from `HEAD`.

## Step 1: Resolve scope from git

Determine changed files from `HEAD` (for example with `git diff --name-only HEAD`).
Review only those changed files unless the user explicitly asks to expand scope.
If changed files are unavailable, ask for the minimum missing input.

## Step 2: Determine focus

If a focus area is provided (security, performance, quality, architecture, tests), prioritize it first without skipping full coverage.

## Step 3: Run specialist review

Use the `code-review-orchestrator` skill to run a consolidated review.

## Step 4: Enforce output contract

Format findings with the review contract in `docs/ai/review-output-format.md`.
Present findings first, ordered by severity.
