import axios from "axios";

const API_URL = "http://localhost:3000/auth";

const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

const logout = async () => {
  // selon ta logique, nettoyage localStorage, etc.
};

const refreshToken = async (token) => {
  const res = await axios.post(`${API_URL}/refresh-token`, { token });
  return res.data;
};

export { login, logout, refreshToken };
