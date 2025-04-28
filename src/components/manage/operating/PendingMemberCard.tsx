"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PendingMemberCardProps {
  id: string;
  nickname: string;
  avatarUrl: string;
  onApprove: () => void;
  onReject: () => void;
}

export default function PendingMemberCard({
  id,
  nickname,
  avatarUrl,
  onApprove,
  onReject,
}: PendingMemberCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 p-4 border rounded-lg shadow-sm">
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
      <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
        <Button size="sm" onClick={onApprove}>
          승인하기
        </Button>
        <Button variant="destructive" size="sm" onClick={onReject}>
          거절하기
        </Button>
      </div>
    </div>
  );
}
