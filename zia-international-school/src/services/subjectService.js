import axios from "../api/axios";

const getAllSubjects = async () => {
  const response = await axios.get("/subjects");
  return response.data;
};

const getSubjectById = async (id) => {
  const response = await axios.get(`/subjects/${id}`);
  return response.data;
};

const createSubject = async (subjectRequest) => {
  // subjectRequest = { name: "Math" }
  const response = await axios.post("/subjects", subjectRequest);
  return response.data;
};

const updateSubject = async (id, subjectRequest) => {
  const response = await axios.put(`/subjects/${id}`, subjectRequest);
  return response.data;
};

const deleteSubject = async (id) => {
  const response = await axios.delete(`/subjects/${id}`);
  return response.data;
};

export default {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
