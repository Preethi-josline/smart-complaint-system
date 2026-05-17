import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-complaint-system-backend-vyet.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");

export const createComplaint = (data) => API.post("/complaints", data);
export const getMyComplaints = () => API.get("/complaints/my-complaints");
export const getComplaintById = (id) => API.get(`/complaints/${id}`);
export const getAllComplaints = () => API.get("/complaints/all");
export const assignComplaint = (id, data) => API.put(`/complaints/assign/${id}`, data);
export const changePriority = (id, data) => API.put(`/complaints/priority/${id}`, data);
export const updateStatus = (id, data) => API.put(`/complaints/status/${id}`, data);
export const getNotifications = () => API.get("/notifications");
export const getUnreadCount = () => API.get("/notifications/unread-count");
export const markAllRead = () => API.put("/notifications/mark-read");