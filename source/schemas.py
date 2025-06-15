from pydantic import BaseModel

class ReviewCreate(BaseModel):
    brand_model_year: str
    author: str | None = None
    rating: str
    comment: str

class ReviewOut(BaseModel):
    id: int
    brand_model_year: str
    author: str | None = None
    rating: str
    comment: str

    class Config:
        orm_mode = True
