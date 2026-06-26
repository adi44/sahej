from fastapi import Depends, HTTPException, Header
from app.services.supabase import get_user


def current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    jwt = authorization.removeprefix("Bearer ")
    user = get_user(jwt)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user, jwt
