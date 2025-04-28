"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface JoinedGroupCardProps {
  id: string;
  name: string;
  thumbnail: string;
  memberCount: number;
  description: string;
  onClickMembers: () => void;
  onClickWithdraw: () => void;
  onClick?: () => void; // ✅ 추가
}
export default function JoinedGroupCard({
  id,
  name,
  thumbnail,
  memberCount,
  description,
  onClickMembers,
  onClickWithdraw,
  onClick,
}: JoinedGroupCardProps) {
  return (
    <div
      onClick={onClick} // ✅ 여기에 추가
      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
    >
      {/* 썸네일 */}
      <div className="flex-shrink-0">
        <Image
          src={thumbnail || "/default-thumbnail.png"}
          alt={name}
          width={80}
          height={80}
          className="rounded-lg object-cover w-20 h-20 bg-gray-200 dark:bg-zinc-700"
        />
      </div>

      {/* 그룹 설명 */}
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
          {name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {memberCount}명 참여 중
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {description}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClickMembers();
          }}
        >
          인원 보기
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClickWithdraw();
          }}
        >
          탈퇴 하기
        </Button>
      </div>
    </div>
  );
}
