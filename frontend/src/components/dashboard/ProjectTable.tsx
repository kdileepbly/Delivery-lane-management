import type { Project } from "../../types";

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Projects</p>
          <h3>Delivery pipeline</h3>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Tasks</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong>{project.name}</strong>
                  <p>{project.description}</p>
                </td>
                <td>
                  <span className={`status-pill ${project.status}`}>{project.status}</span>
                </td>
                <td>{project.progress}%</td>
                <td>{project.task_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
