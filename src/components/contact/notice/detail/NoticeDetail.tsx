"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NoticeHeader from "@/components/contact/notice/detail/NoticHeader";
import NoticeNavigation from "@/components/contact/notice/detail/NoticeNavigation";
import { api } from "@/lib/axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  noticeType?: string;
}

export default function NoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [prevId, setPrevId] = useState(undefined);
  const [nextId, setNextId] = useState(undefined);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/contact/notice/detail/${id}`);
        const rawData = res.data.data;
        const formattedData = {
          ...rawData,
          createdAt: dayjs(rawData.createdAt).format("YYYY-MM-DD"),
        };
        setNotice(formattedData);
        setPrevId(res.data.data.prevId);
        setNextId(res.data.data.nextId);
      } catch (err: any) {
        if (err.response.data.errCode) {
          alert(err.response.data.message);
          router.push("/contact/notice/list");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchInquiries();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        로딩 중...
      </div>
    );
  }
  if (!notice) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        공지사항을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <NoticeHeader
        title={notice.title}
        createdAt={notice.createdAt}
        category={notice.noticeType}
      />

      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {notice.content}
      </p>

      <NoticeNavigation
        prevId={prevId ?? undefined}
        nextId={nextId ?? undefined}
      />
    </div>
  );
}
