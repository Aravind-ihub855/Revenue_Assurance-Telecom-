import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

# We use DIRECT_URL to avoid pgbouncer issues with psycopg2
DATABASE_URL = os.getenv("DIRECT_URL")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

def get_db():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Manually create the users table if it doesn't exist."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL
        )
    """)
    conn.commit()
    cur.close()
    conn.close()
