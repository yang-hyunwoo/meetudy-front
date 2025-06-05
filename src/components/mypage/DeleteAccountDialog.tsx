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

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (currentPassword: string) => Promise<void>;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAccountDialogProps) {
  const [deletePassword, setDeletePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (open) {
      setPasswordError("");
    }
  }, [open]);

  const handleDeleteAccount = async () => {
    try {
      await onConfirm(deletePassword);
      setDeletePassword("");
      onOpenChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPasswordError(
          err.response?.data?.message || "비밀번호가 올바르지 않습니다.",
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
          <DialogTitle className="text-center text-xl font-bold text-red-600">
            ⚠️ 회원 탈퇴 확인
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 px-1">
          <Input
            type="password"
            placeholder="비밀번호 입력"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>
        <div className="flex justify-end mt-5">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteAccount}
          >
            탈퇴하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
