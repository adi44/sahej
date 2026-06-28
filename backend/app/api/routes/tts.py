import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from app.api.deps import current_user
from app.core.config import settings

router = APIRouter(prefix="/tts", tags=["tts"])


class TTSRequest(BaseModel):
    text: str
    lang: str = "en"  # "en" or "hi"


@router.post("/", response_class=Response)
async def text_to_speech(body: TTSRequest, _auth=Depends(current_user)):
    if not settings.ELEVENLABS_API_KEY:
        raise HTTPException(status_code=503, detail="ElevenLabs API key not configured")

    if not body.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")

    text = body.text[:2000]  # guard against very long inputs

    try:
        resp = httpx.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{settings.ELEVENLABS_VOICE_ID}",
            headers={
                "xi-api-key": settings.ELEVENLABS_API_KEY,
                "Content-Type": "application/json",
                "Accept": "audio/mpeg",
            },
            json={
                "text": text,
                "model_id": "eleven_multilingual_v2",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75,
                    "style": 0.0,
                    "use_speaker_boost": True,
                },
            },
            timeout=30.0,
        )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="ElevenLabs request timed out")

    if resp.status_code != 200:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"ElevenLabs error: {resp.text[:200]}",
        )

    return Response(content=resp.content, media_type="audio/mpeg")
