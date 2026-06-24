import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import "./LoginPage.css";

export default function LoginPage() {
  const { signUp, logIn, user } = useApp();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedUsername) {
      setError("Please enter a username to continue.");
      return;
    }
    if (trimmedUsername.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        const res = await signUp(trimmedEmail, password, trimmedUsername);
        if (!res.success) {
          setError(res.error || "Sign up failed. Please try again.");
          setSubmitting(false);
          return;
        }
      } else {
        const res = await logIn(trimmedEmail, password);
        if (!res.success) {
          setError(res.error || "Invalid email or password.");
          setSubmitting(false);
          return;
        }
      }
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  return (
    <div className="login-page">
      {/* Hero Panel */}
      <div className="login-hero" aria-hidden="true">
        <div className="login-hero-orb login-hero-orb-1" />
        <div className="login-hero-orb login-hero-orb-2" />
        <div className="login-hero-orb login-hero-orb-3" />
        <div className="login-hero-content">
          <div className="login-hero-logo">
            <div className="login-hero-logo-icon">💰</div>
            <span className="login-hero-logo-text">BudgetPro</span>
          </div>
          <h2 className="login-hero-tagline">
            Take control of your finances
          </h2>
          <p className="login-hero-subtitle">
            Track expenses, set goals, and make smarter money decisions — all in one beautiful dashboard.
          </p>
          <div className="login-hero-features">
            {[
              ["📊", "Analytics", "Visual spending insights", "purple"],
              ["💸", "Tracking", "Every transaction logged", "blue"],
              ["🎯", "Goals", "Save toward what matters", "green"],
              ["🔔", "Alerts", "Stay within your budget", "rose"],
            ].map(([icon, title, desc, color]) => (
              <div className="login-hero-feature" key={title}>
                <span className={`login-hero-feature-icon ${color}`}>{icon}</span>
                <div>
                  <div className="login-hero-feature-title">{title}</div>
                  <div className="login-hero-feature-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="login-panel">
        <div className="login-panel-orb" aria-hidden="true" />

        <div className="login-card">
          {/* Mobile-only logo */}
          <div className="login-mobile-logo">
            <div className="login-logo-icon" aria-hidden="true">💰</div>
            <span className="login-logo-text text-gradient font-display">BudgetPro</span>
          </div>

          {/* Auth Mode Switcher */}
          <div className="login-mode-switcher">
            <button
              type="button"
              className={`login-mode-btn ${!isSignUp ? "active" : ""}`}
              onClick={() => { setIsSignUp(false); setError(""); }}
            >
              Log In
            </button>
            <button
              type="button"
              className={`login-mode-btn ${isSignUp ? "active" : ""}`}
              onClick={() => { setIsSignUp(true); setError(""); }}
            >
              Sign Up
            </button>
          </div>

          {/* Headline */}
          <div className="login-headline">
            <h1>{isSignUp ? "Create your account" : "Welcome back"}</h1>
            <p>{isSignUp ? "Start managing your finances today." : "Enter your credentials to continue."}</p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group login-form-stagger">
              <label className="form-label" htmlFor="login-username">Username</label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">👤</span>
                <input
                  id="login-username"
                  type="text"
                  className={`form-input login-input-with-icon ${error && !username ? "error" : ""}`}
                  placeholder="e.g. harsh_sharma"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  autoFocus
                  autoComplete="username"
                  maxLength={50}
                />
              </div>
            </div>

            <div className="form-group login-form-stagger">
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">✉️</span>
                <input
                  id="login-email"
                  type="email"
                  className={`form-input login-input-with-icon ${error && !email ? "error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="form-group login-form-stagger">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`form-input login-input-with-icon ${error && !password ? "error" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error login-error-show" role="alert">
                <span className="login-error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit-btn"
              id="login-submit-btn"
              disabled={submitting}
            >
              <span>{isSignUp ? "✨" : "🚀"}</span> {submitting ? "Please wait..." : (isSignUp ? "Create Account" : "Log In")}
            </button>
          </form>

          {/* Switch mode link */}
          <div className="login-switch">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={switchMode} className="login-switch-btn">
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </div>

          {/* Features preview (mobile) */}
          <div className="login-feature-grid">
            {[
              ["📊", "Analytics"],
              ["💸", "Expense Tracking"],
              ["🎯", "Savings Goals"],
              ["🔔", "Budget Alerts"],
            ].map(([icon, label]) => (
              <div className="login-feature" key={label}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="login-trust">
            🔒 Your data stays private &amp; secure
          </div>
        </div>
      </div>
    </div>
  );
}