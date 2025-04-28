"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface OperatingMemberCardProps {
  id: string;
  nickname: string;
  avatarUrl: string;
  onClick: () => void;
  onKick: () => void;
}

export default function OperatingMemberCard({
  id,
  nickname,
  avatarUrl,
  onClick,
  onKick,
}: OperatingMemberCardProps) {
  return (
    <div
      className="flex flex-col sm:flex-row items-center gap-2 p-4 border rounded-lg shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Image
          src={avatarUrl}
          alt={nickname}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <span className="text-sm">{nickname}</span>
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="sm:ml-auto"
        onClick={(e) => {
          e.stopPropagation();
          onKick();
        }}
      >
        강퇴하기
      </Button>
    </div>
  );
}
