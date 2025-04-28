"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  createdAt: string;
  views: number;
}

const PAGE_SIZE = 5; // 한 페이지에 5개씩

export default function PostsTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    // 가짜 데이터
    const dummyPosts = Array.from({ length: 23 }, (_, idx) => ({
      id: String(idx + 1),
      title: `테스트 글 ${idx + 1}`,
      createdAt: "2025.04.28",
      views: Math.floor(Math.random() * 1000),
    }));

    setPosts(dummyPosts);
  }, []);

  const handleClick = (id: string) => {
    router.push(`/posts/${id}`);
  };

  const paginatedPosts = posts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      {/* 포스트 리스트 */}
      <div className="space-y-4">
        {paginatedPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => handleClick(post.id)}
            className="p-4 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <h3 className="text-lg font-semibold text-black dark:text-white">
              {post.title}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {post.createdAt} · 조회수 {post.views}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          이전
        </button>
        <span className="text-sm text-black dark:text-white">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
