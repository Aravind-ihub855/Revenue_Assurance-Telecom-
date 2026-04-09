from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from service.database import init_db
from feature.auth.router import router as auth_router

init_db()

app = FastAPI(title="Century Link Revenue Assurance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
