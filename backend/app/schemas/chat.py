from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None  # UUID string from Supabase; None = start new session
