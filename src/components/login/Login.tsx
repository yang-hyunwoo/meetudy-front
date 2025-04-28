"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with", { email, password });
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
          <Button type="submit" className="w-full mt-2">
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
}
