import React, { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', email: '' });
  const [summaries, setSummaries] = useState({});
  const [editId, setEditId] = useState(null);  // ✅ Track if we're editing

  const fetchStudents = async () => {
    const res = await fetch('http://localhost:8000/students');
    const data = await res.json();
    setStudents(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, age: parseInt(form.age) };

    if (editId === null) {
      // Create student
      await fetch('http://localhost:8000/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      // Update student
      await fetch(`http://localhost:8000/students/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setEditId(null);
    }

    setForm({ name: '', age: '', email: '' });
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await fetch(`http://localhost:8000/students/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  const fetchSummary = async (id) => {
    if (summaries[id]) return;
    const res = await fetch(`http://localhost:8000/students/${id}/summary`);
    const data = await res.json();
    setSummaries(prev => ({ ...prev, [id]: data.summary }));
  };

  const startEdit = (student) => {
    setForm({ name: student.name, age: student.age, email: student.email });
    setEditId(student.id);
  };

  const cancelEdit = () => {
    setForm({ name: '', age: '', email: '' });
    setEditId(null);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">FealtyX - Student Manager</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="border p-2 w-full" />
        <input name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" required className="border p-2 w-full" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="border p-2 w-full" />
        
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId === null ? 'Add Student' : 'Update Student'}
          </button>
          {editId !== null && (
            <button type="button" onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-4">
        {students.map((s) => (
          <li key={s.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <p><strong>{s.name}</strong> ({s.age}) - {s.email}</p>
              <div className="space-x-2">
                <button onClick={() => fetchSummary(s.id)} className="bg-purple-500 text-white px-3 py-1 rounded">Summary</button>
                <button onClick={() => startEdit(s)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => deleteStudent(s.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
            {summaries[s.id] && (
              <p className="mt-2 text-sm text-gray-700 bg-gray-100 p-2 rounded">{summaries[s.id]}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
