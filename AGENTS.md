# AGENTS.md

Sloperator is a Python 3.13 tree-walking interpreter for SlopLang. It has no runtime
dependencies. Run commands with `uv` from the repo root.

## Commands

- Run: `uv run sloperator.py examples/hello.slop` (`--check` parses only).
- Test: `uv run pytest`; single test: `uv run pytest tests/test_parser.py::test_syntax_errors`
  or `-k <pattern>`.
- Lint: `uv run ruff check`
- Format: `uv run ruff format --check`; fix with `uv run ruff format`.
- Type-check: `uv run ty check`
- Full validation: run tests, format check, lint, then type-check.
- Playground: `uv run playground/server.py [port]` → <http://localhost:8080>; writes
  `logs/runs.log`.
- OpenCode plugin: `cd .opencode && bun run typecheck`.
- Prefer the `run_slop` tool for `.slop` files when available; it confines paths to the
  project root.

`ruff format --check` currently fails on `tests/test_unary_minus.py`.

## Architecture

- `sloperator.py` is the CLI. `sloperator/runner.py` wires `tokenize` → `parse` →
  `Interpreter` and provides `check_program`, `run_program`, and `run_source` for tests.
- Implementation: `sloperator/lexer/scanner.py`, `sloperator/parser/parser.py` (AST in
  `sloperator/parser/ast.py`), and `sloperator/evaluator/interpreter.py`.
- `SlopError` subclasses carry a line number. The CLI writes
  `SlopLang <kind> error at line N: message` to stderr and exits 1 (2 for usage/file
  errors). Language failures must not expose Python tracebacks.
- Keep [docs/spec.md](docs/spec.md) in sync with grammar, operator, built-in, or diagnostic
  changes. Read it before changing SlopLang behavior.

## Testing and source gotchas

- Source uses Unicode tokens (smart quotes, em dash, `✨`, `✅`/`❌`, optional U+FE0F).
  Never normalize them to ASCII; tests assert exact messages and line numbers.
- `tests/test_examples.py` automatically runs every `examples/*.slop` and requires exit 0,
  empty stderr, and non-empty stdout.
- Prefer `run_source()` in tests over subprocess. `tests/test_cli.py` invokes
  `sys.executable` directly by design.

## Repo config

- `opencode.jsonc` denies reads of `*.env`; do not attempt to read `.env`.
- `.opencode/agents/review.md` defines a read-only review agent.

## Development Guidelines

- Keep changes focused on the requested task.
- Follow existing code and test patterns.
- Add regression tests when fixing bugs.
- Run relevant tests after code changes.
- Avoid unrelated refactoring.
- Check [docs/spec.md](docs/spec.md) before changing SlopLang behavior.
