from app.services.supabase import SupabaseClient


class ChatRepository:
    def __init__(self, db: SupabaseClient) -> None:
        self._db = db

    def get_session(self, session_id: str) -> dict | None:
        res = self._db.table("chat_sessions").select("*").eq("id", session_id).single().execute()
        return res.data or None

    def create_session(self, user_id: str, title: str) -> dict:
        res = self._db.table("chat_sessions").insert({
            "user_id": user_id,
            "title": title[:60],
        }).execute()
        return res.data[0]

    def list_sessions(self, user_id: str) -> list[dict]:
        res = (
            self._db.table("chat_sessions")
            .select("id, title, created_at, updated_at")
            .eq("user_id", user_id)
            .order("updated_at", desc=True)
            .execute()
        )
        return res.data or []

    def get_history(self, session_id: str, limit: int = 8) -> list[dict]:
        """Lightweight fetch for crew context — role + content only."""
        res = (
            self._db.table("chat_messages")
            .select("role, content")
            .eq("session_id", session_id)
            .order("created_at")
            .limit(limit)
            .execute()
        )
        return res.data or []

    def get_messages(self, session_id: str) -> list[dict]:
        """Full message rows for the API response."""
        res = (
            self._db.table("chat_messages")
            .select("*")
            .eq("session_id", session_id)
            .order("created_at")
            .execute()
        )
        return res.data or []

    def save_message(
        self,
        session_id: str,
        role: str,
        content: str,
        metadata: dict | None = None,
    ) -> dict:
        payload: dict = {"session_id": session_id, "role": role, "content": content}
        if metadata:
            payload["agent_metadata"] = metadata
        res = self._db.table("chat_messages").insert(payload).execute()
        return res.data[0] if res.data else {}
