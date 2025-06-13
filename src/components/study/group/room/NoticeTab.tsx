"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatNoticeDto {
  studyGroupId: number;
  id: number;
  message: string;
  senderId: number;
  status: string;
}

interface NoticeTabProps {
  notices: ChatNoticeDto[];
  newNotice: string;
  editingIndex: number | null;
  editingText: string;
  onNewNoticeChange: (value: string) => void;
  onAddNotice: (notice: string, type: string, id: number) => void;
  onEditNotice: (index: number) => void;
  onDeleteNotice: (index: number) => void;
  onEditingTextChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  isOwner: boolean;
}

export default function NoticeTab({
  notices,
  newNotice,
  editingIndex,
  editingText,
  onNewNoticeChange,
  onAddNotice,
  onEditNotice,
  onDeleteNotice,
  onEditingTextChange,
  onSaveEdit,
  onCancelEdit,
  isOwner, // ✅ 방장 여부
}: NoticeTabProps) {
  return (
    <div className="flex flex-col h-[480px] border rounded-md p-4 bg-muted text-sm">
      {/* 리스트 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pr-1">
        <ul className="list-disc list-outside space-y-2">
          {notices.map((notice, idx) => (
            <li key={idx} className="flex justify-between items-start gap-2">
              {editingIndex === notice.id ? (
                <div className="flex-1 space-y-1">
                  <Input
                    value={editingText}
                    onChange={(e) => onEditingTextChange(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={onSaveEdit}>
                      저장
                    </Button>
                    <Button size="sm" variant="outline" onClick={onCancelEdit}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">{notice.message}</div>
              )}
              {editingIndex !== notice.id && isOwner && (
                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditNotice(notice.id)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteNotice(notice.id)}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 입력창 (하단 고정, 방장만) */}
      {isOwner && (
        <div className="pt-3 border-t mt-3">
          <Input
            value={newNotice}
            onChange={(e) => onNewNoticeChange(e.target.value)}
            placeholder="새 공지 입력"
            className="mb-2"
          />
          <Button
            size="sm"
            className="w-full"
            onClick={() => onAddNotice(newNotice, "CREATE", 0)}
          >
            공지 추가
          </Button>
        </div>
      )}
    </div>
  );
}
