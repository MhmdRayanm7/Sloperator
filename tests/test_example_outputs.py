"""Exact stdout expectations for selected programs in examples/."""

from pathlib import Path

import pytest

from sloperator.runner import run_source

EXAMPLES = Path(__file__).resolve().parent.parent / "examples"


@pytest.mark.parametrize(
    ("name", "expected"),
    [
        ("unary_not", "❌\n✅\n✅\n"),
        ("equality", "✅\n❌\n❌\n"),
        ("short-circuit", "❌\n✅\n"),
    ],
)
def test_example_output(name: str, expected: str):
    result = run_source((EXAMPLES / f"{name}.slop").read_text(encoding="utf-8"))
    assert result.exit_code == 0
    assert result.stderr == ""
    assert result.stdout == expected
