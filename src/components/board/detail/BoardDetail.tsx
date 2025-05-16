"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StudyCommentList from "@/components/common/comment/CommentList";
import StudyCommentForm from "@/components/common/comment/CommentForm";
import Link from "next/link";
import { List } from "lucide-react";
import { useEffect } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isAuthor: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean;
}

interface BoardDetailProps {
  post?: any;
  errorMessage?: string;
}

export default function BoardDetail({ post, errorMessage }: BoardDetailProps) {
  const router = useRouter();
  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
      router.back(); // 이전 페이지로 이동
    }
  }, [errorMessage, router]);

  // 댓글 상태 추가
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "user01",
      content: "좋은 글 감사합니다!",
      createdAt: "2025.04.28",
    },
    {
      id: "2",
      author: "hyeonu",
      content: "추가 질문은 댓글로 주세요.",
      createdAt: "2025.04.28",
      isAuthor: true,
    },
  ]);
  const [commentInput, setCommentInput] = useState("");

  const handleSubmitComment = () => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: String(comments.length + 1),
      author: "익명", // TODO: 나중에 로그인 유저로 교체
      content: commentInput,
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    };

    setComments([newComment, ...comments]);
    setCommentInput("");
  };

  const handleDeleteComment = (id: string) => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEditComment = (id: string) => {
    const newContent = prompt("수정할 내용을 입력하세요");
    if (newContent) {
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content: newContent } : c)),
      );
    }
  };

  const handleDeletePost = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    console.log(`✅ 게시글 삭제: ${post.id}`);
    alert("삭제 완료!");
    router.push("/study/board");
  };
  if (!post) return null; // 오류로 빠지면 렌더링 안함
  return (
    <div className="space-y-6">
      {/* 게시글 제목/작성자/작성일 */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="text-sm text-gray-500 flex justify-between mt-2">
          <span>{post.author}</span>
          <span>{post.createdAt}</span>
        </div>
      </div>

      {/* 게시글 본문 */}
      <div
        className="text-gray-800 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      {/* 수정/삭제 버튼 */}
      {post.isAuthor && (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => router.push(`/board/edit/${post.id}`)}
          >
            수정
          </Button>
          <Button variant="destructive" onClick={handleDeletePost}>
            삭제
          </Button>
        </div>
      )}

      {/* 댓글 리스트 */}
      <StudyCommentList
        comments={comments}
        onEditSubmit={handleEditComment}
        onDelete={handleDeleteComment}
      />
      {/* 댓글 작성 폼 */}
      <StudyCommentForm
        value={commentInput}
        onChange={setCommentInput}
        onSubmit={handleSubmitComment}
      />

      {/* 목록으로 */}
      <div className="flex justify-center mt-12 border-t border-gray-200 dark:border-gray-700 pt-6">
        <Link
          href="/board/list"
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
                    bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                    text-sm text-gray-700 dark:text-gray-200 transition"
        >
          <List className="w-4 h-4" />
          목록으로
        </Link>
      </div>
    </div>
  );
}
