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

interface ConfirmPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => void;
}

export default function ConfirmPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = () => {
    console.log("비밀번호 변경22:", currentPassword, newPassword);
    onOpenChange(false);
    setCurrentPassword("");
    setNewPassword("");
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
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
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
