from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import current_user
from app.services.supabase import get_authed_client
from app.schemas.chat import ChatRequest
from app.crew import SahejCrew
from app.utils.profile_summary import build_profile_summary

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/")
async def chat(body: ChatRequest, auth=Depends(current_user)):
    user, jwt = auth
    db = get_authed_client(jwt)

    # Resolve or create session
    if body.session_id:
        res = db.table("chat_sessions").select("*").eq("id", body.session_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Session not found")
        session = res.data
    else:
        res = db.table("chat_sessions").insert({
            "user_id": user["id"],
            "title": body.message[:60],
        }).execute()
        session = res.data[0]

    # Fetch history for crew context
    history_res = db.table("chat_messages") \
        .select("role, content") \
        .eq("session_id", session["id"]) \
        .order("created_at") \
        .limit(10) \
        .execute()
    history = history_res.data or []

    # Save user message
    db.table("chat_messages").insert({
        "session_id": session["id"],
        "role": "user",
        "content": body.message,
    }).execute()

    # Inject financial profile only on the first message of a session.
    # After that the conversation history carries the context — no need to
    # resend the full profile block on every turn.
    profile_summary = ""
    if not history:
        profile_res = db.table("financial_profiles").select("*").eq("user_id", user["id"]).limit(1).execute()
        if profile_res.data:
            profile_summary = build_profile_summary(profile_res.data[0])

    # Run crew
    crew = SahejCrew()
    response_text = await crew.run(
        user_message=body.message,
        chat_history=history,
        profile_summary=profile_summary,
    )

    # Save assistant message
    db.table("chat_messages").insert({
        "session_id": session["id"],
        "role": "assistant",
        "content": response_text,
        "agent_metadata": {"crew": "SahejCrew"},
    }).execute()

    return {"session_id": session["id"], "message": response_text}


@router.get("/sessions")
async def list_sessions(auth=Depends(current_user)):
    user, jwt = auth
    db = get_authed_client(jwt)
    res = db.table("chat_sessions") \
        .select("id, title, created_at, updated_at") \
        .eq("user_id", user["id"]) \
        .order("updated_at", desc=True) \
        .execute()
    return res.data or []


@router.get("/sessions/{session_id}")
async def get_session(session_id: str, auth=Depends(current_user)):
    user, jwt = auth
    db = get_authed_client(jwt)

    session_res = db.table("chat_sessions").select("*").eq("id", session_id).single().execute()
    if not session_res.data:
        raise HTTPException(status_code=404, detail="Session not found")

    messages_res = db.table("chat_messages") \
        .select("*") \
        .eq("session_id", session_id) \
        .order("created_at") \
        .execute()

    return {**session_res.data, "messages": messages_res.data or []}
