"use client";

import { Suspense } from "react";
import LoginForm from "@/components/login/Login";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <Suspense fallback={<div>로딩 중...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
