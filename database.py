from threading import Lock

class StudentDB:
    def __init__(self):
        self.students = {}
        self.lock = Lock()
        self.counter = 1

    def create_student(self, student_data):
        with self.lock:
            student_data.id = self.counter
            self.students[self.counter] = student_data
            self.counter += 1
            return student_data

    def get_all(self):
        return list(self.students.values())

    def get_by_id(self, id):
        return self.students.get(id)

    def update_student(self, id, updated_data):
        with self.lock:
            if id in self.students:
                updated_data.id = id
                self.students[id] = updated_data
                return updated_data
            return None

    def delete_student(self, id):
        with self.lock:
            return self.students.pop(id, None)

db = StudentDB()
