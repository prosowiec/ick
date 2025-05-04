from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Otomoto(Base):
    __tablename__ = "otomoto"
    make = Column(String)
    model = Column(String)
    price = Column(Float)
    currency = Column(String)
    year = Column(Integer)
    power = Column(Integer)
    mileage = Column(Integer)
    mileage_unit = Column(String)
    gearbox = Column(String)
    eng_cap = Column(Float)
    fuel_type = Column(String)
    accident = Column(String)
    date = Column(String)
    link = Column(String, primary_key=True, index=True)

class Autoscout(Base):
    __tablename__ = "autoscout"

    id           = Column(Integer, primary_key=True, autoincrement=True)

    make         = Column(String)
    model        = Column(String, primary_key=True)
    year         = Column(Integer)
    price        = Column(Float)
    currency     = Column(String)
    mileage      = Column(Float)
    mileage_unit = Column(String)
    power        = Column(Integer)
    power_unit   = Column(String)
    fuel_type    = Column(String)
    date         = Column(String)