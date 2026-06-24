import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/useApp";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ExpenseTrackerPage from "./pages/ExpenseTrackerPage";
import ReportsPage from "./pages/ReportsPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💰</div>
          <div>Loading BudgetPro...</div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { loading, supabaseError } = useApp();

  if (supabaseError) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f0f1a',
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem', color: '#f43f5e' }}>Configuration Required</h1>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            {supabaseError}
          </p>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '1.5rem', lineHeight: 1.5 }}>
            Create a <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: 4 }}>.env</code> file in the project root with your Supabase project credentials.
            See <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: 4 }}>.env.example</code> for the required variables.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💰</div>
          <div>Loading BudgetPro...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="expenses" element={<ExpenseTrackerPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}