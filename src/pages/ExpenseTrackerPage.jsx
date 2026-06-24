import { useState, useMemo } from "react";
import { useApp, CATEGORIES } from "../context/useApp";
import "./ExpenseTracker.css";

/* ── Expense Form Modal (Add / Edit) ── */
function ExpenseModal({ onClose, editData, currency }) {
  const { addTransaction, updateTransaction } = useApp();

  const blankForm = {
    description: "",
    amount: "",
    category: CATEGORIES[0].id,
    date: new Date().toISOString().slice(0, 10),
    note: "",
    type: "expense",
  };

  const [form, setForm] = useState(editData ? { ...editData, amount: String(editData.amount) } : blankForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.category) e.category = "Select a category";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, amount: Number(form.amount), type: "expense" };
    if (editData) {
      await updateTransaction(editData.id, payload);
    } else {
      await addTransaction(payload);
    }
    onClose();
  };

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="expense-modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="expense-modal-title">
            {editData ? "Edit Expense" : "Add Expense"}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="expense-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group full">
            <label className="form-label" htmlFor="exp-desc">Description</label>
            <input id="exp-desc" className={`form-input ${errors.description ? "error" : ""}`}
              placeholder="e.g. Grocery shopping"
              value={form.description} onChange={set("description")} />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-amount">Amount ({currency.symbol})</label>
            <input id="exp-amount" type="number" min="0" step="0.01"
              className={`form-input ${errors.amount ? "error" : ""}`}
              placeholder="0.00"
              value={form.amount} onChange={set("amount")} />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-cat">Category</label>
            <select id="exp-cat" className={`form-select ${errors.category ? "error" : ""}`}
              value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-date">Date</label>
            <input id="exp-date" type="date" className={`form-input ${errors.date ? "error" : ""}`}
              value={form.date} onChange={set("date")} />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>

          <div className="form-group full">
            <label className="form-label" htmlFor="exp-note">Note (optional)</label>
            <input id="exp-note" className="form-input" placeholder="Any extra details..."
              value={form.note} onChange={set("note")} />
          </div>

          <div className="flex gap-3 full" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="expense-save-btn">
              {editData ? "Update" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  Main Expense Tracker Page                  */
/* ─────────────────────────────────────────── */
export default function ExpenseTrackerPage() {
  const {
    transactions, deleteTransaction, currency,
    budgetLimits, setBudgetLimits,
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showLimits, setShowLimits] = useState(false);
  const [limitDraft, setLimitDraft] = useState({ ...budgetLimits });

  const fmt = (n) => `${currency.symbol}${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const currentMonth = new Date().toISOString().slice(0, 7);

  const expenses = useMemo(
    () => transactions.filter((t) => t.type === "expense"),
    [transactions]
  );

  const filtered = useMemo(() => {
    let list = [...expenses];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.description?.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q)
      );
    }

    if (filterCat !== "all") {
      list = list.filter((t) => t.category === filterCat);
    }

    if (filterMonth) {
      list = list.filter((t) => t.date.startsWith(filterMonth));
    }

    list.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-desc") return Number(b.amount) - Number(a.amount);
      if (sortBy === "amount-asc") return Number(a.amount) - Number(b.amount);
      return 0;
    });

    return list;
  }, [expenses, search, filterCat, filterMonth, sortBy]);

  const totalFiltered = filtered.reduce((s, t) => s + Number(t.amount), 0);

  const spendByCat = useMemo(() => {
    const map = {};
    expenses.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return map;
  }, [expenses]);

  const handleEdit = (tx) => {
    setEditData(tx);
    setShowModal(true);
  };

  const handleDelete = async (id, desc) => {
    if (window.confirm(`Delete "${desc}"?`)) await deleteTransaction(id);
  };

  const saveLimits = async () => {
    await setBudgetLimits(limitDraft, currentMonth);
    setShowLimits(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="tracker-toolbar">
        <div className="tracker-filters">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="form-input"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search expenses"
              id="expense-search"
            />
          </div>

          <select className="form-select" style={{ width: "auto" }}
            value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            aria-label="Filter by category" id="cat-filter">
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>

          <input type="month" className="form-input" style={{ width: "auto" }}
            value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
            aria-label="Filter by month" id="month-filter" />

          <select className="form-select" style={{ width: "auto" }}
            value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort expenses" id="sort-select">
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={() => { setLimitDraft({ ...budgetLimits }); setShowLimits(true); }} id="budget-limits-btn">
            ⚙️ Budget Limits
          </button>
          <button className="btn btn-primary" onClick={() => { setEditData(null); setShowModal(true); }} id="add-expense-btn">
            + Add Expense
          </button>
        </div>
      </div>

      <div className="summary-chips">
        <div className="summary-chip">
          <span>📋</span> {filtered.length} expense{filtered.length !== 1 ? "s" : ""}
        </div>
        <div className="summary-chip">
          <span>💸</span> Total: <strong style={{ color: "var(--accent-rose)" }}>{fmt(totalFiltered)}</strong>
        </div>
        {filterCat !== "all" && (
          <div className="summary-chip">
            <span>{CATEGORIES.find((c) => c.id === filterCat)?.icon}</span>
            {CATEGORIES.find((c) => c.id === filterCat)?.label}
          </div>
        )}
      </div>

      {showLimits && (
        <div className="budget-limits-card">
          <div className="budget-limits-header">
            <h2 className="recent-title">⚙️ Set Budget Limits ({currentMonth})</h2>
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowLimits(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={saveLimits} id="save-limits-btn">Save Limits</button>
            </div>
          </div>
          <div className="budget-limits-grid">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="budget-limit-item">
                <div className="budget-limit-item-header">
                  <span style={{ fontSize: "1.25rem" }}>{cat.icon}</span>
                  <span className="budget-limit-item-label">{cat.label}</span>
                </div>
                <input
                  type="number" min="0" step="0.01"
                  className="form-input"
                  placeholder={`Limit (${currency.symbol})`}
                  value={limitDraft[cat.id] || ""}
                  onChange={(e) => setLimitDraft((p) => ({ ...p, [cat.id]: e.target.value }))}
                  aria-label={`Budget limit for ${cat.label}`}
                />
                <div className="budget-limit-spent">
                  <span>Spent: {fmt(spendByCat[cat.id] || 0)}</span>
                  {budgetLimits[cat.id] && (
                    <span>Limit: {fmt(budgetLimits[cat.id])}</span>
                  )}
                </div>
                {budgetLimits[cat.id] && (
                  <div className="progress-bar" style={{ marginTop: 6 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(((spendByCat[cat.id] || 0) / budgetLimits[cat.id]) * 100, 100)}%`,
                        background: (spendByCat[cat.id] || 0) > budgetLimits[cat.id] ? "#f43f5e" : "var(--gradient-hero)"
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="expense-section">
        <div className="expense-section-header">
          <h2 className="recent-title">💸 All Expenses</h2>
          <span className="badge badge-info">{filtered.length} records</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No expenses found</div>
            <p>{expenses.length === 0 ? "Add your first expense to get started." : "Try adjusting your filters."}</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
            <table className="table" aria-label="Expense list">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => {
                  const cat = CATEGORIES.find((c) => c.id === tx.category);
                  return (
                    <tr key={tx.id}>
                      <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{tx.description}</td>
                      <td>
                        <span
                          className="cat-badge"
                          style={{ background: `${cat?.color}22`, color: cat?.color }}
                        >
                          {cat?.icon} {cat?.label}
                        </span>
                      </td>
                      <td>{new Date(tx.date).toLocaleDateString("en-IN")}</td>
                      <td style={{ maxWidth: 180 }} className="truncate">{tx.note || "—"}</td>
                      <td className="expense-amount-cell">-{fmt(tx.amount)}</td>
                      <td>
                        <div className="action-btns" style={{ justifyContent: "center" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEdit(tx)}
                            aria-label={`Edit ${tx.description}`}
                          >✏️</button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(tx.id, tx.description)}
                            aria-label={`Delete ${tx.description}`}
                          >🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ExpenseModal
          onClose={() => setShowModal(false)}
          editData={editData}
          currency={currency}
        />
      )}
    </div>
  );
}