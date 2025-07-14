import React, { useEffect, useState } from 'react';
import StudentForm from './components/StudentForm';

function App() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const res = await fetch('http://localhost:8000/students');
    const data = await res.json();
    setStudents(data);
  };

  const deleteStudent = async (id) => {
    await fetch(`http://localhost:8000/students/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  const fetchSummary = async (id) => {
    const res = await fetch(`http://localhost:8000/students/${id}/summary`);
    const data = await res.json();
    alert(data.summary);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Manager</h1>
      <StudentForm onSuccess={fetchStudents} />
      <ul className="mt-6 space-y-4">
        {students.map((s) => (
          <li key={s.id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <p><strong>{s.name}</strong> ({s.age}) - {s.email}</p>
            </div>
            <div className="space-x-2">
              <button className="bg-purple-500 text-white px-3 py-1 rounded" onClick={() => fetchSummary(s.id)}>Summary</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteStudent(s.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
