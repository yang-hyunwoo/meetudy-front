"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface OperatingGroupCardProps {
  id: string;
  title: string;
  thumbnail: string;
  currentMemberCount: number;
  isClosed: boolean; //  모집 종료 여부
  onClick: () => void;
}

export default function OperatingGroupCard({
  id,
  title,
  thumbnail,
  currentMemberCount,
  isClosed,
  onClick,
}: OperatingGroupCardProps) {
  return (
    <div
      className="border rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* 썸네일 영역 */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 5" }}>
        <Image
          src={thumbnail}
          alt={`${title} 썸네일`}
          fill
          className="object-cover rounded-t-2xl"
          sizes="100vw"
        />
      </div>

      {/* 본문 영역 */}
      <div className="p-4 flex flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            참여 인원: {currentMemberCount}명
          </p>
        </div>
      </div>
    </div>
  );
}
