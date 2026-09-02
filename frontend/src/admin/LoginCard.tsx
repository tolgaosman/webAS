import { useState } from "react";
import { login, ApiError } from "../lib/adminApi";
import { FolderContainer } from "../components/common/FolderContainer";

export function LoginCard({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      onLoggedIn();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Giriş başarısız.";
      alert("Hata: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = (e: React.MouseEvent) => {
    e.preventDefault();
    setResetEmail(email);
    setMode("reset");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin credentials are server environment variables (no self-service
    // email reset flow) — matches the legacy admin.js behavior exactly.
    alert("Şifre sıfırlama e-postayla yapılamıyor. Şifreyi değiştirmek için sunucudaki ADMIN_PASSWORD ortam değişkenini güncelleyin.");
    setMode("login");
  };

  return (
    <div className="login-wrapper" id="login-wrapper">
      <FolderContainer tabLabel="Security Entry" className="login-card">
        {mode === "login" ? (
          <div className="login-body" id="login-form-body">
            <h2>Admin Login</h2>
            <p className="login-subtitle">Please enter your administrator email and password.</p>
            <form id="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="admin-email">Email</label>
                <input
                  type="email"
                  id="admin-email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <input
                  type="password"
                  id="admin-password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="forgot-password-container">
                <a href="#" id="forgot-password-link" className="forgot-password-link" onClick={handleForgot}>
                  Şifremi Unuttum
                </a>
              </div>
              <button type="submit" className="btn btn-primary full-width" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
              </button>
              <p className="login-tip">Your administrator credentials are active.</p>
            </form>
          </div>
        ) : (
          <div className="login-body" id="reset-password-body">
            <h2>Reset Password</h2>
            <p className="login-subtitle">Enter your administrator email to receive a password reset link.</p>
            <form id="reset-password-form" onSubmit={handleReset}>
              <div className="form-group">
                <label htmlFor="reset-email">Email</label>
                <input
                  type="email"
                  id="reset-email"
                  placeholder="admin@example.com"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
                <button type="button" id="btn-back-to-login" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setMode("login")}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
                  Send Reset Link
                </button>
              </div>
              <p className="login-tip">Check your inbox for further instructions.</p>
            </form>
          </div>
        )}
      </FolderContainer>
    </div>
  );
}
