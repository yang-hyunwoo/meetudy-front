import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ 쿠키 자동 포함 (중요)
});

// 👉 Request interceptor 필요 없음

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
