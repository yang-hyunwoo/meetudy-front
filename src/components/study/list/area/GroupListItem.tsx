"use client";

import { Button } from "@/components/ui/button";
import { Users, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import GroupTagOverflow from "./GroupTagOverflow";
interface GroupListItemProps {
  group: {
    id: string;
    title: string;
    summary: string;
    regionEnum: string;
    currentMemberCount: number;
    maxMemberCount: number;
    secret?: boolean;
    joinType: boolean;
    thumbnailFileUrl?: string;
    isJoined?: string;
    tag: string;
  };
  onJoinClick: (id: string) => void;
}

export default function GroupListItem({
  group,
  onJoinClick,
}: GroupListItemProps) {
  const tags = group.tag
    ? Array.from(new Set(group.tag.split(",").map((tag) => tag.trim())))
    : [];

  return (
    <li className="border rounded-lg p-4 shadow-sm dark:border-gray-700 transition hover:shadow-md bg-white dark:bg-gray-900">
      <div className="flex items-start gap-4">
        {/* 썸네일 */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">
          {group.thumbnailFileUrl ? (
            <Image
              src={group.thumbnailFileUrl}
              alt="썸네일"
              fill
              className="object-cover"
            />
          ) : (
            <Image
              src="/images/no-image.png"
              alt="기본 썸네일"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* 오른쪽 콘텐츠 */}
        <div className="flex-1 flex justify-between">
          <div className="block flex-1 min-w-0">
            <Link href={`/study/group/${group.id}`}>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 hover:underline">
                {group.title}
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {group.joinType === true ? "승인가입" : "자유가입"}
                </span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {group.summary}
              </p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                지역: {group.regionEnum}
              </p>
            </Link>

            {/* ✅ 실제 태그 표시 컴포넌트 위치 */}
            {tags.length > 0 && (
              <div className="flex-1 min-w-0 overflow-hidden mt-2">
                <GroupTagOverflow tags={tags} />
              </div>
            )}
          </div>

          {/* 우측 버튼 영역 */}
          <div className="flex flex-col items-end gap-2 pl-4">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              {group.currentMemberCount} / {group.maxMemberCount}
              {group.secret && <Lock className="w-4 h-4 ml-1 text-gray-400" />}
            </div>

            {/* 상태별 버튼 */}
            {group.isJoined === "APPROVED" ? (
              <span className="px-3 py-1 text-sm bg-green-600 text-white transition rounded-md">
                참여중
              </span>
            ) : group.currentMemberCount < group.maxMemberCount ? (
              group.joinType && group.isJoined === "PENDING" ? (
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
                  onClick={() => onJoinClick(group.id)}
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
      </div>
    </li>
  );
}
