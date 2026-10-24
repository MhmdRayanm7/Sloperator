from sloperator.runner import run_source


def test_unary_not_negates_booleans():
    result = run_source("hallucinate(!✅, !❌, !!✅)✨")
    assert result.exit_code == 0
    assert result.stderr == ""
    assert result.stdout == "❌ ✅ ✅\n"


def test_unary_not_rejects_numbers():
    result = run_source("hallucinate(!1)✨")
    assert result.exit_code == 1
    assert result.stderr == (
        "SlopLang runtime error at line 1: operand of unary '!' must be a boolean, got number\n"
    )


def test_unary_not_rejects_strings():
    result = run_source("hallucinate(!“hi”)✨")
    assert result.exit_code == 1
    assert result.stderr == (
        "SlopLang runtime error at line 1: operand of unary '!' must be a boolean, got string\n"
    )
