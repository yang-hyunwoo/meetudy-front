"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({
  searchInput,
  setSearchInput,
  onSearch,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <Input
        placeholder="찾고자 하는 내용을 입력하세요."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
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
                  bg-gray-800 hover:bg-gray-900 dark:bg-violet-500 dark:hover:bg-violet-600 
                  text-white text-sm px-3 py-1 rounded-md transition"
      >
        검색
      </button>
    </div>
  );
}
