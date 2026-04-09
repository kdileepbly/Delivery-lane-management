import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("demo.lead");
  const [password, setPassword] = useState("StrongPass123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Login failed. Ensure backend is running and demo credentials are seeded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">TaskForge</p>
        <h1>Operational clarity for product delivery teams.</h1>
        <p className="auth-copy">
          Recruiter-friendly demo stack with JWT auth, analytics, project management workflows, and responsive UI.
        </p>
        <div className="demo-note">
          <strong>Demo access</strong>
          <span>`demo.lead` / `StrongPass123`</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Open Workspace"}
          </button>
          <p className="helper-text">
            Want your own workspace? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
