import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Splash from "../pages/Splash";
import ValuationHistory from "../pages/ValuationHistory";
import NotFound from "../pages/NotFound";
import OAuthCallback from "../pages/OAuthCallback";
import NewValuation from "../pages/NewValuation";
import ValuationResult from "../pages/ValuationResult";
import Profile from "../pages/Profile";
import ImageUpload from "../pages/ImageUpload";
import Settings from "../pages/Settings";

const router = createBrowserRouter([
  // ── Public routes (no sidebar) ──────────────────────────────────────────
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true,           element: <Splash /> },
      { path: "login",         element: <Login /> },
      { path: "register",      element: <Register /> },
      { path: "home",          element: <Home /> },
      { path: "auth/callback", element: <OAuthCallback /> },
    ],
  },

  // ── Authenticated routes (with sidebar) ─────────────────────────────────
  // Each route is explicit so React Router never confuses them with public routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ValuationHistory /> },
    ],
  },
  {
    path: "/valuate",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <NewValuation /> },
    ],
  },
  {
    path: "/valuation/:id",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ValuationResult /> },
    ],
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Profile /> },
    ],
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ImageUpload /> },
    ],
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Settings /> },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: "*", element: <NotFound /> },
]);

export default router;
