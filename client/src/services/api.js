import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.6:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const createUrl = async (originalUrl) => {
  const response = await api.post("/shorten", { originalUrl });
  return response.data;
};

export const getUrls = async () => {
  const response = await api.get("/");
  return Array.isArray(response.data) ? response.data : response.data?.urls ?? [];
};

export const deleteUrl = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export default api;