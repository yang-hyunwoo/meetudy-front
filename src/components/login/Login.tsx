"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";
import { api } from "@/lib/axios";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    localStorage.removeItem("accessToken");
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!email.trim()) {
      setErrorMessage("이메일은 공백일 수 없습니다.");
      return;
    } else if (!password.trim()) {
      setErrorMessage("비밀번호는 공백일 수 없습니다.");
      return;
    }

    setIsLoading(true); // 로딩 시작
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("accessToken", res.headers["authorization"]);
      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "로그인에 실패했습니다.";
        setErrorMessage(message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 sm:p-10 bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-xl space-y-8 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-center">
          {mounted && (
            <Link href="/">
              <Image
                src={
                  resolvedTheme === "dark"
                    ? "/logo/meetudy-dark.png"
                    : "/logo/meetudy-light.png"
                }
                alt="Meetudy Logo"
                width={160}
                height={20}
                priority
              />
            </Link>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">로그인</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            아래에 이메일을 입력하여 계정을 만드세요.
          </p>
          <Link
            href="/join"
            className="text-sm text-blue-500 hover:underline inline-block mt-1"
          >
            아직 회원이 아니신가요? 회원가입 →
          </Link>
        </div>

        <SocialLoginButtons />

        <div className="flex items-center justify-center">
          <span className="border-t border-gray-300 dark:border-gray-700 flex-1" />
          <span className="px-4 text-xs text-gray-400">OR CONTINUE WITH</span>
          <span className="border-t border-gray-300 dark:border-gray-700 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <div className="text-sm text-red-500 text-center -mt-2">
              {errorMessage}
            </div>
          )}
          <Button
            onClick={handleSubmit}
            className="w-full mt-2 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </div>
    </div>
  );
}
