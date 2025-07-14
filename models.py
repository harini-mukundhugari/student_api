from pydantic import BaseModel, EmailStr
from typing import Optional

class Student(BaseModel):
    id: int
    name: str
    age: int
    email: EmailStr

class StudentCreate(BaseModel):
    name: str
    age: int
    email: EmailStr
