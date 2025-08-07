// src/services/reservationService.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/reservations";

export const getReservations = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getReservationById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const createReservation = async (data) => {
  await axios.post(API_BASE, data);
};

export const updateReservation = async (id, data) => {
  await axios.put(`${API_BASE}/${id}`, data);
};

export const deleteReservation = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};
