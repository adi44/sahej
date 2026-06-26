from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    google_id: str
    email: EmailStr
    name: str
    picture: str | None = None


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    picture: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
