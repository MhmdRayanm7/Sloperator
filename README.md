
# Sloperator

![Python](https://img.shields.io/badge/Python-3.13+-3776AB?logo=python&logoColor=white)
![OpenCode](https://img.shields.io/badge/OpenCode-AI_Coding-181717)
![uv](https://img.shields.io/badge/uv-DE5FE9?logo=uv&logoColor=white)
![Pytest](https://img.shields.io/badge/Pytest-0A9EDC?logo=pytest&logoColor=white)
![Ruff](https://img.shields.io/badge/Ruff-D7FF64?logo=ruff&logoColor=black)
![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)

A tree-walking interpreter for [SlopLang](docs/spec.md), written in Python and developed through the [Boot.dev Learn AI Coding](https://www.boot.dev/courses/learn-ai-coding) course using OpenCode.

## AI-Assisted Development

- Custom AI agents and review workflows
- Reusable agent skills and instructions
- Custom commands, tools, and plugins
- MCP integrations
- Parallel agent workflows and Git worktrees
- Automated validation and regression testing
- Browser testing with Playwright

## Interpreter Features

- Lexical analysis and tokenization
- Parsing and Abstract Syntax Trees (AST)
- Expression evaluation
- Variables and lexical scoping
- Functions and control flow
- Compound assignment operators
- Syntax and runtime error handling
- Interactive web playground

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
uv run sloperator.py --check path/to/program.slop
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

| Path | Purpose |
| --- | --- |
| `sloperator.py` | Command-line entry point |
| `sloperator/` | Lexer, parser, evaluator, and runner |
| `.agents/` | Reusable agent skills |
| `.opencode/` | Custom agents, commands, and plugins |
| `tests/` | Pytest suite |
| `examples/` | SlopLang example programs |
| `playground/` | Interactive web playground |
| `docs/spec.md` | Language specification |

---

Built as part of the Boot.dev Learn AI Coding course.

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
