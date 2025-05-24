"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StudyCommentList from "@/components/common/comment/CommentList";
import StudyCommentForm from "@/components/common/comment/CommentForm";
import Link from "next/link";
import { List } from "lucide-react";
import { useEffect } from "react";
import dayjs from "dayjs";
import { api } from "@/lib/axios";
import axios from "axios";
import { useAuthContext } from "@/context/AuthContext";
import "@/components/common/editor/TiptapEditor.css";

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

  useEffect(() => {
    CommentList(post.id);
  }, [post.id]);

  const CommentList = async (postId: any) => {
    const params: any = {
      targetType: "freeboard",
      targetId: postId,
    };
    const res = await api.get("/comment/list", { params });
    const rawComments = res.data.data;
    const formattedComments: Comment[] = rawComments.map((c: any) => ({
      id: c.id.toString(),
      author: c.writeNickname,
      content: c.content,
      createdAt: dayjs(c.createdAt).format("YYYY-MM-DD HH:mm"),
      isAuthor: c.modifyChk,
    }));

    setComments(formattedComments);
  };

  // 댓글 상태 추가
  const { isLoggedIn } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");

  //댓글 업력
  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 댓글 작성이 가능합니다.");
      return;
    }
    const commentWriteReqDto = {
      targetType: "freeboard",
      targetId: post.id,
      content: commentInput,
    };
    if (!commentInput.trim()) return;
    try {
      setIsLoading(true); // 로딩 시작
      const res = await api.post("/private/comment/insert", commentWriteReqDto);
      if (res.data.httpCode == 201) {
        const resdata = res.data.data;
        const newComment: Comment = {
          id: resdata.id,
          author: resdata.writeNickname,
          content: resdata.content,
          createdAt: dayjs(resdata.createdAt).format("YYYY-MM-DD HH:mm"),
          isAuthor: resdata.modifyChk,
        };

        setComments([newComment, ...comments]);
        setCommentInput("");
      }
    } catch (error) {
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  //댓글 삭제
  const handleDeleteComment = async (id: string) => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      try {
        const res = await api.put(`/private/comment/${id}/delete`);
        if (res.data.httpCode == 200) {
          setComments((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (error: any) {
        alert(error.response?.data?.data.message);
      } finally {
      }
    }
  };

  //댓글 수정
  const handleEditComment = async (id: string, newContent: string) => {
    const commentUpdateReqDto = {
      id: id,
      targetType: "freeboard",
      targetId: post.id,
      content: newContent,
    };
    try {
      const res = await api.put("/private/comment/update", commentUpdateReqDto);
      if (res.data.httpCode == 200) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, content: newContent } : c)),
        );
      }
    } catch (error: any) {
      alert(error.response?.data?.data.message);
    } finally {
    }
  };

  //게시판 삭제
  const handleDeletePost = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await api.put(`/private/free-board/${post.id}/delete`);
      if (res.data.httpCode == 200) {
        alert(res.data.message);
        router.push("/board/list");
      }
    } catch (error: any) {
      alert(error.response?.data?.data.message);
    }
  };
  if (!post) return null; // 오류로 빠지면 렌더링 안함
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      {/* 게시글 제목/작성자/작성일 */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="text-sm text-gray-500 flex justify-between mt-2">
          <span>{post.author}</span>
          <span>{dayjs(post.createdAt).format("YYYY-MM-DD")}</span>
        </div>
      </div>

      {/* 게시글 본문 */}
      <div
        className="ProseMirror text-gray-800 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      {/* 수정/삭제 버튼 */}
      {post.modifyChk && (
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
        isLoading={isLoading}
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
