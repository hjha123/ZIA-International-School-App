import axios from "../api/axios";

const getAllGrades = async () => {
  const response = await axios.get("/grades");
  return response.data;
};

const getSectionsByGrade = async (gradeId) => {
  const response = await axios.get(`/sections/grade/${gradeId}`);
  return response.data;
};

const onboardStudent = async (data) => {
  const response = await axios.post("/students", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export default {
  getAllGrades,
  getSectionsByGrade,
  onboardStudent,
};
