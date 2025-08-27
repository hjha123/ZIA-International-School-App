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

const getAllStudents = async () => {
  const response = await axios.get("/students");
  return response.data;
};

const getStudentById = async (studentId) => {
  const response = await axios.get(`/students/${studentId}`);
  return response.data;
};

const uploadProfileImage = async (studentId, formData) => {
  const response = await axios.put(
    `/students/${studentId}/upload-profile-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // important for cookies/session auth
    }
  );
  return response.data;
};

const updateStudent = (studentId, updateRequest) =>
  axios.put(`students/${studentId}`, updateRequest).then((res) => res.data);

const deleteStudent = async (studentId) => {
  const response = await axios.delete(`/students/${studentId}`);
  return response.data;
};

export default {
  getAllGrades,
  getSectionsByGrade,
  onboardStudent,
  getAllStudents,
  getStudentById,
  uploadProfileImage,
  updateStudent,
  deleteStudent,
};
