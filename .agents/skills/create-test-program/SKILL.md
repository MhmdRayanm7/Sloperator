---
name: create-test-program
description: Create a runnable SlopLang example for a feature and add an exact-output test
---

# Create Test Program

Given a SlopLang feature:

1. Read `docs/spec.md` to confirm the feature's syntax, semantics, and diagnostics.
2. Create a small, deterministic program in `examples/<feature>.slop`. Use curly quotes for
   strings and end statements with `✨`.
3. Run the example and capture its exact output.
4. Add a case to the parametrized test in `tests/test_example_outputs.py` that asserts the
   example exits cleanly and its stdout exactly matches the captured output.
5. Run `uv run pytest tests/test_example_outputs.py`, then the project validation checks.
6. Preserve existing examples and tests.
