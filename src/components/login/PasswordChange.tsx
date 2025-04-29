"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForcePasswordChangePage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(password);
    return hasMinLength && hasSpecialChar;
  };

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("비밀번호는 8자 이상이어야 하며 특수문자를 포함해야 합니다.");
      return;
    }

    try {
      setLoading(true);
      // TODO: 비밀번호 변경 API 호출
      // 예시: await api.patch('/auth/password', { newPassword });

      alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
      router.push("/login");
    } catch (e) {
      setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // TODO: 사용자 상태 저장 후 홈으로 이동
    router.push("/");
  };

  useEffect(() => {
    // 이 페이지에 접근할 수 있는 사람은
    // 3개월 초과자만이므로 별도 체크는 필요 없습니다.
  }, []);

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">
        비밀번호 변경 필요
      </h1>
      <p className="text-center text-sm mb-6 text-gray-600 dark:text-gray-400">
        마지막 비밀번호 변경일로부터 3개월이 지났습니다. 보안을 위해 비밀번호를
        변경해주세요.
      </p>

      <div className="space-y-4">
        <Input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            다음에 변경하기
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </div>
      </div>
    </div>
  );
}
