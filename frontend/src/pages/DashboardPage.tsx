import { useEffect, useState } from "react";
import { api } from "../api/client";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { MetricCard } from "../components/dashboard/MetricCard";
import { ProjectTable } from "../components/dashboard/ProjectTable";
import { TaskStatusChart } from "../components/dashboard/TaskStatusChart";
import type { DashboardResponse } from "../types";

type OverviewPoint = {
  status: string;
  total: number;
};

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [overview, setOverview] = useState<OverviewPoint[]>([]);

  useEffect(() => {
    const load = async () => {
      const [dashboardResponse, overviewResponse] = await Promise.all([
        api.get<DashboardResponse>("/dashboard/"),
        api.get<OverviewPoint[]>("/dashboard/overview/")
      ]);
      setDashboard(dashboardResponse.data);
      setOverview(overviewResponse.data);
    };

    void load();
  }, []);

  if (!dashboard) {
    return <div className="page-state">Loading delivery intelligence...</div>;
  }

  return (
    <div className="page">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Workspace Snapshot</p>
          <h2>{dashboard.workspace.name}</h2>
          <p>{dashboard.workspace.description || "A high-velocity product delivery workspace."}</p>
        </div>
        <div className="hero-badge">
          <span>Members</span>
          <strong>{dashboard.workspace.memberships.length}</strong>
        </div>
      </section>

      <section className="metrics-grid">
        <MetricCard label="Projects" value={dashboard.metrics.project_count} trend="Portfolio in motion" />
        <MetricCard label="Active" value={dashboard.metrics.active_projects} trend="High-priority initiatives" />
        <MetricCard label="Open Tasks" value={dashboard.metrics.open_tasks} trend="Execution backlog" />
        <MetricCard label="Critical" value={dashboard.metrics.critical_tasks} trend="Needs senior focus" />
      </section>

      <section className="dashboard-grid">
        <ProjectTable projects={dashboard.projects} />
        <TaskStatusChart data={overview} />
      </section>

      <ActivityFeed activities={dashboard.activities} />
    </div>
  );
}
