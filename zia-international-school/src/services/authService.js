import axios from "../api/axios";

const login = async (credentials) => {
  const response = await axios.post("/auth/login", credentials);

  const { accessToken, role, username } = response.data;

  // ✅ Store all relevant info
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("role", role);
  localStorage.setItem("username", username);

  return { role };
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
};

export const sendResetLink = async (email) => {
  const response = await axios.post("/auth/forgot-password", null, {
    params: { email },
  });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};

const getToken = () => localStorage.getItem("accessToken");
const getRole = () => localStorage.getItem("role");
const getUsername = () => localStorage.getItem("username");

export default {
  login,
  logout,
  getToken,
  getRole,
  getUsername,
  sendResetLink,
  resetPassword,
};
