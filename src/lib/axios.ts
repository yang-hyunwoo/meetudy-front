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
    // ✅ 요청 URL 확인
    const requestUrl = error.config?.url ?? "";

    // ✅ /user/me 요청이면 return 그대로 (에러 넘기기만)
    if (requestUrl.includes("/user/me")) {
      return Promise.reject(error);
    }

    // ✅ 그 외 요청은 redirect
    if (error.response?.data?.errCode === "ERR_004") {
      alert("로그인 정보가 없습니다\n로그인 페이지로 이동합니다.");
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirectTo=${currentPath}`;
    }

    return Promise.reject(error);
  },
);
