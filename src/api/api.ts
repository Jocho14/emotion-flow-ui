import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://emotion-flow-api.vercel.app/api",
  timeout: 90000000,
  headers: {
    "Content-Type": "application/json",
  },
});
