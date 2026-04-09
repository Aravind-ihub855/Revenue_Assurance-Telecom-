from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from jose import JWTError
import psycopg2.extras

import feature.auth.schemas as schemas
import feature.auth.auth as auth
from service.database import get_db

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@router.post("/api/auth/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, conn=Depends(get_db)):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        # Check if user exists
        cur.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = auth.get_password_hash(user.password)
        # Insert new user
        cur.execute(
            "INSERT INTO users (name, email, hashed_password) VALUES (%s, %s, %s) RETURNING id, name, email",
            (user.name, user.email, hashed_password)
        )
        new_user = cur.fetchone()
        conn.commit()
        return new_user
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()

@router.post("/api/auth/login", response_model=schemas.Token)
def login(request: schemas.UserLogin, conn=Depends(get_db)):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("SELECT * FROM users WHERE email = %s", (request.email,))
        user = cur.fetchone()
        
        if not user or not auth.verify_password(request.password, user['hashed_password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user['email']}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        cur.close()

@router.get("/api/users/me", response_model=schemas.UserResponse)
def read_users_me(token: str = Depends(oauth2_scheme), conn=Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("SELECT id, name, email FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        if user is None:
            raise credentials_exception
        return user
    finally:
        cur.close()
