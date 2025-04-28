"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface OperatingGroupCardProps {
  id: string;
  name: string;
  thumbnail: string;
  memberCount: number;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function OperatingGroupCard({
  id,
  name,
  thumbnail,
  memberCount,
  onClick,
  onEdit,
  onDelete,
}: OperatingGroupCardProps) {
  return (
    <div
      className="border rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full" style={{ aspectRatio: "16/5" }}>
        <Image
          src={thumbnail}
          alt={`${name} 썸네일`}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            참여 인원: {memberCount}명
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
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
  );
}
