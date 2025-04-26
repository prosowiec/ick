from fastapi import FastAPI
from fastapi.responses import JSONResponse
import pandas as pd
import os

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

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
def read_otomoto():
    
    try:
        file_path = os.path.join(DATA_DIR, "otomoto.csv")
        df = pd.read_csv(file_path)

        data =  df.to_dict(orient="records")
    
        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/autoscout")
def read_autoscout():
    try:
        file_path = os.path.join(DATA_DIR, "autoscout24.csv")
        columns = ["make", "model", "year", "price", "currency", "mileage", "mileage_unit", "power", "power_unit", "fuel_type", "date"]
        df = pd.read_csv(file_path, on_bad_lines='skip', header=None, names=columns)
        df = df.fillna('')
        data =  df.head(10).to_dict(orient="records")
        return JSONResponse(content=data)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
