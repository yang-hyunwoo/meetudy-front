"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import OtpModal from "@/components/common/otp/OtpModal";
import StudyCommentList from "@/components/common/comment/CommentList";
import StudyCommentForm from "@/components/common/comment/CommentForm";
import GroupJoinSection from "@/components/study/group/detail/GroupJoinSection";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean;
}

export default function GroupDetail() {
  const { id } = useParams();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "응답하라2002",
      content: `오랜만에 보는 “해주세요” 글이네요.\n과제면 분석부터 하셔야 합니다.`,
      createdAt: "2025.04.23",
    },
    {
      id: "2",
      author: "로드아웃",
      content: `오해 없으시길 바라고 올린 거였습니다. 실무자는 아닙니다만 필요해서 만든 거예요.`,
      createdAt: "2025.04.23",
      isAuthor: true,
    },
  ]);
  const [group] = useState<{
    name: string;
    description: string;
    current: number;
    max: number;
    isPrivate: boolean;
    joinType: "free" | "approval";
    isJoined: "none" | "joined" | "requested";
    commentType: boolean;
  }>({
    name: "서울 리액트 스터디",
    description: "리액트를 공부하는 서울 지역 스터디입니다.",
    current: 3,
    max: 10,
    isPrivate: true,
    joinType: "approval",
    isJoined: "none",
    commentType: true,
  });

  const handleSubmit = () => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: String(comments.length + 1),
      author: "익명",
      content: commentInput,
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    };

    setComments([newComment, ...comments]);
    setCommentInput("");
  };

  const handleOtpSubmit = (code: string) => {
    console.log("입력된 OTP:", code);
    if (code == "123456") {
      setIsOtpOpen(false);
    } else {
      alert("비밀번호가 다릅니다.");
      setIsOtpOpen(true);
    }
    // 서버에 인증 요청 등 로직 추가 가능
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      {/* 제목 영역 */}
      <h1 className="text-2xl font-bold mb-2">스터디 상세 정보</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        스터디 ID: {id}
      </p>

      {/* 본문 */}
      {/* </div><div className="mb-12 text-gray-800 dark:text-gray-200"  dangerouslySetInnerHTML={{ __html: editorContent }}>  */}
      <div className="mb-12 text-gray-800 dark:text-gray-200">
        온라인 기반의 리액트 스터디입니다. 매주 토요일마다 Zoom으로 모임을 갖고
        과제와 실습을 함께 진행합니다.
      </div>

      {/* 참여 버튼 및 인원 상태 */}
      <GroupJoinSection
        current={group.current}
        max={group.max}
        isPrivate={group.isPrivate}
        joinType={group.joinType}
        isJoined={group.isJoined}
        onJoinClick={
          group.joinType === "approval"
            ? () => setIsOtpOpen(true)
            : () => {
                console.log("자유가입 처리");
              }
        }
        onCancelRequestClick={() => {
          console.log("요청 취소 처리");
        }}
      />
      {/*  OTP 모달은 루트 영역에 */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSubmit={handleOtpSubmit}
      />
      {/* 댓글 리스트 */}
      {group.commentType && (
        <>
          {/* 댓글 수 표시 */}
          <div className="flex items-center gap-6 mb-4 text-sm text-gray-500 dark:text-gray-400 border-b pb-3 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>댓글</span>
              <span className="font-medium">{comments.length}</span>
            </div>
          </div>
          <StudyCommentList comments={comments} />

          <StudyCommentForm
            value={commentInput}
            onChange={setCommentInput}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}
