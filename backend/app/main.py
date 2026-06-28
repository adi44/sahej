import traceback
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.services.supabase import init_http_client, close_http_client
from app.api.routes import chat, schemes, tts, profile


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_http_client()
    yield
    close_http_client()


app = FastAPI(title="Sahej API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    print(f"\n[500] {request.method} {request.url}\n{tb}")
    origin = request.headers.get("origin", "")
    cors_headers = {}
    if origin in settings.CORS_ORIGINS:
        cors_headers["Access-Control-Allow-Origin"] = origin
        cors_headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers=cors_headers,
    )


app.include_router(chat.router, prefix="/api")
app.include_router(schemes.router, prefix="/api")
app.include_router(tts.router, prefix="/api")
app.include_router(profile.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
