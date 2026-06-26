import re

from app.models import AddressRequest, ValidationError

POSTAL_CODE_PATTERN = re.compile(r"^\d{3}-\d{4}$")


def validate_address(address: AddressRequest) -> list[ValidationError]:
    errors: list[ValidationError] = []

    if not POSTAL_CODE_PATTERN.match(address.postal_code):
        errors.append(
            ValidationError(
                field="postal_code",
                message="郵便番号は 000-0000 の形式で入力してください",
            )
        )

    if not address.prefecture.strip():
        errors.append(ValidationError(field="prefecture", message="都道府県を入力してください"))

    if not address.city.strip():
        errors.append(ValidationError(field="city", message="市区町村を入力してください"))

    if not address.street_address.strip():
        errors.append(ValidationError(field="street_address", message="番地を入力してください"))

    return errors
