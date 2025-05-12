"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      //  토큰 아예 없으면 바로 로그인으로
      const currentPath = window.location.pathname;
      router.replace(`/login?redirectTo=${currentPath}`);
      return;
    }

    //  토큰 있으면 서버에서 검증
    api
      .get("/user/me")
      .then(() => {
        // 검증 성공 → 아무것도 안 함 (통과)
      })
      .catch(() => {
        // 검증 실패 → 로그인 페이지로 이동
        const currentPath = window.location.pathname;
        router.replace(`/login?redirectTo=${currentPath}`);
      });
  }, [router]);

  return <>{children}</>;
}
