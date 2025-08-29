import axios from "../api/axios";

const getAllGrades = async () => {
  const response = await axios.get(`/grades`);
  return response.data;
};

const getGradeById = async (id) => {
  const response = await axios.get(`/grades/${id}`);
  return response.data;
};

const createGrade = async (gradeRequest) => {
  // gradeRequest = { name: "Grade 1" }
  const response = await axios.post(`/grades`, gradeRequest);
  return response.data;
};

const deleteGrade = async (gradeName) => {
  const response = await axios.delete(`/grades/${gradeName}`);
  return response.data;
};

const getAllGradesWithSections = async () => {
  const response = await axios.get(`/grades/with-sections`);
  return response.data;
};

// ===================== SECTION APIS =====================
const getSectionsByGradeId = async (gradeId) => {
  const response = await axios.get(`/sections/grade/${gradeId}`);
  return response.data;
};

const getSimpleSectionsByGradeName = async (gradeName) => {
  const response = await axios.get(`/sections/grade/${gradeName}/simple`);
  return response.data;
};

const createSection = async (sectionRequest) => {
  // sectionRequest = { name: "A", gradeName: "Grade 1" }
  const response = await axios.post(`/sections/createSection`, sectionRequest);
  return response.data;
};

const deleteSection = async (gradeName, sectionName) => {
  const response = await axios.delete(`/sections`, {
    params: { gradeName, sectionName },
  });
  return response.data;
};

const getSectionsByGrade = async (gradeId) => {
  const response = await axios.get(`/sections/grade/${gradeId}`);
  return response.data;
};

const getGradeStats = async (gradeId) => {
  const response = await axios.get(`/grades/${gradeId}/stats`);
  return response.data;
};

export default {
  // Grades
  getAllGrades,
  getGradeById,
  createGrade,
  deleteGrade,
  getAllGradesWithSections,
  getGradeStats,

  // Sections
  getSectionsByGradeId,
  getSimpleSectionsByGradeName,
  createSection,
  deleteSection,
  getSectionsByGrade,
};
