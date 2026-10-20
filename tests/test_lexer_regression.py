import pytest

from sloperator.errors import LexicalError
from sloperator.lexer import tokenize


def test_backslash_newline_escape_reports_unknown_escape():
    # The newline is consumed as the escape character, so the diagnostic
    # itself contains a newline.
    source = "“a\\\n”"
    with pytest.raises(LexicalError) as info:
        tokenize(source)
    assert info.value.line == 1
    assert info.value.message == "unknown escape sequence '\\\n'"
    assert str(info.value) == "SlopLang lexical error at line 1: unknown escape sequence '\\\n'"
