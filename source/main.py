from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import os
from sqlalchemy import create_engine, text
app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "website.db")

# tworzymy silnik z pełną ścieżką
engine = create_engine(f"sqlite:///{DB_PATH}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Albo konkretny frontend np. "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")


@app.get("/otomoto")
def get_otomoto(limit: int = Query(default=None, description="Limit number of rows")):
    with engine.connect() as connection:
        # przygotuj zapytanie z limitem
        if limit:
            result = connection.execute(text(f"SELECT * FROM otomoto LIMIT {limit}"))
        else:
            result = connection.execute(text("SELECT * FROM otomoto"))
        
        rows = result.fetchall()
        columns = result.keys()  # <-- pobieramy nazwy kolumn

        # Budujemy listę słowników {nazwa_kolumny: wartość}
        data = [dict(zip(columns, row)) for row in rows]

    return {"data": data}


@app.get("/autoscout")
def get_autoscout(limit: int = Query(default=None, description="Limit number of rows")):
    with engine.connect() as connection:
        if limit:
            result = connection.execute(text(f"SELECT * FROM autoscout LIMIT {limit}"))
        else:
            result = connection.execute(text("SELECT * FROM autoscout"))
        
        rows = result.fetchall()
        columns = result.keys()  # <-- pobieramy nazwy kolumn

        # Budujemy listę słowników {nazwa_kolumny: wartość}
        data = [dict(zip(columns, row)) for row in rows]

    return {"data": data}
