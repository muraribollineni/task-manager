import { useEffect, useState } from "react";
import "./App.css";

const API = "/api";
function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  async function loadTasks() {
    const res = await fetch(`${API}/tasks`);
    setTasks(await res.json());
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!task.trim()) return;

    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Date.now(),
        title: task
      })
    });

    setTask("");
    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, {
      method: "DELETE"
    });
    loadTasks();
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <h1>My First CI/CD Application</h1>
      <p>My DevOps Practice Application</p>
      <form onSubmit={addTask}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button>Add Task</button>
      </form>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title}
            <button onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;