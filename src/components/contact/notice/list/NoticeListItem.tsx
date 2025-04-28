"use client";

import Link from "next/link";

interface NoticeListItemProps {
  id: string;
  title: string;
  createdAt: string;
  category?: string;
}

export default function NoticeListItem({
  id,
  title,
  createdAt,
  category,
}: NoticeListItemProps) {
  return (
    <li>
      <Link
        href={`/contact/notice/${id}`}
        className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-800 dark:text-white">
            {title}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {createdAt}
          </span>
        </div>

        {category && (
          <div className="mt-1 flex justify-end">
            <span className="inline-block text-[13px] font-medium px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {category}
            </span>
          </div>
        )}
      </Link>
    </li>
  );
}
