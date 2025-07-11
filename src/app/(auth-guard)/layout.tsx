"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      const currentPath = window.location.pathname;
      router.replace(`/login?redirectTo=${currentPath}`);
      return;
    }
    api
      .get("/user/me")
      .then(() => {
        setIsLoading(false); // 검증 성공
      })
      .catch(() => {
        const currentPath = window.location.pathname;
        router.replace(`/login?redirectTo=${currentPath}`);
      });
  }, [router]);

  if (isLoading) {
    return null; // 인증 확인 중에는 아무것도 보여주지 않음
  }

  return <>{children}</>;
}
