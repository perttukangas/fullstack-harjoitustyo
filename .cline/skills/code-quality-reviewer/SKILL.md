---
name: code-quality-reviewer
description: Code quality review for changed code. Use when asked to assess readability, maintainability, naming, duplication, cohesion, and error handling.
---

# Code Quality Reviewer

Follow the review output contract in `docs/ai/review-output-format.md`.

## Scope

- Readability and maintainability issues
- Poor naming or unclear intent
- Oversized functions or mixed responsibilities
- Code duplication and abstraction opportunities
- Error handling gaps that hurt reliability

## Constraints

- Prefer practical, incremental improvements.
- Avoid style-only feedback unless clarity is harmed.
