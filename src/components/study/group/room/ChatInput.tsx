"use client";

import { Button } from "@/components/ui/button";

export default function ChatInput() {
  return (
    <div className="flex items-center gap-2 p-3 border-t bg-white dark:bg-zinc-900">
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        className="flex-1 px-3 py-2 text-sm rounded border dark:bg-zinc-800 dark:text-white"
      />
      <Button size="sm">전송</Button>
    </div>
  );
}
