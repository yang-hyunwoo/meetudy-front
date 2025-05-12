"use client";

import clsx from "clsx";

interface FaqCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function FaqCategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
}: FaqCategoryFilterProps) {
  return (
    <div className="flex justify-center flex-wrap gap-2 mb-6 mt-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategorySelect(cat)}
          className={clsx(
            "px-4 py-1 rounded-full text-sm border font-medium transition",
            cat === selectedCategory
              ? "bg-gray-800 text-white dark:bg-violet-600 dark:text-white border-transparent"
              : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
