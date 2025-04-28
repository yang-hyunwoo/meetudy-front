"use client";

import { Button } from "@/components/ui/button";
import { Users, Lock } from "lucide-react";
import Link from "next/link";

interface GroupListItemProps {
  group: {
    id: string;
    name: string;
    description: string;
    location: string;
    current: number;
    max: number;
    isPrivate?: boolean;
    joinType: "approval" | "free";
    isJoined?: "none" | "joined" | "requested";
  };
  onJoinClick: () => void;
}

export default function GroupListItem({
  group,
  onJoinClick,
}: GroupListItemProps) {
  return (
    <li className="border rounded-lg p-4 shadow-sm dark:border-gray-700 transition hover:shadow-md bg-white dark:bg-gray-900">
      <div className="flex justify-between items-start">
        <Link
          href={`/study/group/${group.id}`}
          className="block flex-1 min-w-0"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            {group.name}
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {group.joinType === "approval" ? "승인가입" : "자유가입"}
            </span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {group.description}
          </p>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            지역: {group.location}
          </p>
        </Link>

        <div className="flex flex-col items-end gap-2 pl-4">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            {group.current} / {group.max}
            {group.isPrivate && <Lock className="w-4 h-4 ml-1 text-gray-400" />}
          </div>

          {/* 상태별 버튼 */}
          {group.isJoined === "joined" ? (
            <span className="px-3 py-1 text-sm bg-green-600 text-white transition rounded-md">
              참여중
            </span>
          ) : group.current < group.max ? (
            group.joinType === "approval" && group.isJoined === "requested" ? (
              <Button
                size="sm"
                className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white transition"
              >
                요청 취소
              </Button>
            ) : (
              <Button
                size="sm"
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
                onClick={onJoinClick}
              >
                참여하기
              </Button>
            )
          ) : (
            <span className="px-3 py-1 text-sm font-medium bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-200 rounded-md">
              마감
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
