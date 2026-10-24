from sloperator.runner import run_source


def test_ralph_with_false_condition_does_not_run_the_body():
    result = run_source("ralph ❌ {\n    hallucinate(“never”)✨\n}")
    assert result.exit_code == 0
    assert result.stderr == ""
    assert result.stdout == ""
