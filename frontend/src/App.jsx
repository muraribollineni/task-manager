import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = "/api";

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 1.1 2.1L22 17l-1.9.9L19 20l-1-2.1-2-.9 2-.9L19 14Z" /></>,
    inbox: <><path d="M4 4h16l2 12v4H2v-4L4 4Z" /><path d="M2 14h5l2 3h6l2-3h5" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setError("");
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error(`Could not load tasks (${res.status})`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the task service.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(e) {
    e.preventDefault();
    const title = task.trim();
    if (!title || saving) return;
    try {
      setSaving(true);
      setError("");
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Date.now(), title }),
      });
      if (!res.ok) throw new Error(`Could not add task (${res.status})`);
      setTask("");
      await loadTasks();
    } catch (err) {
      setError(err.message || "Unable to add task.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTask(id) {
    try {
      setError("");
      const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Could not delete task (${res.status})`);
      setTasks((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    }
  }

  const completedCount = tasks.filter((item) => item.completed === true || item.status === "completed").length;
  const filteredTasks = useMemo(() => tasks.filter((item) => {
    const matchesSearch = (item.title || "").toLowerCase().includes(query.toLowerCase());
    const completed = item.completed === true || item.status === "completed";
    const matchesFilter = filter === "all" || (filter === "completed" ? completed : !completed);
    return matchesSearch && matchesFilter;
  }), [tasks, query, filter]);

  const today = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Taskflow home">
          <span className="brand-mark"><Icon name="check" size={21} /></span>
          <span>task<span className="brand-light">flow</span><small>WORKSPACE</small></span>
        </a>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav">
          <a className="nav-link active" href="#dashboard"><Icon name="grid" /> <span>Overview</span></a>
          <a className="nav-link" href="#tasks"><Icon name="inbox" /> <span>My tasks</span><span className="nav-count">{tasks.length}</span></a>
          <a className="nav-link" href="#completed"><Icon name="check" /> <span>Completed</span></a>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon"><Icon name="spark" /></span>
            <strong>Make today count.</strong>
            <p>Small steps add up to big progress.</p>
          </div>
          <div className="profile">
            <div className="avatar">TM</div>
            <div className="profile-copy"><strong>My workspace</strong><span>Personal plan</span></div>
            <span className="profile-dots">···</span>
          </div>
        </div>
      </aside>

      <main className="main-area" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div>
          <div className="topbar-right"><span className="date-label"><Icon name="calendar" size={16} /> {today}</span><button className="icon-button" aria-label="Notifications"><Icon name="bell" /></button><div className="avatar small">TM</div></div>
        </header>

        <section className="content">
          <div className="welcome-row">
            <div><div className="eyebrow"><span className="live-dot" /> YOUR PRODUCTIVITY SPACE</div><h1>Good things happen<br className="mobile-break" /> when you <span>get things done.</span></h1><p className="welcome-subtitle">A little progress each day adds up to big results.</p></div>
            <div className="welcome-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-star">✦</div><div className="art-center"><Icon name="check" size={31} /></div></div>
          </div>

          <div className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon purple"><Icon name="grid" /></span></div><strong>{tasks.length}</strong><small>Across your workspace</small></article>
            <article className="stat-card"><div className="stat-top"><span>To do</span><span className="stat-icon blue"><Icon name="inbox" /></span></div><strong>{tasks.length - completedCount}</strong><small>Ready for your focus</small></article>
            <article className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green"><Icon name="check" /></span></div><strong>{completedCount}</strong><small>Tasks checked off</small></article>
            <article className="stat-card progress-card"><div className="stat-top"><span>Completion rate</span><span className="stat-icon orange"><Icon name="spark" /></span></div><strong>{tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%</strong><div className="progress-track"><span style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }} /></div></article>
          </div>

          <section className="tasks-panel" id="tasks">
            <div className="panel-heading"><div><div className="eyebrow">YOUR WORK, ORGANIZED</div><h2>My tasks <span className="heading-count">{tasks.length}</span></h2><p>Keep track of what needs your attention.</p></div><div className="panel-spark"><Icon name="spark" size={22} /></div></div>
            <form className="add-task-form" onSubmit={addTask}>
              <span className="input-plus"><Icon name="plus" /></span>
              <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="What needs to get done?" aria-label="New task" />
              <button type="submit" disabled={!task.trim() || saving}>{saving ? "Adding..." : "Add task"} <Icon name="arrow" size={16} /></button>
            </form>
            {error && <div className="error-message" role="alert">{error} <button onClick={loadTasks}>Try again</button></div>}
            <div className="task-toolbar">
              <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
                <button className={filter === "all" ? "filter-tab selected" : "filter-tab"} onClick={() => setFilter("all")} type="button">All tasks <span>{tasks.length}</span></button>
                <button className={filter === "active" ? "filter-tab selected" : "filter-tab"} onClick={() => setFilter("active")} type="button">To do</button>
                <button className={filter === "completed" ? "filter-tab selected" : "filter-tab"} onClick={() => setFilter("completed")} type="button">Completed</button>
              </div>
              <label className="search-box"><Icon name="search" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." /></label>
            </div>
            <div className="task-list">
              {loading ? <div className="empty-state"><div className="empty-icon"><Icon name="spark" size={24} /></div><strong>Loading your tasks</strong><p>Getting your workspace ready...</p></div> :
                filteredTasks.length ? filteredTasks.map((item) => {
                  const done = item.completed === true || item.status === "completed";
                  return <article className={`task-row ${done ? "is-completed" : ""}`} key={item.id}>
                    <span className={`task-check ${done ? "checked" : ""}`}>{done && <Icon name="check" size={14} />}</span>
                    <div className="task-copy"><strong>{item.title}</strong><span>{done ? "Completed" : "In your task list"}</span></div>
                    <span className={`task-status ${done ? "status-done" : "status-open"}`}>{done ? "Completed" : "To do"}</span>
                    <button className="delete-button" onClick={() => deleteTask(item.id)} aria-label={`Delete ${item.title}`} title="Delete task"><Icon name="trash" size={17} /></button>
                  </article>;
                }) : <div className="empty-state"><div className="empty-icon"><Icon name={query ? "search" : "check"} size={24} /></div><strong>{query ? "No matching tasks" : filter === "completed" ? "Nothing completed yet" : "You're all caught up"}</strong><p>{query ? "Try another search term." : "Add a task above and it will appear here."}</p></div>}
            </div>
            <div className="panel-footer"><span>Showing {filteredTasks.length} of {tasks.length} tasks</span><span><span className="footer-dot" /> Synced with your workspace</span></div>
          </section>
          <footer className="page-footer">Made for focused work <span>✦</span></footer>
        </section>
      </main>
    </div>
  );
}

export default App;
