import axios from "../api/axios";

const login = async (credentials) => {
  const response = await axios.post("/auth/login", credentials);

  const { accessToken, role } = response.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("role", role);

  return { role }; // ✅ return as object
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
};

const getToken = () => localStorage.getItem("accessToken");
const getRole = () => localStorage.getItem("role");

export default {
  login,
  logout,
  getToken,
  getRole,
};
