"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import dayjs from "dayjs";
interface Post {
  id: string;
  title: string;
  createdAt: string;
}

const PAGE_SIZE = 5; // 한 페이지에 5개씩

export default function PostsTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  useEffect(() => {
    boardList();
  }, [currentPage]);

  const boardList = async () => {
    try {
      const params: any = {
        page: currentPage - 1,
        size: PAGE_SIZE,
      };

      const res = await api.get("/private/mypage/board/list", { params });

      if (res.data.httpCode === 200) {
        setTotalPages(res.data.data.totalPages);
        const data = res.data.data;
        const formattedData = data.content.map((item: any) => ({
          ...item,
          createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
        }));
        setPosts(formattedData);
      }
    } catch (error) {
      console.error("공지사항 로딩 실패", error);
    }
  };

  const handleClick = (id: string) => {
    router.push(`/board/detail/${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 포스트 리스트 */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            작성한 글이 없습니다.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              onClick={() => handleClick(post.id)}
              className="p-4 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {post.title}
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.createdAt}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages < 2 ? (
        <></>
      ) : (
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
      )}
    </div>
  );
}
