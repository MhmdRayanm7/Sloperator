from sloperator.runner import run_source


def run(source: str) -> str:
    result = run_source(source)
    assert result.stderr == "", result.stderr
    return result.stdout


def test_equality_has_lower_precedence_than_comparison():
    assert run("hallucinate(1 < 2 == ✅)✨") == "✅\n"
