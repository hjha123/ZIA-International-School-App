import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import TeacherList from "../pages/admin/teachers/TeacherList";
import AdminHome from "../pages/admin/AdminHome"; // ✅ import

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ✅ Admin Dashboard Layout */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* ✅ Index route shows on /admin/dashboard */}
        <Route index element={<AdminHome />} />

        {/* Existing nested routes */}
        <Route path="teachers" element={<TeacherList />} />

        {/* Uncomment and add these when available */}
        {/* <Route path="students" element={<StudentList />} /> */}
        {/* <Route path="classes" element={<ClassList />} /> */}
      </Route>
    </Routes>
  );
}
