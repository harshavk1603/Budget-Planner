/**
 * AppContext.jsx
 * Global state management using React Context API.
 * Manages: theme, currency, transactions, income, savings goals.
 * All data is persisted to Local Storage automatically.
 */

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

// Budget categories with icons and colors
export const CATEGORIES = [
  { id: "food",          label: "Food & Dining",   icon: "🍔", color: "#f97316" },
  { id: "transport",     label: "Transport",        icon: "🚗", color: "#3b82f6" },
  { id: "shopping",      label: "Shopping",         icon: "🛍️", color: "#a855f7" },
  { id: "bills",         label: "Bills & Utilities",icon: "💡", color: "#ef4444" },
  { id: "education",     label: "Education",        icon: "📚", color: "#22c55e" },
  { id: "entertainment", label: "Entertainment",    icon: "🎬", color: "#ec4899" },
  { id: "others",        label: "Others",           icon: "📦", color: "#64748b" },
];

// Supported currencies
export const CURRENCIES = [
  { symbol: "₹", code: "INR", label: "Indian Rupee" },
  { symbol: "$", code: "USD", label: "US Dollar" },
  { symbol: "€", code: "EUR", label: "Euro" },
  { symbol: "£", code: "GBP", label: "British Pound" },
];

// Helper: load a value from localStorage with a fallback
const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Helper: save a value to localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("Failed to persist data:", key);
  }
};

export const AppProvider = ({ children }) => {
  /* ─── Theme ─── */
  const [theme, setTheme] = useState(() => loadFromStorage("bp_theme", "dark"));

  /* ─── Currency ─── */
  const [currency, setCurrency] = useState(() =>
    loadFromStorage("bp_currency", CURRENCIES[0])
  );

  /* ─── Auth (username & password) ─── */
  const [user, setUser] = useState(() => loadFromStorage("bp_user", null));
  const [registeredUsers, setRegisteredUsers] = useState(() => loadFromStorage("bp_users", []));

  /* ─── Transactions ─── */
  const [transactions, setTransactions] = useState(() =>
    loadFromStorage("bp_transactions", [])
  );

  /* ─── Income entries ─── */
  const [incomeList, setIncomeList] = useState(() =>
    loadFromStorage("bp_income", [])
  );

  /* ─── Savings goals ─── */
  const [savingsGoals, setSavingsGoals] = useState(() =>
    loadFromStorage("bp_savings", [])
  );

  /* ─── Budget limits per category ─── */
  const [budgetLimits, setBudgetLimits] = useState(() =>
    loadFromStorage("bp_limits", {})
  );

  /* ─── Persist on every change ─── */
  useEffect(() => { saveToStorage("bp_theme", theme); }, [theme]);
  useEffect(() => { saveToStorage("bp_currency", currency); }, [currency]);
  useEffect(() => { saveToStorage("bp_user", user); }, [user]);
  useEffect(() => { saveToStorage("bp_users", registeredUsers); }, [registeredUsers]);
  useEffect(() => { saveToStorage("bp_transactions", transactions); }, [transactions]);
  useEffect(() => { saveToStorage("bp_income", incomeList); }, [incomeList]);
  useEffect(() => { saveToStorage("bp_savings", savingsGoals); }, [savingsGoals]);
  useEffect(() => { saveToStorage("bp_limits", budgetLimits); }, [budgetLimits]);

  /* ─── Apply theme class to <html> ─── */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* ─── Derived totals ─── */
  const totalIncome = incomeList.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpenses = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpenses;
  const totalSaved = savingsGoals.reduce((sum, g) => sum + Number(g.saved), 0);

  /* ─── Transaction CRUD ─── */
  const addTransaction = (tx) => {
    const newTx = { ...tx, id: Date.now().toString() };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id, data) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  /* ─── Income CRUD ─── */
  const addIncome = (entry) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setIncomeList((prev) => [newEntry, ...prev]);
  };

  const deleteIncome = (id) => {
    setIncomeList((prev) => prev.filter((e) => e.id !== id));
  };

  /* ─── Savings CRUD ─── */
  const addSavingsGoal = (goal) => {
    const newGoal = { ...goal, id: Date.now().toString(), saved: 0 };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  const updateSavingsGoal = (id, data) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...data } : g))
    );
  };

  const deleteSavingsGoal = (id) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  /* ─── Auth ─── */
  const register = (username, password) => {
    const exists = registeredUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return { success: false, error: "Username already exists." };
    }
    const newUser = { username, password, createdAt: new Date().toISOString() };
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser({ name: username, loginTime: new Date().toISOString() });
    return { success: true };
  };

  const login = (username, password) => {
    const existingUser = registeredUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!existingUser) {
      return { success: false, error: "Invalid username or password." };
    }
    setUser({ name: existingUser.username, loginTime: new Date().toISOString() });
    return { success: true };
  };

  const logout = () => setUser(null);

  const value = {
    theme, setTheme,
    currency, setCurrency,
    user, login, register, logout,
    transactions, addTransaction, updateTransaction, deleteTransaction,
    incomeList, addIncome, deleteIncome,
    savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal,
    budgetLimits, setBudgetLimits,
    totalIncome, totalExpenses, balance, totalSaved,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for easy consumption
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
