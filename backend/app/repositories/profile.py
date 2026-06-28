from app.services.supabase import SupabaseClient


class ProfileRepository:
    def __init__(self, db: SupabaseClient) -> None:
        self._db = db

    def get(self, user_id: str) -> dict | None:
        res = (
            self._db.table("financial_profiles")
            .select("*")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
        return res.data[0] if res.data else None

    def upsert(self, user_id: str, data: dict) -> dict:
        res = (
            self._db.table("financial_profiles")
            .upsert({**data, "user_id": user_id}, on_conflict="user_id")
            .execute()
        )
        return res.data[0]
