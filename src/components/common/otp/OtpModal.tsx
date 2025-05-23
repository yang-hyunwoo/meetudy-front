"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (code: string) => void;
  errorMsg?: string | null;
  setErrorMsg?: (msg: string | null) => void;
  resetTrigger?: number;
}

export default function OtpModal({
  isOpen,
  onClose,
  onSubmit,
  errorMsg,
  setErrorMsg,
  resetTrigger,
}: OtpModalProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);
  useEffect(() => {
    if (resetTrigger !== undefined) {
      inputsRef.current.forEach((input) => {
        if (input) input.value = "";
      });
      inputsRef.current[0]?.focus();
    }
  }, [resetTrigger]);
  useEffect(() => {
    if (isOpen) {
      inputsRef.current[0]?.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const code = inputsRef.current.map((input) => input.value).join("");
    if (onSubmit) onSubmit(code);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
                bg-black/20 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-3">비밀번호를 입력하세요.</h2>
        <div className="flex justify-between mb-3">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) inputsRef.current[i] = el;
              }}
              type="text"
              maxLength={1}
              className="w-10 h-10 text-center border border-gray-300 dark:border-gray-600 rounded"
              onChange={(e) => {
                if (e.target.value && i < 5) {
                  inputsRef.current[i + 1]?.focus();
                }
                if (errorMsg && setErrorMsg) {
                  setErrorMsg(null);
                }
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          스터디 그룹 비밀번호를 입력해주세요.
        </p>
        {errorMsg && <p className="text-sm text-red-500 mb-2">{errorMsg}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit}>입력</Button>
        </div>
      </div>
    </div>
  );
}
