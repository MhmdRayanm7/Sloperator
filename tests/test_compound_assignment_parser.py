import pytest

from sloperator.errors import SlopSyntaxError
from sloperator.lexer import TokenType, tokenize
from sloperator.parser import parse
from sloperator.parser.ast import Binary, CompoundAssign, ExprStmt, Literal


def parse_source(source: str):
    return parse(tokenize(source))


def test_plus_equal_is_lexed_as_a_single_token():
    assert [token.type for token in tokenize("n += 1✨")] == [
        TokenType.IDENTIFIER,
        TokenType.PLUS_EQUAL,
        TokenType.NUMBER,
        TokenType.SPARKLES,
        TokenType.EOF,
    ]


def test_compound_assignment_parses_rhs_with_multiplication_precedence():
    (statement,) = parse_source("n += 3 * 4✨")
    assert isinstance(statement, CompoundAssign)
    assert statement.name.lexeme == "n"
    assert statement.operator.type is TokenType.PLUS_EQUAL
    assert isinstance(statement.value, Binary)
    assert statement.value.operator.type is TokenType.STAR
    assert isinstance(statement.value.left, Literal) and statement.value.left.value == 3
    assert isinstance(statement.value.right, Literal) and statement.value.right.value == 4


def test_compound_assignment_rhs_uses_full_expression_precedence():
    (statement,) = parse_source("n += 1 + 2 * 3✨")
    assert isinstance(statement, CompoundAssign)
    assert isinstance(statement.value, Binary)
    assert statement.value.operator.type is TokenType.PLUS
    assert isinstance(statement.value.right, Binary)
    assert statement.value.right.operator.type is TokenType.STAR


def test_plain_plus_is_still_an_expression():
    (statement,) = parse_source("n + 1✨")
    assert isinstance(statement, ExprStmt)
    assert isinstance(statement.expression, Binary)
    assert statement.expression.operator.type is TokenType.PLUS


def test_compound_assignment_is_not_an_expression():
    with pytest.raises(SlopSyntaxError):
        parse_source("hallucinate(n += 1)✨")
