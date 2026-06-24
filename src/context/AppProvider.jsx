import { useState, useEffect, useCallback } from "react";
import { AppContext } from "./AppContext";
import { CURRENCIES } from "./constants";
import { isSupabaseConfigured } from "../lib/supabase";
import { authService } from "../services/authService";
import { transactionService } from "../services/transactionService";
import { savingsService } from "../services/savingsService";
import { budgetService } from "../services/budgetService";

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage write failed
  }
};

export default function AppProvider({ children }) {
  // Initialize loading to false if Supabase is not configured
  const initialLoading = isSupabaseConfigured;

  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(initialLoading);

  const [theme, setTheme] = useState(() => loadFromStorage("bp_theme", "dark"));
  const [currency, setCurrency] = useState(() =>
    loadFromStorage("bp_currency", CURRENCIES[0])
  );

  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetLimits, setBudgetLimitsState] = useState({});

  useEffect(() => { saveToStorage("bp_theme", theme); }, [theme]);
  useEffect(() => { saveToStorage("bp_currency", currency); }, [currency]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured) {
      return;
    }

    const getInitialSession = async () => {
      try {
        const currentSession = await authService.getSession();
        if (cancelled) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const p = await authService.getProfile(currentSession.user.id);
          if (cancelled) return;
          setProfile(p);
        }
      } catch {
        // no session
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getInitialSession();

    let subscription;
    try {
      const { data } = authService.onAuthStateChange(
        async (event, newSession) => {
          if (cancelled) return;
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            const p = await authService.getProfile(newSession.user.id);
            if (!cancelled) setProfile(p);
          } else {
            if (!cancelled) {
              setProfile(null);
              setTransactions([]);
              setSavingsGoals([]);
              setBudgets([]);
              setBudgetLimitsState({});
            }
          }
        }
      );
      subscription = data.subscription;
    } catch {
      // auth state change listener unavailable
    }

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  const userId = user?.id;

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      if (!userId) return;
      try {
        const results = await Promise.allSettled([
          transactionService.fetchAll(userId),
          savingsService.fetchAll(userId),
          budgetService.fetchAll(userId),
        ]);
        if (cancelled) return;
        if (results[0].status === "fulfilled") setTransactions(results[0].value);
        if (results[1].status === "fulfilled") setSavingsGoals(results[1].value);
        if (results[2].status === "fulfilled") {
          const bData = results[2].value;
          setBudgets(bData);
          const limits = {};
          bData.forEach((b) => { limits[b.category] = b.limit_amount; });
          setBudgetLimitsState(limits);
        }
      } catch {
        // handle error silently
      }
    };

    loadAll();

    return () => { cancelled = true; };
  }, [userId]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;
  const totalSaved = savingsGoals.reduce((sum, g) => sum + Number(g.saved), 0);

  const signUp = async (email, password, username) => {
    try {
      await authService.signUp(email, password, username);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logIn = async (email, password) => {
    try {
      await authService.signIn(email, password);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logOut = async () => {
    await authService.signOut();
    setTransactions([]);
    setSavingsGoals([]);
    setBudgets([]);
    setBudgetLimitsState({});
  };

  const addTransaction = async (tx) => {
    if (!userId) return;
    const newTx = await transactionService.add(userId, tx);
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = async (id, data) => {
    if (!userId) return;
    const updated = await transactionService.update(userId, id, data);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTransaction = async (id) => {
    if (!userId) return;
    await transactionService.delete(userId, id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addSavingsGoal = async (goal) => {
    if (!userId) return;
    const newGoal = await savingsService.add(userId, goal);
    setSavingsGoals((prev) => [newGoal, ...prev]);
  };

  const updateSavingsGoal = async (id, data) => {
    if (!userId) return;
    const updated = await savingsService.update(userId, id, data);
    setSavingsGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
  };

  const deleteSavingsGoal = async (id) => {
    if (!userId) return;
    await savingsService.delete(userId, id);
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const depositToSavingsGoal = async (id, amount) => {
    if (!userId) return;
    const updated = await savingsService.deposit(userId, id, amount);
    setSavingsGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
  };

  const addBudget = async (category, limitAmount, month) => {
    if (!userId) return;
    await budgetService.upsert(userId, { category, limit_amount: limitAmount, month });
    const data = await budgetService.fetchAll(userId);
    setBudgets(data);
    const limits = {};
    data.forEach((b) => { limits[b.category] = b.limit_amount; });
    setBudgetLimitsState(limits);
  };

  const deleteBudget = async (category, month) => {
    if (!userId) return;
    await budgetService.deleteByCategory(userId, category, month);
    const data = await budgetService.fetchAll(userId);
    setBudgets(data);
    const limits = {};
    data.forEach((b) => { limits[b.category] = b.limit_amount; });
    setBudgetLimitsState(limits);
  };

  const setBudgetLimits = async (limitsObj, month) => {
    if (!userId) return;
    for (const [cat, limit] of Object.entries(limitsObj)) {
      if (limit && Number(limit) > 0) {
        await budgetService.upsert(userId, {
          category: cat,
          limit_amount: Number(limit),
          month,
        });
      }
    }
    const data = await budgetService.fetchAll(userId);
    setBudgets(data);
    const limits = {};
    data.forEach((b) => { limits[b.category] = b.limit_amount; });
    setBudgetLimitsState(limits);
  };

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    const data = await transactionService.fetchAll(userId);
    setTransactions(data);
  }, [userId]);

  const fetchSavingsGoals = useCallback(async () => {
    if (!userId) return;
    const data = await savingsService.fetchAll(userId);
    setSavingsGoals(data);
  }, [userId]);

  const fetchBudgets = useCallback(async () => {
    if (!userId) return;
    const data = await budgetService.fetchAll(userId);
    setBudgets(data);
    const limits = {};
    data.forEach((b) => { limits[b.category] = b.limit_amount; });
    setBudgetLimitsState(limits);
  }, [userId]);

  const value = {
    session,
    user,
    profile,
    loading,
    theme, setTheme,
    currency, setCurrency,
    signUp, logIn, logOut,
    transactions, addTransaction, updateTransaction, deleteTransaction, fetchTransactions,
    savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, depositToSavingsGoal, fetchSavingsGoals,
    budgets, addBudget, deleteBudget, setBudgetLimits, fetchBudgets,
    budgetLimits,
    totalIncome, totalExpenses, balance, totalSaved,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}