from fastapi import APIRouter

from app.domain.validation import validate_address
from app.models import AddressRequest, AddressResponse

router = APIRouter()


@router.post("/validate", response_model=AddressResponse)
def validate(request: AddressRequest) -> AddressResponse:
    errors = validate_address(request)
    if errors:
        return AddressResponse(valid=False, errors=errors)
    return AddressResponse(valid=True, address=request)
