import requests

def generate_student_summary(student):
    prompt = f"Provide a brief summary of the student profile:\n\nName: {student.name}\nAge: {student.age}\nEmail: {student.email}"
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False}
    )
    return response.json().get("response", "No summary generated.")
