import { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Area, AreaChart,
} from "recharts";
import { useApp, CATEGORIES } from "../context/useApp";
import "./Reports.css";

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      {label && <div className="custom-tooltip-label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="custom-tooltip-value" style={{ color: p.color || p.fill }}>
          {p.name}: {currency.symbol}{Number(p.value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const { transactions, currency, totalIncome, totalExpenses, balance } = useApp();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fmt = (n) => `${currency.symbol}${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const expenses = useMemo(
    () => transactions.filter((t) => t.type === "expense"),
    [transactions]
  );

  const incomes = useMemo(
    () => transactions.filter((t) => t.type === "income"),
    [transactions]
  );

  const monthlyTx = useMemo(
    () => expenses.filter((t) => t.date.startsWith(selectedMonth)),
    [expenses, selectedMonth]
  );

  const monthlyTotal = monthlyTx.reduce((s, t) => s + Number(t.amount), 0);

  const categoryData = useMemo(() => {
    const map = {};
    monthlyTx.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return CATEGORIES
      .filter((c) => map[c.id])
      .map((c) => ({ ...c, value: map[c.id] }))
      .sort((a, b) => b.value - a.value);
  }, [monthlyTx]);

  const trendData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      const monthExpenses = expenses
        .filter((t) => t.date.startsWith(key))
        .reduce((s, t) => s + Number(t.amount), 0);
      const monthIncome = incomes
        .filter((t) => t.date.startsWith(key))
        .reduce((s, e) => s + Number(e.amount), 0);
      months.push({ label, expenses: monthExpenses, income: monthIncome, savings: Math.max(monthIncome - monthExpenses, 0) });
    }
    return months;
  }, [expenses, incomes]);

  const barData = trendData;

  const monthlySummary = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      const exp = expenses.filter((t) => t.date.startsWith(key)).reduce((s, t) => s + Number(t.amount), 0);
      const inc = incomes.filter((t) => t.date.startsWith(key)).reduce((s, e) => s + Number(e.amount), 0);
      if (exp > 0 || inc > 0) months.push({ label, income: inc, expenses: exp, savings: Math.max(inc - exp, 0) });
    }
    return months.reverse();
  }, [expenses, incomes]);

  const chartStyle = {
    fontSize: "12px",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const tickStyle = { fill: "var(--text-muted)", fontSize: 12 };

  return (
    <div className="animate-fade-in">
      <div className="reports-month-bar">
        <label className="form-label" htmlFor="report-month">Viewing Month:</label>
        <input
          id="report-month"
          type="month"
          className="form-input"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <div className="reports-month-chip">
          Monthly Expenses: <strong style={{ marginLeft: 6 }}>{fmt(monthlyTotal)}</strong>
        </div>
      </div>

      <div className="reports-grid">
        <div className="reports-chart-card">
          <h2 className="reports-chart-title">🥧 Category Breakdown</h2>
          {categoryData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🥧</div>
              <div className="empty-state-title">No data for this month</div>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Legend
                    formatter={(value) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="cat-breakdown-table">
                {categoryData.map((cat) => {
                  const pct = monthlyTotal > 0 ? ((cat.value / monthlyTotal) * 100).toFixed(1) : 0;
                  return (
                    <div key={cat.id} className="cat-breakdown-row">
                      <div className="cat-breakdown-icon" style={{ background: `${cat.color}22` }}>
                        {cat.icon}
                      </div>
                      <div className="cat-breakdown-info">
                        <div className="cat-breakdown-header">
                          <span className="cat-breakdown-name">{cat.label}</span>
                          <span className="cat-breakdown-amount">{fmt(cat.value)}</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: cat.color }} />
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{pct}% of total</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="reports-chart-card">
          <h2 className="reports-chart-title">📊 Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} style={chartStyle} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${currency.symbol}${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`} />
              <Tooltip content={<CustomTooltip currency={currency} />} />
              <Legend formatter={(v) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{v}</span>} />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex gap-4" style={{ marginTop: "var(--space-4)", flexWrap: "wrap" }}>
            <div>
              <div className="form-label">Total Income</div>
              <div style={{ color: "var(--accent-green)", fontWeight: 700, fontFamily: "var(--font-display)" }}>{fmt(totalIncome)}</div>
            </div>
            <div>
              <div className="form-label">Total Expenses</div>
              <div style={{ color: "var(--accent-rose)", fontWeight: 700, fontFamily: "var(--font-display)" }}>{fmt(totalExpenses)}</div>
            </div>
            <div>
              <div className="form-label">Net Balance</div>
              <div style={{ color: balance >= 0 ? "var(--accent-purple)" : "var(--accent-rose)", fontWeight: 700, fontFamily: "var(--font-display)" }}>{fmt(balance)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="trends-card">
        <h2 className="reports-chart-title">📈 Spending Trends (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trendData} style={chartStyle}>
            <defs>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false}
              tickFormatter={(v) => `${currency.symbol}${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`} />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend formatter={(v) => <span style={{ color: "var(--text-secondary)", fontSize: 12, textTransform: "capitalize" }}>{v}</span>} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" fill="url(#incGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fill="url(#expGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="savings" name="Savings" stroke="#8b5cf6" fill="url(#savGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="monthly-table-card">
        <div className="monthly-table-header">
          <h2 className="reports-chart-title" style={{ margin: 0 }}>📅 Monthly Summary</h2>
        </div>
        {monthlySummary.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-title">No historical data yet</div>
            <p>Add transactions and income to see monthly summaries.</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
            <table className="table" aria-label="Monthly financial summary">
              <thead>
                <tr>
                  <th>Month</th>
                  <th style={{ textAlign: "right" }}>Income</th>
                  <th style={{ textAlign: "right" }}>Expenses</th>
                  <th style={{ textAlign: "right" }}>Savings</th>
                  <th style={{ textAlign: "right" }}>Savings Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.map((row) => {
                  const rate = row.income > 0 ? ((row.savings / row.income) * 100).toFixed(1) : 0;
                  return (
                    <tr key={row.label}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.label}</td>
                      <td style={{ textAlign: "right", color: "var(--accent-green)", fontWeight: 600 }}>{fmt(row.income)}</td>
                      <td style={{ textAlign: "right", color: "var(--accent-rose)", fontWeight: 600 }}>{fmt(row.expenses)}</td>
                      <td style={{ textAlign: "right", color: "var(--accent-purple)", fontWeight: 600 }}>{fmt(row.savings)}</td>
                      <td style={{ textAlign: "right" }}>
                        <span className={`badge ${Number(rate) >= 20 ? "badge-success" : Number(rate) >= 10 ? "badge-warning" : "badge-danger"}`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}