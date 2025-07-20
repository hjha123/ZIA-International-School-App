import axios from "../api/axios";

const getAllTeachers = async () => {
  const response = await axios.get("/teachers");
  return response.data;
};

const createTeacher = async (data) => {
  const response = await axios.post("/teachers", data);
  return response.data;
};

export default {
  getAllTeachers,
  createTeacher,
};
