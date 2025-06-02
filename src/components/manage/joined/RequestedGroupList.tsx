"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface RequestGroup {
  id: string;
  title: string;
  thumbnailFileUrl: string;
  summary: string;
}

interface RequestedGroupListProps {
  groups: RequestGroup[];
  onCancelRequest?: (id: string) => void;
}

export default function RequestedGroupList({
  groups,
  onCancelRequest,
}: RequestedGroupListProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-lg shadow"
        >
          <div className="flex items-center gap-4">
            <Image
              src={group.thumbnailFileUrl || "/images/no-image.png"}
              alt={group.title}
              width={80}
              height={80}
              className="rounded-lg object-cover w-20 h-20 bg-gray-200 dark:bg-zinc-700"
            />
            <div>
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {group.summary}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => onCancelRequest?.(group.id)}
          >
            요청 취소
          </Button>
        </div>
      ))}
    </div>
  );
}
