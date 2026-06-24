/**
 * DashboardPage.jsx
 * Main dashboard: stats, income management, savings goals, recent transactions,
 * budget alerts, and overspending warnings.
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp, CATEGORIES } from "../context/AppContext";
import StatCard from "../components/StatCard";
import "./Dashboard.css";

/* ── Add Income Modal ── */
function AddIncomeModal({ onClose, currency }) {
  const { addIncome } = useApp();
  const [form, setForm] = useState({ source: "", amount: "", date: new Date().toISOString().slice(0, 10), note: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.source.trim()) e.source = "Source is required";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addIncome({ ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="income-modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="income-modal-title">Add Income</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form className="income-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="income-source">Income Source</label>
            <input id="income-source" className={`form-input ${errors.source ? "error" : ""}`}
              placeholder="e.g. Salary, Freelance"
              value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            {errors.source && <span className="form-error">{errors.source}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="income-amount">Amount ({currency.symbol})</label>
            <input id="income-amount" type="number" min="0" step="0.01"
              className={`form-input ${errors.amount ? "error" : ""}`}
              placeholder="0.00"
              value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="income-date">Date</label>
            <input id="income-date" type="date" className={`form-input ${errors.date ? "error" : ""}`}
              value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="income-note">Note (optional)</label>
            <input id="income-note" className="form-input" placeholder="e.g. Monthly salary"
              value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <div className="flex gap-3" style={{ justifyContent: "flex-end", marginTop: "var(--space-2)" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="income-save-btn">Save Income</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Add Savings Goal Modal ── */
function AddSavingsModal({ onClose, currency }) {
  const { addSavingsGoal } = useApp();
  const [form, setForm] = useState({ name: "", target: "", emoji: "🎯" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Goal name is required";
    if (!form.target || Number(form.target) <= 0) e.target = "Enter a valid target amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addSavingsGoal({ ...form, target: Number(form.target) });
    onClose();
  };

  const EMOJIS = ["🎯", "🏠", "✈️", "🚗", "📱", "💍", "🎓", "🏖️"];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="savings-modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="savings-modal-title">New Savings Goal</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form className="income-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Icon</label>
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              {EMOJIS.map((em) => (
                <button key={em} type="button"
                  onClick={() => setForm({ ...form, emoji: em })}
                  className="btn btn-secondary btn-icon"
                  style={{ fontSize: "1.25rem", background: form.emoji === em ? "rgba(139,92,246,0.2)" : "" }}>
                  {em}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="goal-name">Goal Name</label>
            <input id="goal-name" className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="e.g. Emergency Fund"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="goal-target">Target Amount ({currency.symbol})</label>
            <input id="goal-target" type="number" min="0" step="0.01"
              className={`form-input ${errors.target ? "error" : ""}`}
              placeholder="0.00"
              value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
            {errors.target && <span className="form-error">{errors.target}</span>}
          </div>
          <div className="flex gap-3" style={{ justifyContent: "flex-end", marginTop: "var(--space-2)" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="goal-save-btn">Create Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  Main Dashboard Page                        */
/* ─────────────────────────────────────────── */
export default function DashboardPage() {
  const {
    user, currency,
    totalIncome, totalExpenses, balance, totalSaved,
    transactions, incomeList, deleteIncome,
    savingsGoals, updateSavingsGoal, deleteSavingsGoal,
    budgetLimits,
  } = useApp();

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [depositAmounts, setDepositAmounts] = useState({});

  const fmt = (n) => `${currency.symbol}${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  /* Greeting */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  /* Recent transactions (last 5) */
  const recentTx = transactions.slice(0, 5);

  /* Overspending alerts: categories where spending > limit */
  const spendByCategory = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      map[tx.category] = (map[tx.category] || 0) + Number(tx.amount);
    });
    return map;
  }, [transactions]);

  const alerts = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      const limit = budgetLimits[cat.id];
      const spent = spendByCategory[cat.id] || 0;
      return limit && spent > Number(limit);
    }).map((cat) => ({
      ...cat,
      spent: spendByCategory[cat.id] || 0,
      limit: Number(budgetLimits[cat.id]),
    }));
  }, [budgetLimits, spendByCategory]);

  /* Handle deposit into savings goal */
  const handleDeposit = (goalId) => {
    const amount = Number(depositAmounts[goalId] || 0);
    if (!amount || amount <= 0) return;
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal) return;
    const newSaved = Math.min(Number(goal.saved) + amount, Number(goal.target));
    updateSavingsGoal(goalId, { saved: newSaved });
    setDepositAmounts((prev) => ({ ...prev, [goalId]: "" }));
  };

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="dashboard-overview">
        <h1 className="dashboard-greeting">
          {greeting}, {user?.name}! 👋
        </h1>
        <p className="dashboard-date">{dateStr}</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-card-grid">
        <StatCard icon="💰" label="Total Income" value={fmt(totalIncome)} color="#22c55e" sub="All income sources" />
        <StatCard icon="💸" label="Total Expenses" value={fmt(totalExpenses)} color="#f43f5e" sub="All categories" />
        <StatCard icon="🏦" label="Balance" value={fmt(balance)} color={balance >= 0 ? "#8b5cf6" : "#f43f5e"} sub={balance >= 0 ? "You're on track!" : "Overspent!"} />
        <StatCard icon="🎯" label="Total Saved" value={fmt(totalSaved)} color="#3b82f6" sub="Across all goals" />
      </div>

      {/* ── Overspend Alerts ── */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h2 className="recent-title" style={{ marginBottom: "var(--space-3)" }}>⚠️ Budget Alerts</h2>
          {alerts.map((a) => (
            <div key={a.id} className="alert alert-danger">
              <span style={{ fontSize: "1.25rem" }}>{a.icon}</span>
              <div>
                <strong>{a.label}</strong>: Spent {fmt(a.spent)} — limit is {fmt(a.limit)}.{" "}
                You're over by <strong>{fmt(a.spent - a.limit)}</strong>.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Income Section ── */}
      <section className="income-section" aria-labelledby="income-section-title">
        <div className="income-header">
          <h2 className="recent-title" id="income-section-title">💵 Income Sources</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowIncomeModal(true)} id="add-income-btn">
            + Add Income
          </button>
        </div>

        {incomeList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💵</div>
            <div className="empty-state-title">No income added yet</div>
            <p>Click "Add Income" to record your earnings.</p>
          </div>
        ) : (
          <div className="income-list">
            {incomeList.map((item) => (
              <div key={item.id} className="income-item" role="listitem">
                <div className="income-item-left">
                  <span className="income-item-source">{item.source}</span>
                  <span className="income-item-date">
                    {new Date(item.date).toLocaleDateString("en-IN")}
                    {item.note && ` · ${item.note}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="income-item-amount">+{fmt(item.amount)}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteIncome(item.id)} aria-label={`Delete ${item.source}`}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Savings Goals ── */}
      <section className="savings-section" aria-labelledby="savings-section-title">
        <div className="savings-header">
          <h2 className="recent-title" id="savings-section-title">🎯 Savings Goals</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowSavingsModal(true)} id="add-savings-btn">
            + New Goal
          </button>
        </div>

        {savingsGoals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <div className="empty-state-title">No savings goals yet</div>
            <p>Set a goal to track your progress towards something important.</p>
          </div>
        ) : (
          <div className="savings-list">
            {savingsGoals.map((goal) => {
              const pct = Math.min((Number(goal.saved) / Number(goal.target)) * 100, 100);
              return (
                <div key={goal.id} className="savings-item">
                  <div className="savings-item-header">
                    <div>
                      <span style={{ marginRight: 8 }}>{goal.emoji}</span>
                      <span className="savings-item-name">{goal.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="savings-item-amounts">
                        <strong>{fmt(goal.saved)}</strong> / {fmt(goal.target)}
                      </span>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteSavingsGoal(goal.id)} aria-label={`Delete ${goal.name}`}>
                        🗑
                      </button>
                    </div>
                  </div>

                  <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 100 ? "#22c55e" : "var(--gradient-hero)" }} />
                  </div>

                  <div className="savings-item-pct">
                    <span>{Math.round(pct)}% complete</span>
                    {pct >= 100 && <span style={{ color: "var(--accent-green)" }}>🎉 Goal reached!</span>}
                  </div>

                  {/* Deposit */}
                  {pct < 100 && (
                    <div className="savings-deposit">
                      <input
                        type="number" min="0" step="0.01"
                        className="form-input"
                        placeholder={`Add ${currency.symbol}...`}
                        value={depositAmounts[goal.id] || ""}
                        onChange={(e) => setDepositAmounts((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                        aria-label={`Deposit amount for ${goal.name}`}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => handleDeposit(goal.id)}>
                        Deposit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Recent Transactions ── */}
      <section className="recent-section" aria-labelledby="recent-tx-title">
        <div className="recent-header">
          <h2 className="recent-title" id="recent-tx-title">🕐 Recent Transactions</h2>
          <Link to="/expenses" className="btn btn-secondary btn-sm">View All →</Link>
        </div>

        {recentTx.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No transactions yet</div>
            <p>Add your first expense to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
            <table className="table" aria-label="Recent transactions">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map((tx) => {
                  const cat = CATEGORIES.find((c) => c.id === tx.category);
                  return (
                    <tr key={tx.id}>
                      <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{tx.description}</td>
                      <td>
                        <span className="cat-badge" style={{ background: `${cat?.color}22`, color: cat?.color }}>
                          {cat?.icon} {cat?.label}
                        </span>
                      </td>
                      <td>{new Date(tx.date).toLocaleDateString("en-IN")}</td>
                      <td style={{ textAlign: "right", color: "var(--accent-rose)", fontWeight: 700 }}>
                        -{fmt(tx.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Modals ── */}
      {showIncomeModal && <AddIncomeModal onClose={() => setShowIncomeModal(false)} currency={currency} />}
      {showSavingsModal && <AddSavingsModal onClose={() => setShowSavingsModal(false)} currency={currency} />}
    </div>
  );
}
