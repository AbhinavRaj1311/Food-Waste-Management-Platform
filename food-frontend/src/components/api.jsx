import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Backend URL
  withCredentials: true, // Enable cookies
});

export default api;
