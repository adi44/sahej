from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import current_user
from app.services.supabase import get_authed_client
from app.schemas.chat import ChatRequest
from app.crew import SahejCrew
from app.repositories import ChatRepository, ProfileRepository
from app.utils.profile_summary import build_profile_summary

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/")
async def chat(body: ChatRequest, auth=Depends(current_user)):
    user, jwt = auth
    db = get_authed_client(jwt)
    chat_repo = ChatRepository(db)
    profile_repo = ProfileRepository(db)

    # Resolve or create session
    if body.session_id:
        session = chat_repo.get_session(body.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = chat_repo.create_session(user["id"], body.message)

    # Fetch history for crew context
    history = chat_repo.get_history(session["id"])

    # Save user message
    chat_repo.save_message(session["id"], "user", body.message)

    # Inject financial profile only on the first message of a session
    profile_summary = ""
    if not history:
        profile = profile_repo.get(user["id"])
        if profile:
            profile_summary = build_profile_summary(profile)

    # Run crew
    response_text = await SahejCrew().run(
        user_message=body.message,
        chat_history=history,
        profile_summary=profile_summary,
    )

    # Save assistant reply
    chat_repo.save_message(session["id"], "assistant", response_text, {"crew": "SahejCrew"})

    return {"session_id": session["id"], "message": response_text}


@router.get("/sessions")
async def list_sessions(auth=Depends(current_user)):
    user, jwt = auth
    return ChatRepository(get_authed_client(jwt)).list_sessions(user["id"])


@router.get("/sessions/{session_id}")
async def get_session(session_id: str, auth=Depends(current_user)):
    user, jwt = auth
    repo = ChatRepository(get_authed_client(jwt))

    session = repo.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return {**session, "messages": repo.get_messages(session_id)}
