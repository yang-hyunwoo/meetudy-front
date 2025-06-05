"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
interface ConfirmPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (currentPassword: string, newPassword: string) => Promise<void>; // 비동기 확인
}

export default function ConfirmPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (open) {
      setPassword("");
      setNewPassword("");
      setPasswordError("");
    }
  }, [open]);

  const handleChangePassword = async () => {
    try {
      await onConfirm(password, newPassword); // 또는 currentPassword, newPassword
      setPassword("");
      setPasswordError("");
      onOpenChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPasswordError(
          err.response?.data?.message || "비밀번호 변경에 실패했습니다.",
        );
      } else {
        setPasswordError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            🔐 비밀번호 변경
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 px-1">
          <Input
            type="password"
            placeholder="현재 비밀번호를 입력하세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            maxLength={20}
          />
          <Input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError("");
            }}
            maxLength={20}
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>

        <div className="flex justify-end mt-5">
          <Button className="w-full" onClick={handleChangePassword}>
            변경하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
