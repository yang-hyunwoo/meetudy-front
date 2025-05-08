"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function JoinSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="flex flex-col items-center space-y-4">
        <CheckCircle className="text-green-500 w-20 h-20 animate-pulse" />
        <h1 className="text-3xl font-bold">가입 완료!</h1>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
          회원가입이 성공적으로 완료되었습니다.
          <br /> 이제 로그인을 통해 서비스를 이용하실 수 있습니다.
        </p>
        <Link href="/login">
          <Button size="lg" className="mt-2 w-40">
            로그인 하러 가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
