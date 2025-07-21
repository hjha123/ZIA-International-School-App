import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminHome from "../pages/admin/AdminHome";
import TeacherList from "../pages/admin/teachers/TeacherList";
import TeacherCreate from "../pages/admin/teachers/TeacherCreate";
import TeacherProfile from "../pages/admin/teachers/TeacherProfile";
import TeacherUpdate from "../pages/admin/teachers/TeacherUpdate";

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
        {/* ✅ Default dashboard home */}
        <Route index element={<AdminHome />} />
        {/* ✅ Teacher routes */}
        <Route path="teachers" element={<TeacherList />} />
        <Route path="teachers/create" element={<TeacherCreate />} />
        <Route path="teachers/:empId" element={<TeacherProfile />} />{" "}
        <Route path="teachers/update/:empId" element={<TeacherUpdate />} />
      </Route>
    </Routes>
  );
}
