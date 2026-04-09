import { useEffect, useState } from "react";
import { api } from "../api/client";
import { KanbanBoard } from "../components/tasks/KanbanBoard";
import type { Project, Task } from "../types";

const emptyTask = {
  project: "",
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  due_date: "",
  story_points: 1,
  tags: ""
};

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyTask);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      const params: Record<string, string> = {};
      if (status) {
        params.status = status;
      }
      if (priority) {
        params.priority = priority;
      }
      const [taskResponse, projectResponse] = await Promise.all([
        api.get<Task[]>("/tasks/", { params }),
        api.get<Project[]>("/projects/")
      ]);
      setTasks(taskResponse.data);
      setProjects(projectResponse.data);
      setLoading(false);
    };

    void load();
  }, [priority, status]);

  const handleCreateTask = async () => {
    if (!form.project || !form.title.trim()) {
      setError("Project aur title required hain.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      await api.post("/tasks/", {
        project: Number(form.project),
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || null,
        story_points: Number(form.story_points),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      });
      setForm(emptyTask);
      const params: Record<string, string> = {};
      if (status) {
        params.status = status;
      }
      if (priority) {
        params.priority = priority;
      }
      const response = await api.get<Task[]>("/tasks/", { params });
      setTasks(response.data);
    } catch (requestError: any) {
      const apiError =
        requestError?.response?.data?.detail ||
        Object.values(requestError?.response?.data || {}).flat().join(" ") ||
        "Task create nahi ho paya. Form values dubara check karo.";
      setError(String(apiError));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Execution Board</p>
          <h2>Delivery lane management</h2>
          <p>Track critical work, assignees, priorities, and create new tasks from the same operational view.</p>
        </div>
      </section>
      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Quick Create</p>
              <h3>Create a task</h3>
            </div>
          </div>
          <div className="auth-form">
            <label>
              Project
              <select
                value={form.project}
                onChange={(event) => setForm((prev) => ({ ...prev, project: event.target.value }))}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Title
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </label>
            <label>
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
              />
            </label>
            <div className="form-grid">
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label>
                Priority
                <select
                  value={form.priority}
                  onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>
            </div>
            <div className="form-grid">
              <label>
                Due date
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(event) => setForm((prev) => ({ ...prev, due_date: event.target.value }))}
                />
              </label>
              <label>
                Story points
                <input
                  type="number"
                  min={1}
                  value={form.story_points}
                  onChange={(event) => setForm((prev) => ({ ...prev, story_points: Number(event.target.value) }))}
                />
              </label>
            </div>
            <label>
              Tags
              <input
                value={form.tags}
                onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                placeholder="frontend, urgent, launch"
              />
            </label>
            <button type="button" className="primary-button" onClick={handleCreateTask} disabled={creating}>
              {creating ? "Creating..." : "Create Task"}
            </button>
            {error ? <p className="error-text">{error}</p> : null}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Filters</p>
              <h3>Focus the board</h3>
            </div>
          </div>
          <div className="auth-form">
            <label>
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">All</option>
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label>
              Priority
              <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
            <div className="stat-strip">
              <div>
                <span>Total visible</span>
                <strong>{tasks.length}</strong>
              </div>
              <div>
                <span>Projects</span>
                <strong>{projects.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loading ? <div className="page-state">Loading board...</div> : <KanbanBoard tasks={tasks} />}
    </div>
  );
}
