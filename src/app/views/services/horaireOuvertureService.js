import axios from "axios";

const API_URL = "http://localhost:3000/api/horaire-ouverture";

const config = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
});

export const horaireOuvertureService = {
  getAll: () => axios.get(API_URL, config()),
  getById: (id) => axios.get(`${API_URL}/${id}`, config()),
  create: (data) => axios.post(API_URL, data, config()),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data, config()),
  delete: (id) => axios.delete(`${API_URL}/${id}`, config()),
};
