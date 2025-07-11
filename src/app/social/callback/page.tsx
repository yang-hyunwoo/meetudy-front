"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SocialCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("accessToken");

    if (token) {
      localStorage.setItem("accessToken", token); // 임시 저장
      document.cookie = `accessToken=${token}; path=/;`;
    }

    // 0.5초 후 리디렉트
    const timeout = setTimeout(() => {
      // router.replace("/");
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>로그인 처리 중입니다...</p>
    </div>
  );
}
