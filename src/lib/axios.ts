import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, //  쿠키 자동 포함 (refreshToken 용)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["authorization"];
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    }
    return response;
  },
  async (error) => {
    if (error.response?.data.errCode === 401) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
