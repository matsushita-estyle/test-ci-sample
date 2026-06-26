import pytest
from app.domain.validation import validate_address
from app.models import AddressRequest


def make_address(**kwargs: str) -> AddressRequest:
    base = {
        "postal_code": "123-4567",
        "prefecture": "東京都",
        "city": "渋谷区",
        "street_address": "1-2-3",
        "building_name": "",
    }
    return AddressRequest(**{**base, **kwargs})


def test_valid_address_returns_no_errors() -> None:
    errors = validate_address(make_address())
    assert errors == []


@pytest.mark.parametrize(
    "postal_code",
    ["1234567", "123-456", "abc-defg", "123-45678", ""],
)
def test_invalid_postal_code_returns_error(postal_code: str) -> None:
    errors = validate_address(make_address(postal_code=postal_code))
    fields = [e.field for e in errors]
    assert "postal_code" in fields


def test_empty_prefecture_returns_error() -> None:
    errors = validate_address(make_address(prefecture=""))
    fields = [e.field for e in errors]
    assert "prefecture" in fields


def test_empty_city_returns_error() -> None:
    errors = validate_address(make_address(city=""))
    fields = [e.field for e in errors]
    assert "city" in fields


def test_empty_street_address_returns_error() -> None:
    errors = validate_address(make_address(street_address=""))
    fields = [e.field for e in errors]
    assert "street_address" in fields


def test_multiple_errors_returned_together() -> None:
    errors = validate_address(make_address(postal_code="bad", prefecture="", city=""))
    assert len(errors) == 3
