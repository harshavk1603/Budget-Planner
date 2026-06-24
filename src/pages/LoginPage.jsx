/**
 * LoginPage.jsx
 * Simple name-based login (no backend). 
 * Stores user data in AppContext (which persists to localStorage).
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, register, user } = useApp();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <div className="login-page">
      {/* Background blobs */}
      <div className="login-bg-blob login-bg-blob-1" aria-hidden="true" />
      <div className="login-bg-blob login-bg-blob-2" aria-hidden="true" />

      <div className="login-card animate-slide-up">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon" aria-hidden="true">💰</div>
          <span className="login-logo-text text-gradient font-display">BudgetPro</span>
        </div>

        {/* Headline */}
        <div className="login-headline">
          <h1>{isSignUp ? "Create Account 🚀" : "Welcome Back 👋"}</h1>
          <p>{isSignUp ? "Sign up to start managing your finances." : "Enter your credentials to access your dashboard."}</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="user-name">Username</label>
            <input
              id="user-name"
              type="text"
              className={`form-input ${error && !name ? "error" : ""}`}
              placeholder="e.g. harsh_sharma"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              autoFocus
              autoComplete="username"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="user-password">Password</label>
            <input
              id="user-password"
              type="password"
              className={`form-input ${error && !password ? "error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>
          
          {error && <span className="form-error" role="alert" style={{color: 'var(--danger-color, #ef4444)', fontSize: '0.875rem'}}>{error}</span>}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            id="login-submit-btn"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            <span>{isSignUp ? "✨" : "🚀"}</span> {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }} 
            style={{ background: "none", border: "none", color: "#8b5cf6", cursor: "pointer", fontWeight: "600", padding: 0 }}
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </div>

        {/* Features preview */}
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
      </div>
    </div>
  );
}
