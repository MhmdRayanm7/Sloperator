"""Regression tests for variable assignment across nested scopes."""

from sloperator.runner import run_source


def run(source: str) -> str:
    result = run_source(source)
    assert result.exit_code == 0
    assert result.stderr == ""
    return result.stdout


def test_nested_block_assignment_updates_nearest_scope():
    source = """slop score = 1✨
{
    slop score = 2✨
    {
        score = 3✨
    }
    hallucinate(score)✨
}
hallucinate(score)✨"""
    assert run(source) == "3\n1\n"


def test_assignment_to_shadowed_variable_leaves_outer_binding_unchanged():
    source = """slop value = 10✨
{
    slop value = 20✨
    value = value + 1✨
    hallucinate(value)✨
}
hallucinate(value)✨"""
    assert run(source) == "21\n10\n"


def test_nested_assignments_update_the_scope_that_owns_the_binding():
    source = """slop total = 0✨
{
    slop total = 10✨
    {
        {
            total = total + 5✨
        }
        hallucinate(total)✨
    }
    hallucinate(total)✨
}
hallucinate(total)✨"""
    assert run(source) == "15\n15\n0\n"


def test_nested_block_inside_function_updates_parameter_not_global():
    source = """slop value = 1✨
clanker bump(value) {
    {
        value = value + 1✨
    }
    ship value✨
}
hallucinate(bump(10))✨
hallucinate(value)✨"""
    assert run(source) == "11\n1\n"
