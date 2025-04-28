"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [deletePassword, setDeletePassword] = useState("");

  const handleDeleteAccount = () => {
    console.log("회원 탈퇴 비밀번호:", deletePassword);
    onOpenChange(false);
    setDeletePassword("");
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
