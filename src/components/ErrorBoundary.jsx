import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f0f1a",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif"
        }}>
          <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💥</div>
            <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem", color: "#f43f5e" }}>Something went wrong</h1>
            <p style={{ color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
              BudgetPro encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "1.5rem",
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background: "#8b5cf6",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
