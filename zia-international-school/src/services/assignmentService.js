import axios from "../api/axios";

// TEACHER API
const createAssignmentAsTeacher = async (formData) => {
  const res = await axios.post(`/assignments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ADMIN API
const createAssignmentAsAdmin = async (formData) => {
  const res = await axios.post(`/assignments/admin`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update Assignment
const updateAssignment = async (assignmentId, formData) => {
  const response = await axios.put(`/assignments/${assignmentId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data;
};

// Get Assignment by ID (for edit mode)
const getAssignmentById = async (assignmentId) => {
  const response = await axios.get(`/assignments/${assignmentId}`, {
    withCredentials: true,
  });
  return response.data;
};

// Get all assignments (Admin or Teacher filtered automatically by backend role)
const getAllAssignments = async () => {
  const response = await axios.get("/assignments", { withCredentials: true });
  return response.data;
};

// Delete assignment
const deleteAssignment = async (assignmentId) => {
  const response = await axios.delete(`/assignments/${assignmentId}`, {
    withCredentials: true,
  });
  return response.data;
};

// Get assignments for Student (filtered by grade & section)
const getAssignmentsForStudent = async () => {
  const response = await axios.get("/assignments/student/me", {
    withCredentials: true,
  });
  return response.data;
};

// Mark student submission (student uploads their work)
const submitAssignment = async (assignmentId, formData) => {
  const response = await axios.post(
    `/assignments/${assignmentId}/submit`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// Update assignment status (teacher marks student as completed/not completed)
const updateSubmissionStatus = async (assignmentId, studentId, status) => {
  const response = await axios.put(
    `/assignments/${assignmentId}/submissions/${studentId}`,
    { status },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};

const getMyAssignments = async () => {
  const response = await axios.get(`/assignments/teacher`);
  return response.data;
};

const getAllAssignmentsAdmin = async () => {
  const response = await axios.get(`/assignments/admin/all`);
  return response.data;
};

// Update admin remarks for assignment
const updateAdminRemarks = async (assignmentId, adminRemarks) => {
  const response = await axios.patch(
    `/assignments/${assignmentId}/admin-remarks`,
    { adminRemarks },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};

export default {
  createAssignmentAsTeacher,
  createAssignmentAsAdmin,
  updateAssignment,
  getAssignmentById,
  getAllAssignments,
  deleteAssignment,
  getAssignmentsForStudent,
  submitAssignment,
  updateSubmissionStatus,
  getMyAssignments,
  getAllAssignmentsAdmin,
  updateAdminRemarks,
};
