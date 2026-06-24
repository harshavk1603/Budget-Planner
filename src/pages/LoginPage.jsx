/**
 * LoginPage.jsx
 * Premium split-layout auth screen with password visibility toggle.
 * Stores user data in AppContext (which persists to localStorage).
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, register, user } = useApp();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name to continue.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    if (isSignUp) {
      const res = register(trimmed, password);
      if (!res.success) {
        setError(res.error);
        return;
      }
    } else {
      const res = login(trimmed, password);
      if (!res.success) {
        setError(res.error);
        return;
      }
    }
    navigate("/dashboard", { replace: true });
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  return (
    <div className="login-page">
      {/* ── Hero Panel (left side on desktop) ── */}
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
              ["📊", "Analytics", "Visual spending insights"],
              ["💸", "Tracking", "Every transaction logged"],
              ["🎯", "Goals", "Save toward what matters"],
              ["🔔", "Alerts", "Stay within your budget"],
            ].map(([icon, title, desc]) => (
              <div className="login-hero-feature" key={title}>
                <span className="login-hero-feature-icon">{icon}</span>
                <div>
                  <div className="login-hero-feature-title">{title}</div>
                  <div className="login-hero-feature-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form Panel (right side on desktop) ── */}
      <div className="login-panel">
        <div className="login-panel-orb" aria-hidden="true" />

        <div className="login-card">
          {/* Mobile-only logo (hero hidden on mobile) */}
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
              <label className="form-label" htmlFor="user-name">Username</label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">👤</span>
                <input
                  id="user-name"
                  type="text"
                  className={`form-input login-input-with-icon ${error && !name ? "error" : ""}`}
                  placeholder="e.g. harsh_sharma"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  autoFocus
                  autoComplete="username"
                  maxLength={50}
                />
              </div>
            </div>

            <div className="form-group login-form-stagger">
              <label className="form-label" htmlFor="user-password">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">🔒</span>
                <input
                  id="user-password"
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
              <div className={`login-error ${error ? "login-error-show" : ""}`} role="alert">
                <span className="login-error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit-btn"
              id="login-submit-btn"
            >
              <span>{isSignUp ? "✨" : "🚀"}</span> {isSignUp ? "Create Account" : "Log In"}
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
            🔒 Your data stays private & secure
          </div>
        </div>
      </div>
    </div>
  );
}