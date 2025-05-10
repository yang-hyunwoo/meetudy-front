"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, List } from "lucide-react";

interface NoticeNavigationProps {
  prevId?: string;
  nextId?: string;
}

export default function NoticeNavigation({
  prevId,
  nextId,
}: NoticeNavigationProps) {
  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="grid grid-cols-3 gap-4">
        {/* 이전 글 */}
        <div className="flex justify-start">
          {prevId && (
            <Link
              href={`/contact/notice/${prevId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
                        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                        text-sm text-gray-700 dark:text-gray-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              이전 글
            </Link>
          )}
        </div>

        {/* 목록으로 */}
        <div className="flex justify-center">
          <Link
            href="/contact/notice/list"
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
                      bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                      text-sm text-gray-700 dark:text-gray-200 transition"
          >
            <List className="w-4 h-4" />
            목록으로
          </Link>
        </div>

        {/* 다음 글 */}
        <div className="flex justify-end">
          {nextId && (
            <Link
              href={`/contact/notice/${nextId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
                        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                        text-sm text-gray-700 dark:text-gray-200 transition"
            >
              다음 글
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
