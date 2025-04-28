"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean;
}

interface CommentListProps {
  comments: Comment[];
  onEditSubmit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
}

export default function StudyCommentList({
  comments,
  onEditSubmit,
  onDelete,
}: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  const handleEditClick = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const handleSaveEdit = (id: string) => {
    if (editingContent.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    onEditSubmit?.(id, editingContent);
    setEditingId(null);
    setEditingContent("");
  };

  return (
    <div className="space-y-6 mb-12">
      {comments.map((c) => (
        <div
          key={c.id}
          className="border-b border-gray-100 dark:border-gray-700 pb-4"
        >
          {/* 작성자 이름 + (작성자 뱃지) */}
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {c.author}
            {c.isAuthor && (
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                작성자
              </span>
            )}
          </div>

          {/* 댓글 내용 (수정 중이면 Textarea, 아니면 그냥 보여주기) */}
          {editingId === c.id ? (
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="text-sm bg-muted dark:bg-zinc-800"
            />
          ) : (
            <p className="text-sm whitespace-pre-line text-gray-800 dark:text-gray-300">
              {c.content}
            </p>
          )}

          {/* 작성일 + 버튼 영역 */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span>{c.createdAt}</span>

            {c.isAuthor && (
              <div className="flex gap-2">
                {editingId === c.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2 py-1 text-xs text-blue-600"
                      onClick={() => handleSaveEdit(c.id)}
                    >
                      저장
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2 py-1 text-xs text-gray-400"
                      onClick={handleCancelEdit}
                    >
                      취소
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() => handleEditClick(c)}
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2 py-1 text-xs text-red-500"
                      onClick={() => onDelete?.(c.id)}
                    >
                      삭제
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
