"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinksTabProps {
  validLinks: ChatLinkDto[];
  linkInput: string;
  onLinkInputChange: (value: string) => void;
  onAddLink: () => void;
  handleDeleteLink: (id: number) => void;
}

interface ChatLinkDto {
  studyGroupId: number;
  id: number;
  linkUrl: string;
  memberId: number;
  status: string;
  modifyChk: boolean;
}

export default function LinksTab({
  validLinks,
  linkInput,
  onLinkInputChange,
  handleDeleteLink,
  onAddLink,
}: LinksTabProps) {
  return (
    <div className="flex flex-col h-[400px]">
      {/* 링크 목록: 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto pr-1">
        <ul className="text-sm space-y-2">
          {validLinks.map((link, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-muted px-2 py-1 rounded-md"
            >
              <a
                href={link.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all flex-1"
              >
                {link.linkUrl}
              </a>
              {link.modifyChk && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-4"
                  onClick={() => handleDeleteLink(link.id)}
                >
                  삭제
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 링크 입력창: 아래 고정 */}
      <div className="pt-4 border-t mt-2">
        <Input
          value={linkInput}
          onChange={(e) => onLinkInputChange(e.target.value)}
          placeholder="https://example.com"
          className="mb-2"
        />
        <Button size="sm" className="w-full" onClick={onAddLink}>
          링크 추가
        </Button>
      </div>
    </div>
  );
}
