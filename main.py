from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from models import Student, StudentCreate
from database import db
from ollama_client import generate_student_summary

app = FastAPI()

# ✅ Updated CORS for Render frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://student-frontend-94qt.onrender.com"],  # <-- your deployed frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/students", response_model=Student)
def create_student(student: StudentCreate):
    return db.create_student(Student(id=0, **student.dict()))

@app.get("/students", response_model=list[Student])
def get_all_students():
    return db.get_all()

@app.get("/students/{student_id}", response_model=Student)
def get_student(student_id: int):
    student = db.get_by_id(student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/students/{student_id}", response_model=Student)
def update_student(student_id: int, student: StudentCreate):
    updated = db.update_student(student_id, Student(id=0, **student.dict()))
    if updated is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated

@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    deleted = db.delete_student(student_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted"}

@app.get("/students/{student_id}/summary")
def get_summary(student_id: int):
    student = db.get_by_id(student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # ✅ Return mock summary
    return {
        "summary": f"{student.name} is {student.age} years old and can be contacted at {student.email}."
    }

