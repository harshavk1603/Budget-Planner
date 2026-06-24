import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useApp, CURRENCIES } from "../context/useApp";
import "./Layout.css";

const NAV_ITEMS = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/expenses",  icon: "💸", label: "Expenses" },
  { to: "/reports",   icon: "📊", label: "Reports" },
];

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard",      sub: "Your financial overview" },
  "/expenses":  { title: "Expense Tracker",sub: "Manage your spending" },
  "/reports":   { title: "Reports",        sub: "Insights & analytics" },
};

export default function Layout() {
  const { theme, setTheme, currency, setCurrency, user, profile, logOut } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pageInfo = PAGE_TITLES[location.pathname] || { title: "Budget Planner", sub: "" };
  const displayName = profile?.username || user?.email?.split("@")[0] || "User";

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleCurrencyChange = (e) => {
    const selected = CURRENCIES.find((c) => c.code === e.target.value);
    if (selected) setCurrency(selected);
  };

  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">💰</div>
          <div>
            <div className="sidebar-logo-text font-display">BudgetPro</div>
            <div className="sidebar-logo-sub">Smart Finance Tracker</div>
          </div>
        </div>

        <nav className="sidebar-nav" role="navigation">
          <span className="nav-section-label">Menu</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-link-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user" aria-label="Logged in user">
              <div className="sidebar-avatar" aria-hidden="true">
                {displayName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="sidebar-user-name">{displayName}</div>
                <div className="sidebar-user-sub">Personal Account</div>
              </div>
            </div>
          )}
          <button
            className="btn btn-ghost"
            style={{ width: "100%", justifyContent: "flex-start", gap: "10px" }}
            onClick={handleLogout}
            id="logout-btn"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar" role="banner">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="topbar-left">
            <span className="topbar-title">{pageInfo.title}</span>
            <span className="topbar-subtitle">{pageInfo.sub}</span>
          </div>

          <div className="topbar-right">
            <select
              className="currency-select"
              value={currency.code}
              onChange={handleCurrencyChange}
              aria-label="Select currency"
              id="currency-select"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>

            <button
              className={`theme-toggle ${theme}`}
              onClick={handleThemeToggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              id="theme-toggle-btn"
            >
              <div className="theme-toggle-thumb">
                {theme === "dark" ? "🌙" : "☀️"}
              </div>
            </button>
          </div>
        </header>

        <main className="page-content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}