"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-white dark:bg-zinc-900">
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 px-3 py-2 text-sm rounded border dark:bg-zinc-800 dark:text-white"
      />
      <Button size="sm" onClick={handleSend}>
        전송
      </Button>
    </div>
  );
}
