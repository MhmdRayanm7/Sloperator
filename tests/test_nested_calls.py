from sloperator.lexer import tokenize
from sloperator.parser import parse
from sloperator.parser.ast import Call, ExprStmt, Literal, Variable


def only_expression(source: str):
    (statement,) = parse(tokenize(source))
    assert isinstance(statement, ExprStmt)
    return statement.expression


def test_call_as_argument_to_another_call():
    expr = only_expression("hallucinate(add(1, 2))✨")
    assert isinstance(expr, Call)
    assert isinstance(expr.callee, Variable) and expr.callee.name.lexeme == "hallucinate"
    assert len(expr.arguments) == 1

    argument = expr.arguments[0]
    assert isinstance(argument, Call)
    assert isinstance(argument.callee, Variable) and argument.callee.name.lexeme == "add"
    assert len(argument.arguments) == 2
    assert all(isinstance(value, Literal) for value in argument.arguments)
    assert [value.value for value in argument.arguments] == [1, 2]
