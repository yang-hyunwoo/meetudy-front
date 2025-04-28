"use client";

import { Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupJoinSectionProps {
  current: number;
  max: number;
  isPrivate: boolean;
  joinType: "free" | "approval";
  isJoined: "none" | "joined" | "requested";
  onJoinClick: () => void;
  onCancelRequestClick?: () => void;
}

export default function GroupJoinSection({
  current,
  max,
  isPrivate,
  joinType,
  isJoined,
  onJoinClick,
  onCancelRequestClick,
}: GroupJoinSectionProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      {/* 인원/비공개 표시 */}
      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 gap-1">
        <Users className="w-4 h-4" />
        <span>
          {current} / {max}
        </span>
        {isPrivate && (
          <Lock className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500" />
        )}
      </div>

      {/* 상태별 버튼 처리 */}
      {isJoined === "joined" ? (
        <span className="px-3 py-1 text-sm font-medium rounded-md bg-green-500 text-white dark:bg-green-600">
          참여중
        </span>
      ) : current < max ? (
        joinType === "approval" && isJoined === "requested" ? (
          <Button
            size="sm"
            className="px-3 py-1 text-sm font-medium rounded-md bg-yellow-400 hover:bg-yellow-500 text-white dark:bg-yellow-500 dark:hover:bg-yellow-600"
            onClick={onCancelRequestClick}
          >
            요청 취소
          </Button>
        ) : (
          <Button
            size="sm"
            className="px-3 py-1 text-sm font-medium rounded-md bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={onJoinClick}
          >
            참여하기
          </Button>
        )
      ) : (
        <span className="px-3 py-1 text-sm font-medium rounded-md bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          마감
        </span>
      )}
    </div>
  );
}
