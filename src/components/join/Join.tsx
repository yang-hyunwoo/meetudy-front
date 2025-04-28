"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordInput from "@/components/join/PasswordInput";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [hpNum, setHpNum] = useState("");
  const { resolvedTheme } = useTheme();
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("회원가입:", { name, email, password });
    // 회원가입 로직
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-13 px-4 space-y-6">
      {/* 로고 */}
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
          />
        </Link>
      )}

      {/* 회원가입 카드 */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">회원 가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                required
              />
            </div>
            <div>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                required
              />
            </div>
            <div>
              <Input
                id="birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder="생년월일"
                required
              />
            </div>
            <div>
              <Input
                id="hpnum"
                value={hpNum}
                onChange={(e) => setHpNum(e.target.value)}
                placeholder="휴대폰번호"
                required
              />
            </div>

            {/* 비밀번호 입력 */}
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              placeholder="비밀번호"
            />

            {/* 비밀번호 확인 입력 */}
            <PasswordInput
              id="passwordconfirm"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder="비밀번호 확인"
            />

            {/* ✅ Checkbox 영역 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeEmail"
                checked={agreeEmail}
                onCheckedChange={(checked) => setAgreeEmail(!!checked)}
              />
              <label
                htmlFor="agreeEmail"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                이메일 수신에 동의합니다.
              </label>
            </div>

            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
