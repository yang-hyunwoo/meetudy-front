"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

export default function WithdrawSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="flex flex-col items-center space-y-4">
        <UserX className="text-red-500 w-20 h-20 animate-pulse" />
        <h1 className="text-3xl font-bold">탈퇴 완료</h1>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
          회원탈퇴가 정상적으로 되었습니다.
          <br /> 그 동안 이용해주셔서 감사합니다.
        </p>
        <Link href="/">
          <Button size="lg" className="mt-2 w-40">
            메인
          </Button>
        </Link>
      </div>
    </div>
  );
}
