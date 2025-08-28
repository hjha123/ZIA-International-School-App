// src/services/assignmentService.js
import axios from "../api/axios";

// Create Assignment
const createAssignment = async (formData) => {
  const response = await axios.post("/assignments", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data;
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

export default {
  createAssignment,
  updateAssignment,
  getAssignmentById,
  getAllAssignments,
  deleteAssignment,
  getAssignmentsForStudent,
  submitAssignment,
  updateSubmissionStatus,
  getMyAssignments,
};
