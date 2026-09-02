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
                  {showPassword ? "👁️‍🗨️" : "👁️"}
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
