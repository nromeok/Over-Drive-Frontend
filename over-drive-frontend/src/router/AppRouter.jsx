import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import ValuationHistory from "../pages/ValuationHistory";

const router = createBrowserRouter([
  // ── Public routes (no sidebar) ──────────────────────────────────────────
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login",    element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "home",     element: <Home /> },
    ],
  },

  // ── Authenticated routes (with sidebar) ─────────────────────────────────
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "history",   element: <ValuationHistory /> },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">404 — Page Not Found</h1>
          <p className="mt-3 text-gray-600">The page you requested does not exist.</p>
        </div>
      </div>
    ),
  },
]);

export default router;
