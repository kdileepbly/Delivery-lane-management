import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  job_title: "",
  bio: "",
  password: ""
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Registration failed. Check backend setup and try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Launch Your Workspace</p>
        <h1>Create a product delivery workspace in minutes.</h1>
        <p className="auth-copy">
          Built for portfolio demos and sellable SaaS starter kits with auth, task management, and analytics.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              First name
              <input
                value={form.first_name}
                onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                required
              />
            </label>
            <label>
              Last name
              <input
                value={form.last_name}
                onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
                required
              />
            </label>
          </div>
          <label>
            Username
            <input
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>
          <label>
            Job title
            <input
              value={form.job_title}
              onChange={(event) => setForm((prev) => ({ ...prev, job_title: event.target.value }))}
              placeholder="Founder, Product Manager, Team Lead..."
            />
          </label>
          <label>
            Short bio
            <input
              value={form.bio}
              onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
              placeholder="What kind of team or product are you running?"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              minLength={8}
              required
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Creating account..." : "Create Workspace Account"}
          </button>
          <p className="helper-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
