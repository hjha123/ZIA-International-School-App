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

const getMyProfile = async () => {
  const res = await axios.get(`/students/me`);
  return res.data;
};

const getSubjects = async () => {
  const res = await axios.get(`/subjects`);
  return res.data;
};

const getStudentsByGradeSection = async (gradeName, sectionName) => {
  const params = new URLSearchParams();
  if (gradeName) params.append("gradeName", gradeName);
  if (sectionName) params.append("sectionName", sectionName);

  const res = await axios.get(
    `/students/by-grade-section?${params.toString()}`,
    {
      withCredentials: true, // needed for session auth
    }
  );
  return res.data;
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
  getMyProfile,
  getSubjects,
  getStudentsByGradeSection,
};
