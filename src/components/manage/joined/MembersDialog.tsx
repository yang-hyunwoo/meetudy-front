"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Member {
  memberId: string;
  nickname: string;
  thumbnailFileUrl?: string;
}

interface MembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  members: Member[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function MembersDialog({
  open,
  onOpenChange,
  groupName,
  members,
  searchTerm,
  onSearchChange,
}: MembersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{groupName} 인원 목록</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="닉네임 검색"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-4">
          {members
            .filter((member) =>
              member.nickname.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((member) => (
              <div key={member.memberId} className="flex items-center gap-3">
                {member.thumbnailFileUrl ? (
                  <Image
                    src={member.thumbnailFileUrl}
                    alt={member.nickname}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Image
                    src="/images/no-image.png"
                    alt="기본 썸네일"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {member.nickname}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
