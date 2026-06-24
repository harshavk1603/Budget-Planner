/**
 * StatCard.jsx
 * Reusable summary card for dashboard metrics.
 * Props: icon, label, value, sub, color, trend
 */

import "./StatCard.css";

export default function StatCard({ icon, label, value, sub, color = "#8b5cf6", trend }) {
  return (
    <div className="stat-card animate-fade-in" role="region" aria-label={label}>
      {/* Icon */}
      <div
        className="stat-card-icon"
        style={{ background: `${color}22` }}
        aria-hidden="true"
      >
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      </div>

      {/* Label */}
      <div className="stat-card-label">{label}</div>

      {/* Value */}
      <div className="stat-card-value" style={{ color }}>
        {value}
      </div>

      {/* Sub / trend */}
      {(sub || trend) && (
        <div className="stat-card-sub">
          {trend && (
            <span style={{ color: trend > 0 ? "#22c55e" : "#f43f5e", marginRight: 6 }}>
              {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
            </span>
          )}
          {sub}
        </div>
      )}
    </div>
  );
}
