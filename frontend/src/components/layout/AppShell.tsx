import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/tasks", label: "Execution Board" }
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">TaskForge</p>
          <h1>Delivery cockpit for modern teams.</h1>
          <p className="sidebar-copy">
            Showcase-grade full stack product built with Django REST and React TypeScript.
          </p>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="profile-card">
          <div>
            <p className="profile-name">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="profile-role">{user?.job_title || "Team Lead"}</p>
          </div>
          <button type="button" className="ghost-button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
