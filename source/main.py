from fastapi import FastAPI, Query, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

import os
from sqlalchemy import create_engine,func
from sqlalchemy.orm import sessionmaker, Session
from models import Base, Otomoto, Autoscout  # Dodaj plik models.py poniżej

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "website.db")
engine = create_engine(f"sqlite:///{DB_PATH}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# zależność do sesji
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# stare endpointy (bez zmian)
@app.get("/otomoto")
def get_otomoto(
    limit: Optional[int] = Query(default=None),
    make: Optional[str] = Query(default=None),
    model: Optional[str] = Query(default=None),
    year: Optional[int] = Query(default=None),
    price: Optional[float] = Query(default=None),
):
    with SessionLocal() as session:
        query = session.query(Otomoto)

        if make:
            query = query.filter(Otomoto.make == make)
        if model:
            query = query.filter(Otomoto.model == model)
        if year:
            query = query.filter(Otomoto.year == year)
        if price:
            lower = price * 0.9
            upper = price * 1.1
            query = query.filter(Otomoto.price.between(lower, upper)).limit(1)

        if limit:
            query = query.limit(limit)

        results = query.all()
        data = [dict(make=row.make, model=row.model, year=row.year, price=row.price) for row in results]
        #print(data)
        return {"data": data}

# ENDPOINT: AUTOSCOUT
@app.get("/autoscout")
def get_autoscout(
    limit: Optional[int] = Query(default=None),
    make: Optional[str] = Query(default=None),
    model: Optional[str] = Query(default=None),
    year: Optional[int] = Query(default=None),
    price: Optional[float] = Query(default=None),
):
    with SessionLocal() as session:
        query = session.query(Autoscout)

        if make:
            query = query.filter(Autoscout.make == make)
        if model:
            query = query.filter(Autoscout.model == model)
        if year:
            query = query.filter(Autoscout.year == year)
        if price:
            lower = price * 0.9
            upper = price * 1.1
            #query = query.filter(Autoscout.price.between(lower, upper)).limit(1)
            query = query.filter(Autoscout.price.between(lower, upper)).limit(1)
        if limit:
            query = query.limit(limit)

        results = query.all()
        data = [dict(make=row.make, model=row.model, year=row.year, price=row.price) for row in results]
        #print('2',data)
        return {"data": data}
    
from sqlalchemy import func

@app.get("/otomoto/avg_by_year")
def get_otomoto_avg_by_year(
    make: Optional[str] = Query(default=None),
    model: Optional[str] = Query(default=None),
    price: Optional[float] = Query(default=None),
):
    with SessionLocal() as session:
        query = session.query(
            Otomoto.year,
            func.avg(Otomoto.price).label("avg_price")
        ).group_by(Otomoto.year).order_by(Otomoto.year)

        if make:
            query = query.filter(Otomoto.make == make)
        if model:
            query = query.filter(Otomoto.model == model)
        if price:
            lower = price * 0.9
            upper = price * 1.1
            query = query.filter(Otomoto.price.between(lower, upper))

        results = query.all()
        data = [{"year": year, "avg_price": round(avg_price)} for year, avg_price in results]
        #print('3',data)
        return {"data": data}
    

@app.get("/autoscout/avg_by_year")
def get_autoscout_avg_by_year(
    make: Optional[str] = Query(default=None),
    model: Optional[str] = Query(default=None),
    price: Optional[float] = Query(default=None),
):
    with SessionLocal() as session:
        query = session.query(
            Autoscout.year,
            func.avg(Autoscout.price).label("avg_price")
        ).group_by(Autoscout.year).order_by(Autoscout.year)

        if make:
            query = query.filter(Autoscout.make == make)
        if model:
            query = query.filter(Autoscout.model == model)
        if price:
            lower = price * 0.9
            upper = price * 1.1
            query = query.filter(Autoscout.price.between(lower, upper))

        results = query.all()
        data = [{"year": year, "avg_price": round(avg_price)} for year, avg_price in results]
        return {"data": data}

