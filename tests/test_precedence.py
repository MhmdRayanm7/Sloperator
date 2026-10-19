from sloperator.runner import run_source


def run(source: str) -> str:
    result = run_source(source)
    assert result.stderr == "", result.stderr
    return result.stdout


def test_multiplication_binds_tighter_than_addition():
    assert run("hallucinate(2 + 5 * 3)✨") == "17\n"
