"""Regression tests for digits inside identifiers (GitHub issue #1)."""

import pytest

from sloperator.runner import run_source


def test_variable_names_may_contain_digits():
    result = run_source("slop score2 = 40✨\nscore2 = score2 + 2✨\nhallucinate(score2)✨")
    assert result.stdout == "42\n"
    assert result.stderr == ""
    assert result.exit_code == 0


def test_function_names_may_contain_digits():
    source = """clanker add2(left, right) {
    ship left + right✨
}
hallucinate(add2(20, 22))✨
"""
    result = run_source(source)
    assert result.stdout == "42\n"
    assert result.stderr == ""
    assert result.exit_code == 0


def test_parameter_names_may_contain_digits():
    source = """clanker double2(value2) {
    ship value2 * 2✨
}
hallucinate(double2(21))✨
"""
    result = run_source(source)
    assert result.stdout == "42\n"
    assert result.stderr == ""
    assert result.exit_code == 0


@pytest.mark.parametrize(
    "source",
    [
        "slop 2score = 1✨",
        "clanker 2fn() { }",
        "clanker f(2arg) { }",
    ],
)
def test_identifiers_cannot_start_with_digits(source: str):
    result = run_source(source)
    assert result.exit_code == 1
    assert "syntax error" in result.stderr
