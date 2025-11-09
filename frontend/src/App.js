import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });

  // Load todos on mount and set page title
  useEffect(() => {
    document.title = "To Do App";
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://192.168.178.133:8000/api/todos/");
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://192.168.178.133:8000/api/todos/", {
        title: formData.title,
        description: formData.description,
        completed: false,
      });
      setFormData({ title: "", description: "" });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await axios.put(`http://192.168.178.133:8000/api/todos/${todo.id}/`, {
        ...todo,
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://192.168.178.133:8000/api/todos/${id}/`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="hero">
          <h1>To Do App</h1>
          <p className="small">A simple Django + React todo example</p>
          <div className="features">
            <div className="feature">Responsive</div>
            <div className="feature">Minimal</div>
          </div>
        </div>

        <div className="right-pane">
          <div className="card">
            <form onSubmit={addTodo} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                className="input"
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <input
                className="input"
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <button className="btn" type="submit">Add</button>
            </form>
          </div>

          <div className="card">
            <div className="todo-list">
              {todos.map((todo) => (
                <div key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontWeight: 700 }}>{todo.title}</div>
                    <div style={{ opacity: 0.85 }}>{todo.description}</div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => toggleComplete(todo)}>
                      {todo.completed ? "Undo" : "Complete"}
                    </button>
                    <button className="btn" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

