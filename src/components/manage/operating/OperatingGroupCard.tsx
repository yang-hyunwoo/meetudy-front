"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface OperatingGroupCardProps {
  id: string;
  title: string;
  thumbnail: string;
  currentMemberCount: number;
  maxMemberCount: number;
  status: string; //  모집 종료 여부
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleClose: () => void; //  모집 종료/재개 토글 함수
}

export default function OperatingGroupCard({
  id,
  title,
  thumbnail,
  currentMemberCount,
  maxMemberCount,
  status,
  onClick,
  onEdit,
  onDelete,
  onToggleClose,
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
            참여 인원: {currentMemberCount}명 / {maxMemberCount}명
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between items-center mt-4 gap-2">
          {/* 그룹 수정 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            그룹 수정
          </Button>

          {/* 모집 종료/재개 + 그룹 삭제 버튼 묶음 */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleClose();
              }}
            >
              {status == "active" ? "모집 종료" : "모집 재개"}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              그룹 삭제
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
