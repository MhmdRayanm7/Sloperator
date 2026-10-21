from sloperator.runner import run_source


def test_unary_minus_rejects_booleans():
    result = run_source("hallucinate(-✅)✨")
    assert result.exit_code == 1
    assert result.stderr == (
        "SlopLang runtime error at line 1: "
        "operand of unary '-' must be a number, got boolean\n"
    )


def test_unary_minus_negates_numbers():
    result = run_source("hallucinate(-1)✨")
    assert result.exit_code == 0
    assert result.stderr == ""
    assert result.stdout == "-1\n"
