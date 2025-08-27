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

// 🆕 Teacher Dashboard Layout & Pages
import TeacherDashboardLayout from "../layouts/TeacherDashboardLayout";
import TeacherHome from "../pages/teacher/TeacherHome";
import TeacherUpdateSelf from "../pages/teacher/TeacherUpdateSelf";
import AssignmentListPage from "../pages/teacher/assignments/AssignmentListPage";
import AssignmentCreatePage from "../pages/teacher/assignments/AssignmentCreatePage";
import AssignmentStudentStatusPage from "../pages/teacher/assignments/AssignmentStudentStatus";
import ApplyLeave from "../pages/teacher/leaves/ApplyLeave";
import LeaveRequests from "../pages/teacher/leaves/LeaveRequests";
import LeaveEntitlements from "../pages/teacher/leaves/LeaveEntitlements";
import StudentCreate from "../pages/admin/students/StudentCreate";
import ManageStudents from "../pages/admin/students/ManageStudents";
import StudentProfile from "../pages/admin/students/StudentProfile";
import StudentUpdate from "../pages/admin/students/StudentUpdate";
import StudentUpdateList from "../pages/admin/students/StudentUpdateList";
import StudentOffboardList from "../pages/admin/students/StudentOffboardList";

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
        {/* ✅ Students routes */}
        <Route path="students/create" element={<StudentCreate />} />
        <Route path="students" element={<ManageStudents />} />
        <Route
          path="/admin/dashboard/students/view/:studentId"
          element={<StudentProfile />}
        />
        <Route path="students/update/:studentId" element={<StudentUpdate />} />
        <Route path="students/update" element={<StudentUpdateList />} />
        <Route path="students/offboard" element={<StudentOffboardList />} />
        {/* ✅ Leave management routes */}
        <Route path="leaves" element={<LeaveRequestList />} />
        <Route path="leaves/leave-allocation" element={<LeaveAllocation />} />
        <Route path="leaves/types" element={<LeaveTypesManagement />} />
        <Route path="leaves/history" element={<EmployeeLeaveHistory />} />
      </Route>

      {/* ✅ Teacher Dashboard Layout */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherHome />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="profile/edit" element={<TeacherUpdateSelf />} />
        {/* 🆕 Teacher Leaves */}
        <Route path="leaves/apply" element={<ApplyLeave />} />
        <Route path="leaves/requests" element={<LeaveRequests />} />
        <Route path="leaves/entitlements" element={<LeaveEntitlements />} />
        {/* 🆕 Teacher Assignments */}
        <Route path="assignments" element={<AssignmentListPage />} />
        <Route path="assignments/create" element={<AssignmentCreatePage />} />
        <Route
          path="assignments/edit/:assignmentId"
          element={<AssignmentCreatePage />}
        />
        <Route
          path="assignments/:assignmentId/students"
          element={<AssignmentStudentStatusPage />}
        />
      </Route>
    </Routes>
  );
}
