"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ActivitySummaryCardProps {
  operatingGroups: number;
  joinedGroups: number;
}

export default function ActivitySummaryCard({
  operatingGroups,
  joinedGroups,
}: ActivitySummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>나의 활동 요약</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around text-center">
        <Link
          href="/group/manage/operating"
          className="flex flex-col items-center hover:underline"
        >
          <div className="text-lg font-bold">{operatingGroups}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            운영중인 그룹
          </div>
        </Link>
        <Link
          href="/group/manage/joined"
          className="flex flex-col items-center hover:underline"
        >
          <div className="text-lg font-bold">{joinedGroups}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            참여중인 그룹
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
