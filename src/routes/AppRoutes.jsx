import React, { Suspense, lazy, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const AdminDashboard = lazy(() => import("../features/admin/AdminDashboard"));
const HRDashboard = lazy(() => import("../features/hr/HRDashboard"));
const EmployeeProfile = lazy(() =>
  import("../features/employee/EmployeeProfile")
);
const Login = lazy(() => import("../components/Login"));
const LeavePage = lazy(() => import("../features/leave/LeavePage"));

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <Router>
      <Navbar user={user} onLogout={logout} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr"
            element={
              <ProtectedRoute roles={["hr"]}>
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute roles={["employee"]}>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <ProtectedRoute roles={["admin", "hr", "employee"]}>
                <LeavePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={user ? `/${user.role}` : "/login"} />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
