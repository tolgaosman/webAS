import { useState } from "react";
import { login, ApiError } from "../lib/adminApi";
import { FolderContainer } from "../components/common/FolderContainer";

export function LoginCard({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login("alarasoysan@gmail.com", password);
      onLoggedIn();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Giriş başarısız.";
      alert("Hata: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper" id="login-wrapper">
      <FolderContainer tabLabel="Security Entry" className="login-card">
        <div className="login-body" id="login-form-body">
          <h2>Admin Login</h2>
          <p className="login-subtitle">Please enter your administrator password.</p>
          <form id="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="admin-password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    color: "inherit"
                  }}
                  title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                >
                  {showPassword ? (
                    /* Eye with line through — hide password */
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    /* Plain eye — show password */
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="forgot-password-container">
              <span className="forgot-password-link" style={{ cursor: "default", color: "var(--text-muted)" }}>
                Single Admin Access
              </span>
            </div>
            <button type="submit" className="btn btn-primary full-width" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
            <p className="login-tip">Your administrator credentials are active.</p>
          </form>
        </div>
      </FolderContainer>
    </div>
  );
}
