from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.validate import router as validate_router

app = FastAPI(title="Address Validation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

app.include_router(validate_router, prefix="/api")


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
