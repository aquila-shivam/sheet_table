import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:5000||https://revoeai-backend-dbt5.onrender.com",
  withCredentials: true, // ✅ Important for CORS with cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
