from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from service.database import init_db
from feature.auth.router import router as auth_router
from feature.tariff_plan.router import router as tariff_router
from feature.customer.router import router as customer_router
from feature.ingestion.router import router as ingestion_router
from feature.data_agent.router import router as data_agent_router

# Initialize the psycopg2 database tables
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
app.include_router(tariff_router)
app.include_router(customer_router)
app.include_router(ingestion_router)
app.include_router(data_agent_router)
