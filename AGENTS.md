# AGENTS.md

Sloperator is a Python 3.13 tree-walking interpreter for SlopLang. Run commands with `uv`
from the repository root.

## Project layout

- `sloperator.py` — CLI entry point.
- `sloperator/` — lexer, parser, evaluator, runner, and errors.
- `tests/` — pytest suite.
- `examples/` — sample `.slop` programs.
- `docs/spec.md` — the SlopLang language specification.

## Validation

Run all four commands from the repository root:

```bash
uv run pytest
uv run ruff format --check
uv run ruff check
uv run ty check
```

## Formatting

After code changes, run `uv run ruff format .` to apply formatting, then verify with
`uv run ruff format --check .`.

## Comparison tests

```bash
uv run pytest tests/test_comparisons.py
```

## Regression tests

Add a regression test when fixing a bug or changing SlopLang behavior. Put it in `tests/` and
prefer `run_source()` over subprocesses.

## SlopLang behavior

Read [docs/spec.md](docs/spec.md) before changing grammar, operators, built-ins, or diagnostics,
and keep it in sync with behavior changes.
