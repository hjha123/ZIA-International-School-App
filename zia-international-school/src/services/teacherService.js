import axios from "../api/axios";

const getAllTeachers = async () => {
  const response = await axios.get("/teachers");
  return response.data;
};

const createTeacher = async (data) => {
  const response = await axios.post("/teachers", data);
  return response.data;
};

const getAllSubjects = async () => {
  const response = await axios.get("/subjects");
  return response.data;
};

const getAllGrades = async () => {
  const response = await axios.get("/grades");
  return response.data;
};

const getSectionsByGrade = async (gradeId) => {
  const response = await axios.get(`/sections/grade/${gradeId}`);
  return response.data;
};

const deleteTeacherByEmpId = async (empId) => {
  const response = await axios.delete(`/teachers/emp/${empId}`);
  return response.data;
};

const getTeacherByEmpId = async (empId) => {
  const response = await axios.get(`/teachers/emp/${empId}`);
  return response.data;
};

const updateTeacherByEmpId = (empId, updateRequest) =>
  axios.put(`teachers/emp/${empId}`, updateRequest).then((res) => res.data);

export default {
  getAllTeachers,
  createTeacher,
  getAllSubjects,
  getAllGrades,
  getSectionsByGrade,
  deleteTeacherByEmpId,
  getTeacherByEmpId,
  updateTeacherByEmpId,
};
