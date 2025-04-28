"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  nickname: string;
}

interface DMModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  message: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
}

export default function DMModal({
  open,
  onOpenChange,
  selectedUser,
  message,
  onMessageChange,
  onSend,
}: DMModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            쪽지 보내기
          </DialogTitle>
        </DialogHeader>

        {selectedUser && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            받는 사람:{" "}
            <span className="font-semibold">{selectedUser.nickname}</span> (
            {selectedUser.name})
          </div>
        )}

        <Textarea
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="h-28 resize-none rounded-lg bg-muted dark:bg-zinc-800 focus:ring-2 focus:ring-primary transition"
        />

        <Button className="w-full mt-4" onClick={onSend}>
          전송
        </Button>
      </DialogContent>
    </Dialog>
  );
}
