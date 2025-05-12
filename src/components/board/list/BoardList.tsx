"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/common/pagination/Pagination";
import FaqSearchBar from "@/components/common/search/SearchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/axios";
import { useEffect } from "react";
import dayjs from "dayjs";

interface FreePageReqDto {
  id: string;
  title: string;
  author: string;
  createdAt: string;
}

interface FreePageResDto {
  id: number;
  title: string;
  noticeType: string;
  writeNickname: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function BoardList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [freeList, setFreeList] = useState<FreePageResDto[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState<"ALL" | "TITLE" | "NICKNAME">(
    "ALL",
  );

  useEffect(() => {
    fetchNotice();
  }, [currentPage]);

  const fetchNotice = async () => {
    try {
      const params: any = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        searchType: searchType,
        searchKeyword: searchInput,
      };

      const res = await api.get("/board/list", { params });

      if (res.data.httpCode === 200) {
        setTotalPages(res.data.data.totalPages);
        const data = res.data.data;
        const formattedData = data.content.map((item: any) => ({
          ...item,
          createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
        }));
        setFreeList(formattedData);
      }
    } catch (error) {
      console.error("공지사항 로딩 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchNotice();
  };

  if (isLoading) {
    return <div className="text-center py-6">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 상단: 자유게시판 제목 */}
      <h1 className="text-2xl font-bold">자유게시판</h1>

      {/*  검색창 */}
      <div className="flex items-center gap-2 mb-4">
        <Select
          value={searchType}
          onValueChange={(value) =>
            setSearchType(value as "ALL" | "TITLE" | "NICKNAME")
          }
        >
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="검색 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="TITLE">제목</SelectItem>
            <SelectItem value="NICKNAME">작성자</SelectItem>
          </SelectContent>
        </Select>

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
        {freeList.length > 0 ? (
          freeList.map((post) => (
            <Link
              key={post.id}
              href={`/board/detail/${post.id}`}
              className="grid grid-cols-12 items-center border-t py-3 px-4 hover:bg-muted transition text-sm"
            >
              <div className="col-span-8 truncate">{post.title}</div>
              <div className="col-span-2 text-center">{post.writeNickname}</div>
              <div className="col-span-2 text-center">{post.createdAt}</div>
            </Link>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 text-sm border-t">
            게시글이 없습니다.
          </div>
        )}
      </div>

      {/*  Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/*  글쓰기 버튼 (맨 아래로 이동) */}
      {/* {isLoggedIn && (
        <div className="flex justify-end mt-6">
          <Link href="/board/write">
            <Button size="sm">글쓰기</Button>
          </Link>
        </div>
      )} */}
    </div>
  );
}
