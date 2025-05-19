"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CommentFormProps {
  value: string;
  isLoading: boolean;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export default function CommentForm({
  value,
  isLoading,
  onChange,
  onSubmit,
}: CommentFormProps) {
  return (
    <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <Textarea
          placeholder="댓글을 남겨보세요"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 resize-none bg-white dark:bg-gray-900 text-sm border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500"
          rows={3}
        />
        <Button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="self-end sm:self-auto h-10 px-4 text-sm font-medium 
                    border border-gray-300 dark:border-gray-600 
                    bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 
                    text-gray-800 dark:text-gray-200 rounded-md transition"
        >
          {isLoading ? "등록 중..." : "등록"}
        </Button>
      </div>
    </div>
  );
}
