import axios from "../api/axios";

// ✅ Get all leave requests
const getAllLeaveRequests = async () => {
  const response = await axios.get("/leaves/requests");
  return response.data;
};

// ✅ Get all pending leave requests
const getAllPendingLeaveRequests = async () => {
  const response = await axios.get("/leaves/pending");
  return response.data;
};

// ✅ Approve or reject a leave request
const updateLeaveStatus = async (leaveId, status, adminRemarks) => {
  const response = await axios.put(`/leaves/requests/${leaveId}`, {
    status,
    adminRemarks,
  });
  return response.data;
};

// ✅ Allocate leaves to teachers
const allocateLeaves = async (data) => {
  const response = await axios.post("allocate/leaves", data);
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

// ✅ Employee apply leave
const applyLeave = async (request) => {
  const response = await axios.post(`/leaves/apply`, request);
  return response.data;
};

// ✅ Get leave requests for the logged in teacher
const myLeaveRequests = async () => {
  const response = await axios.get(`/leaves/my-leave-requests`);
  return response.data;
};

// ✅ Get my leave entitlements for the logged in teacher
const myLeaveEntitlements = async () => {
  const response = await axios.get(`/leaves/my-entitlements`);
  return response.data;
};

export default {
  getAllLeaveRequests,
  updateLeaveStatus,
  allocateLeaves,
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  getLeaveBalanceByEmpId,
  getLeaveHistoryByEmpId,
  getAllPendingLeaveRequests,
  applyLeave,
  myLeaveRequests,
  myLeaveEntitlements,
};
