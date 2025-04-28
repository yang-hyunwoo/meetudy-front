"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NoticeTabProps {
  notices: string[];
  newNotice: string;
  editingIndex: number | null;
  editingText: string;
  onNewNoticeChange: (value: string) => void;
  onAddNotice: () => void;
  onEditNotice: (index: number) => void;
  onDeleteNotice: (index: number) => void;
  onEditingTextChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
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
}: NoticeTabProps) {
  return (
    <div className="space-y-4">
      <ul className="list-disc list-inside space-y-1">
        {notices.map((notice, idx) => (
          <li
            key={idx}
            className="flex justify-between items-start gap-2 text-sm"
          >
            {editingIndex === idx ? (
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
              <div className="flex-1">{notice}</div>
            )}
            {editingIndex !== idx && (
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditNotice(idx)}
                >
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDeleteNotice(idx)}
                >
                  삭제
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t">
        <Input
          value={newNotice}
          onChange={(e) => onNewNoticeChange(e.target.value)}
          placeholder="새 공지 입력"
          className="mb-2"
        />
        <Button size="sm" className="w-full" onClick={onAddNotice}>
          공지 추가
        </Button>
      </div>
    </div>
  );
}
