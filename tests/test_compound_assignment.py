from sloperator.runner import run_source


def run(source: str) -> str:
    result = run_source(source)
    assert result.exit_code == 0
    assert result.stderr == ""
    return result.stdout


def fails(source: str) -> str:
    result = run_source(source)
    assert result.exit_code == 1
    return result.stderr.rstrip("\n")


def test_compound_assignment_uses_expression_precedence():
    source = """slop n = 2✨
n += 3 * 4✨
hallucinate(n)✨"""
    assert run(source) == "14\n"


def test_compound_assignment_concatenates_strings():
    source = """slop greeting = “hello”✨
greeting += “, slop”✨
hallucinate(greeting)✨"""
    assert run(source) == "hello, slop\n"


def test_compound_assignment_updates_nearest_shadowed_binding():
    source = """slop score = 1✨
{
    slop score = 2✨
    {
        score += 3✨
    }
    hallucinate(score)✨
}
hallucinate(score)✨"""
    assert run(source) == "5\n1\n"


def test_compound_assignment_walks_up_the_scope_chain():
    source = """slop total = 1✨
{
    {
        total += 4✨
    }
}
hallucinate(total)✨"""
    assert run(source) == "5\n"


def test_compound_assignment_uses_current_value_when_reading_rhs():
    source = """slop n = 5✨
n += n✨
hallucinate(n)✨"""
    assert run(source) == "10\n"


def test_compound_assignment_to_undefined_variable_fails():
    assert fails("n += 1✨") == "SlopLang runtime error at line 1: undefined variable 'n'"


def test_compound_assignment_to_immutable_binding_fails():
    source = """loadbearing LIMIT = 1✨
LIMIT += 2✨"""
    assert fails(source) == (
        "SlopLang runtime error at line 2: cannot assign to loadbearing 'LIMIT'"
    )


def test_compound_assignment_with_incompatible_types_fails():
    source = """slop n = 1✨
n += “two”✨"""
    assert fails(source) == (
        "SlopLang runtime error at line 2: operands of '+=' must both be numbers or both be "
        "strings, got number and string"
    )
