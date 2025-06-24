"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface GroupSearchBarProps {
  searchInput: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
  onEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function GroupSearchBar({
  searchInput,
  onInputChange,
  onSearch,
  onEnter,
}: GroupSearchBarProps) {
  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <Input
        placeholder="스터디 그룹 이름을 검색해보세요..."
        value={searchInput}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onEnter}
        className="pl-10 pr-12 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
        focus:ring-2 focus:ring-violet-500 focus:outline-none transition 
        bg-white text-black dark:bg-gray-900 dark:text-white"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        <Search className="w-5 h-5" />
      </div>
      <button
        onClick={onSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 
          bg-blue-600 hover:bg-blue-700 dark:bg-violet-500 dark:hover:bg-violet-600 
          text-white text-sm px-3 py-1 rounded-md transition"
      >
        검색
      </button>
    </div>
  );
}
