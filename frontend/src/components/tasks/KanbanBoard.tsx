import clsx from "clsx";
import type { Task } from "../../types";

const columns = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" }
];

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  return (
    <div className="kanban-grid">
      {columns.map((column) => (
        <section key={column.key} className="kanban-column">
          <div className="kanban-header">
            <h3>{column.label}</h3>
            <span>{tasks.filter((task) => task.status === column.key).length}</span>
          </div>
          <div className="kanban-stack">
            {tasks
              .filter((task) => task.status === column.key)
              .map((task) => (
                <article key={task.id} className="task-card">
                  <div className="task-card-top">
                    <span className={clsx("priority-pill", task.priority)}>{task.priority}</span>
                    <span>{task.story_points} pts</span>
                  </div>
                  <h4>{task.title}</h4>
                  <p>{task.description || "Execution detail pending."}</p>
                  <div className="task-card-meta">
                    <span>{task.project_name}</span>
                    <span>{task.assignee_name || "Unassigned"}</span>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
