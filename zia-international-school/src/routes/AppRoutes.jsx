import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";

import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminHome from "../pages/admin/AdminHome";

import ManageTeachers from "../pages/admin/teachers/ManageTeachers";
import TeacherCreate from "../pages/admin/teachers/TeacherCreate";
import TeacherProfile from "../pages/admin/teachers/TeacherProfile";
import TeacherUpdate from "../pages/admin/teachers/TeacherUpdate";
import TeacherSelectList from "../pages/admin/teachers/TeacherSelectList";
import TeacherProfileList from "../pages/admin/teachers/TeacherProfileList";
import TeacherOffboardList from "../pages/admin/teachers/TeacherOffboardList";

import LeaveRequestList from "../pages/admin/leaves/LeaveRequestList";
import LeaveAllocation from "../pages/admin/leaves/LeaveAllocation";
import LeaveTypesManagement from "../pages/admin/leaves/LeaveTypesManagement";
import EmployeeLeaveHistory from "../pages/admin/leaves/EmployeeLeaveHistory";

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
        <Route path="teachers" element={<ManageTeachers />} />
        <Route path="teachers/create" element={<TeacherCreate />} />
        <Route path="teachers/:empId" element={<TeacherProfile />} />
        <Route path="teachers/update/:empId" element={<TeacherUpdate />} />
        <Route path="teachers/select" element={<TeacherSelectList />} />
        <Route path="teachers/list" element={<TeacherProfileList />} />
        <Route
          path="teachers/offboard"
          element={<TeacherOffboardList />}
        />{" "}
        {/* 🆕 */}
        {/* ✅ Leave management routes */}
        <Route path="leaves" element={<LeaveRequestList />} />
        <Route path="leaves/leave-allocation" element={<LeaveAllocation />} />
        <Route path="leaves/types" element={<LeaveTypesManagement />} />
        <Route path="leaves/history" element={<EmployeeLeaveHistory />} />
      </Route>
    </Routes>
  );
}
