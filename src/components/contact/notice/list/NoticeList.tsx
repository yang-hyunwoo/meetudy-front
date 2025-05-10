"use client";

import { useState } from "react";
import CustomPagination from "@/components/common/pagination/Pagination";
import NoticeListItem from "@/components/contact/notice/list/NoticeListItem";
import { api } from "@/lib/axios";
import { useEffect } from "react";
import dayjs from "dayjs";

interface NoticePageResDto {
  id: string;
  title: string;
  noticeType: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function NoticeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [noticeList, setNoticeList] = useState<NoticePageResDto[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchNotice();
  }, [currentPage]);

  const fetchNotice = async () => {
    try {
      const params: any = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
      };

      const res = await api.get("/contact/notice/list", { params });

      if (res.data.httpCode === 200) {
        setTotalPages(res.data.data.totalPages);
        const data = res.data.data;
        const formattedData = data.content.map((item: any) => ({
          ...item,
          createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
        }));
        setNoticeList(formattedData);
      }
    } catch (error) {
      console.error("공지사항 로딩 실패", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">공지사항</h1>

      {noticeList.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          현재 등록된 공지사항이 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
          {noticeList.map((notice) => (
            <NoticeListItem
              key={notice.id}
              id={notice.id}
              title={notice.title}
              createdAt={notice.createdAt}
              noticeType={notice.noticeType}
            />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
