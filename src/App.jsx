/**
 * App.jsx
 * Root component: defines routing and protects authenticated routes.
 */
import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ExpenseTrackerPage from "./pages/ExpenseTrackerPage";
import ReportsPage from "./pages/ReportsPage";

// Guard: redirect to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
