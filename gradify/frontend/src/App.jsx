import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>
      <Route path="/login" element={<Login />} />

      {/* Authenticated pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
