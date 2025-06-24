"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import OtpModal from "@/components/common/otp/OtpModal";
import StudyCommentList from "@/components/common/comment/CommentList";
import StudyCommentForm from "@/components/common/comment/CommentForm";
import GroupJoinSection from "@/components/study/group/detail/GroupJoinSection";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@/components/common/editor/TiptapEditor.css";
import { api } from "@/lib/axios";
import dayjs from "dayjs";
import { useAuthContext } from "@/context/AuthContext";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAuthor?: boolean;
}

interface GroupDetailProps {
  post?: any;
  errorMessage?: string;
}

export default function GroupDetail({ post, errorMessage }: GroupDetailProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthContext();
  const [joinStatus, setJoinStatus] = useState("NONE");
  const [otpErrorMsg, setOtpErrorMsg] = useState<string | null>(null);
  const [otpResetCounter, setOtpResetCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
      goBack(); // 이전 페이지로 이동
    }
  }, [errorMessage, router]);

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (post.allowComment) {
      CommentList(post.id);
    }
    if (isLoggedIn) {
      joinGroupAxios(post.id);
    }
  }, [post.id]);

  const CommentList = async (postId: any) => {
    const params: any = {
      targetType: "studyBoard",
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

  const joinGroupAxios = async (id: string) => {
    try {
      const res = await api.post("/study-group/my-status", [id]);

      if (res.data.httpCode === 200) {
        if (res.data.data[0] != "") {
          setJoinStatus(res.data.data[0].joinStatus);
        }
      }
    } catch (error) {
      alert("잠시 후 다시 시도해주세요.");
    }
  };

  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const cancelGroup = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 가능 합니다.");
      return;
    }
    if (confirm("요청을 취소하시겠습니까?")) {
      cancelAxios(id);
    }
  };

  const cancelAxios = async (id: string) => {
    try {
      const StudyGroupCancelReqDto = {
        studyGroupId: id,
      };

      const res = await api.put(
        "/private/study-group/cancel",
        StudyGroupCancelReqDto,
      );
      if (res.data.httpCode === 200) {
        setJoinStatus("NONE");
      }
    } catch (error) {
      alert("잠시 후 다시 시도해주세요.");
    }
  };

  const optGroup = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 가능합니다");
    }
    setIsOtpOpen(true);
  };

  const handleOtpSubmit = async (code: string) => {
    if (!post.id) return;
    try {
      const StudyGroupOtpReqDto = {
        studyGroupId: post.id,
        otpNumber: code,
      };
      const res = await api.post(
        "/private/study-group/otp/auth",
        StudyGroupOtpReqDto,
      );
      if (res.data.httpCode == 200) {
        if (res.data.data) {
          setIsOtpOpen(false);
          joinGroupAxios(post.id);
        } else {
          setOtpErrorMsg("비밀번호가 틀렸습니다.");
          setOtpResetCounter((prev) => prev + 1);
          setIsOtpOpen(true);
        }
      }
    } catch (error) {}
  };

  const joinGroup = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 가능합니다.");
      return;
    }
    joinGroupAxios(id);
  };

  //댓글 수정
  const handleEditComment = async (id: string, newContent: string) => {
    const commentUpdateReqDto = {
      id: id,
      targetType: "studyBoard",
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

  const DAY_ORDER = ["월", "화", "수", "목", "금", "토", "일"];

  function sortWeekdays(weekdays: string): string {
    const inputDays = weekdays.split(",");
    const sorted = DAY_ORDER.filter((day) => inputDays.includes(day));
    return sorted.join("·"); // 예: "월·화·수·금"
  }

  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 댓글 작성이 가능합니다.");
      return;
    }
    const commentWriteReqDto = {
      targetType: "studyBoard",
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
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      {/* 제목 영역 */}
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {post.regionEnum}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        그룹 시작일 : {post.startDate} ~ {post.endDate}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {post.meetingFrequency}{" "}
        {post.meetingFrequency !== "매일" && post.meetingDay && (
          <> [{sortWeekdays(post.meetingDay)}]</>
        )}
        {"  "}
        {post.meetingStartTime?.slice(0, 5) ?? "-"} ~{" "}
        {post.meetingEndTime?.slice(0, 5) ?? "-"}
      </p>

      {/* 본문 */}
      {/* </div><div className="mb-12 text-gray-800 dark:text-gray-200"  dangerouslySetInnerHTML={{ __html: editorContent }}>  */}
      <div
        className="ProseMirror mb-12 text-gray-800 dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      {post.tag && (
        <div className="mb-12 flex flex-wrap gap-2 text-sm">
          {post.tag.split(",").map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
      {/* 참여 버튼 및 인원 상태 */}
      <GroupJoinSection
        id={post.id}
        current={post.currentMemberCount}
        max={post.maxMemberCount}
        isPrivate={post.secret}
        joinType={post.joinType}
        isJoined={joinStatus}
        onJoinClick={(id) => {
          if (post.secret) {
            optGroup(id);
          } else {
            joinGroup(id); // axios 호출 함수
          }
        }}
        onCancelRequestClick={(id) => {
          cancelGroup(id);
        }}
      />
      {/*  OTP 모달은 루트 영역에 */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => {
          setIsOtpOpen(false);
          setOtpErrorMsg(null); // 닫을 때 메시지 초기화
        }}
        onSubmit={handleOtpSubmit}
        errorMsg={otpErrorMsg}
        setErrorMsg={setOtpErrorMsg}
        resetTrigger={otpResetCounter}
      />
      {/* 댓글 리스트 */}
      {post.allowComment && (
        <>
          {/* 댓글 수 표시 */}
          <div className="flex items-center gap-6 mb-4 text-sm text-gray-500 dark:text-gray-400 border-b pb-3 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>댓글</span>
              <span className="font-medium">{comments.length}</span>
            </div>
          </div>
          <StudyCommentList
            comments={comments}
            onEditSubmit={handleEditComment}
            onDelete={handleDeleteComment}
          />

          <StudyCommentForm
            value={commentInput}
            isLoading={isLoading}
            onChange={setCommentInput}
            onSubmit={handleSubmitComment}
          />
        </>
      )}
    </div>
  );
}
