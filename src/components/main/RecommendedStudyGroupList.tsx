"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { REGION_MAP } from "@/enum/contactEnum";

interface StudyGroup {
  id: number;
  regionEnum: string;
  title: string;
  summary?: string;
  thumbnailFileUrl?: string;
}

interface RecommendedStudyGroupsProps {
  groups: StudyGroup[];
}

export default function RecommendedStudyGroups({
  groups,
}: RecommendedStudyGroupsProps) {
  return (
    <section className="py-8">
      <h2 className="text-xl font-semibold mb-4">🔥 추천 스터디 그룹</h2>

      {groups.length === 0 ? (
        <p className="text-muted-foreground text-sm">추천 그룹이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center p-4 rounded-xl border bg-card text-card-foreground shadow-sm space-x-4"
            >
              {/* 이미지 */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={group.thumbnailFileUrl || "/images/no-image.png"}
                  alt={group.title || "썸네일"}
                  fill
                  className="rounded-md object-cover"
                />
              </div>

              {/* 텍스트 */}
              <div className="flex flex-col justify-between flex-1 space-y-1">
                <h3 className="text-base font-semibold">{group.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  지역: {REGION_MAP[group.regionEnum] ?? group.regionEnum}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {group.summary}
                </p>
                <Button size="sm" className="w-fit" asChild>
                  <Link href={`/study/group/${group.id}`}>상세보기</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
