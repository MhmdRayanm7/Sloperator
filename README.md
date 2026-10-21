# Sloperator

A tree-walking interpreter for [SlopLang](docs/spec.md), written in Python.

## Quick Start

Requires Python 3.13+ and [uv](https://docs.astral.sh/uv/).

```bash
uv run sloperator.py examples/hello.slop
```

Run the full check suite:

```bash
uv run pytest              # tests
uv run ruff format --check # formatting
uv run ruff check          # linting
uv run ty check            # type checking
```

## Usage

```bash
uv run sloperator.py path/to/program.slop
uv run sloperator.py --check path/to/program.slop  # syntax check only
```

Programs use the `.slop` extension. See the [language specification](docs/spec.md)
for syntax, values, operators, and error behavior.

Browse [`examples/`](examples) for complete programs, from `hello.slop` to
`fib.slop` and `fizzbuzz.slop`.

## Playground

```bash
uv run playground/server.py
```

Then open <http://localhost:8080>.

## Layout

- `sloperator.py` — command-line entry point
- `sloperator/` — lexer, parser, evaluator, and runner
- `tests/` — pytest suite
- `docs/spec.md` — language specification
