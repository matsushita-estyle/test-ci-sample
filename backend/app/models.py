from pydantic import BaseModel


class AddressRequest(BaseModel):
    postal_code: str
    prefecture: str
    city: str
    street_address: str
    building_name: str = ""


class ValidationError(BaseModel):
    field: str
    message: str


class AddressResponse(BaseModel):
    valid: bool
    errors: list[ValidationError] = []
    address: AddressRequest | None = None
