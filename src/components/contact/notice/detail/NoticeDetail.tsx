"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NoticeHeader from "@/components/contact/notice/detail/NoticHeader";
import NoticeNavigation from "@/components/contact/notice/detail/NoticeNavigation";

interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category?: "점검" | "이벤트" | "기능" | "기타";
}

const mockNotices: Notice[] = [
  {
    id: "1",
    title: "서비스 점검 안내2",
    content: "4월 25일(금) 01:00 ~ 03:00까지 점검 예정입니다.",
    createdAt: "2025-04-22",
    category: "점검",
  },
  {
    id: "2",
    title: "신규 기능 출시",
    content: "새로운 스터디 통계 기능이 추가되었습니다.",
    createdAt: "2025-04-20",
    category: "기능",
  },
  {
    id: "3",
    title: "이벤트 공지",
    content: "참여자 전원에게 혜택을 드립니다.",
    createdAt: "2025-04-18",
    category: "이벤트",
  },
];

export default function NoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const found = mockNotices.find((n) => n.id === id);
    setNotice(found || null);
  }, [id]);

  if (!notice) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        공지사항을 찾을 수 없습니다.
      </div>
    );
  }

  const currentIndex = mockNotices.findIndex((n) => n.id === id);
  const prevNotice = mockNotices[currentIndex + 1];
  const nextNotice = mockNotices[currentIndex - 1];

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <NoticeHeader
        title={notice.title}
        createdAt={notice.createdAt}
        category={notice.category}
      />

      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {notice.content}
      </p>

      <NoticeNavigation prevNotice={prevNotice} nextNotice={nextNotice} />
    </div>
  );
}
