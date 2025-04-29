"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/common/pagination/Pagination";
import FaqSearchBar from "@/components/common/search/SearchBar";

interface Post {
  id: string;
  title: string;
  author: string;
  createdAt: string;
}

interface BoardListProps {
  posts: Post[];
  isLoggedIn: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function BoardList({ posts, isLoggedIn }: BoardListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* 상단: 자유게시판 제목 */}
      <h1 className="text-2xl font-bold">자유게시판</h1>

      {/* ✅ 검색창 */}
      <div className="flex gap-2 mb-4">
        <FaqSearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={handleSearch}
        />
      </div>

      {/* 게시글 테이블 */}
      <div className="border rounded-lg overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 bg-muted py-3 px-4 text-sm font-semibold">
          <div className="col-span-8">제목</div>
          <div className="col-span-2 text-center">작성자</div>
          <div className="col-span-2 text-center">작성일</div>
        </div>

        {/* 게시글 리스트 */}
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/board/detail/${post.id}`}
              className="grid grid-cols-12 items-center border-t py-3 px-4 hover:bg-muted transition text-sm"
            >
              <div className="col-span-8 truncate">{post.title}</div>
              <div className="col-span-2 text-center">{post.author}</div>
              <div className="col-span-2 text-center">{post.createdAt}</div>
            </Link>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 text-sm border-t">
            게시글이 없습니다.
          </div>
        )}
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* ✅ 글쓰기 버튼 (맨 아래로 이동) */}
      {isLoggedIn && (
        <div className="flex justify-end mt-6">
          <Link href="/board/write">
            <Button size="sm">글쓰기</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
