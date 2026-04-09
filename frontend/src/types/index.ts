export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  bio: string;
  avatar_url: string;
};

export type WorkspaceMember = {
  id: number;
  role: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    job_title: string;
    avatar_url: string;
  };
};

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  description: string;
  memberships: WorkspaceMember[];
  created_at: string;
};

export type Project = {
  id: number;
  workspace: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  task_count: number;
};

export type Task = {
  id: number;
  project: number;
  project_name: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: number | null;
  assignee_name: string | null;
  reporter: number | null;
  due_date: string | null;
  story_points: number;
  tags: string[];
  created_at: string;
};

export type Activity = {
  id: number;
  actor_name: string;
  verb: string;
  target: string;
  metadata: Record<string, string>;
  created_at: string;
};

export type DashboardResponse = {
  workspace: Workspace;
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  metrics: Record<string, number>;
};
