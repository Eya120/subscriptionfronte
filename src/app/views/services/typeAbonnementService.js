import axios from "axios";

const API_URL = "http://localhost:3000/api/parametrage/type-abonnement/";

const getAll = async () => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data;
};

const create = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data;
};

const update = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data;
};

const remove = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data;
};

export const typeAbonnementService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
