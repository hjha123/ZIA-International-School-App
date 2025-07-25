import axios from "../api/axios";

// ✅ Get all leave requests
const getAllLeaveRequests = async () => {
  const response = await axios.get("/leaves/requests");
  return response.data;
};

// ✅ Approve or reject a leave request
const updateLeaveStatus = async (leaveId, status) => {
  const response = await axios.patch(`/leaves/requests/${leaveId}`, {
    status,
  });
  return response.data;
};

// ✅ Bulk allocate leaves to teachers
const bulkAllocateLeaves = async (data) => {
  const response = await axios.post("/leaves/bulk-allocate", data);
  return response.data;
};

// ✅ Get all leave types
const getAllLeaveTypes = async () => {
  const response = await axios.get("/leaves/types");
  return response.data;
};

// ✅ Add new leave type
const createLeaveType = async (data) => {
  const response = await axios.post("/leaves/types", data);
  return response.data;
};

// ✅ Update leave type
const updateLeaveType = async (id, data) => {
  const response = await axios.put(`/leaves/types/${id}`, data);
  return response.data;
};

// ✅ Delete leave type
const deleteLeaveType = async (id) => {
  const response = await axios.delete(`/leaves/types/${id}`);
  return response.data;
};

// ✅ Get leave balance for a specific employee
const getLeaveBalanceByEmpId = async (empId) => {
  const response = await axios.get(`/leaves/balance/${empId}`);
  return response.data;
};

// ✅ Get leave history for a specific employee
const getLeaveHistoryByEmpId = async (empId) => {
  const response = await axios.get(`/leaves/history/${empId}`);
  return response.data;
};

export default {
  getAllLeaveRequests,
  updateLeaveStatus,
  bulkAllocateLeaves,
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  getLeaveBalanceByEmpId,
  getLeaveHistoryByEmpId,
};
