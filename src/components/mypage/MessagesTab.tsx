"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { useMessageSocket } from "@/hooks/useMessageSocket";

interface Message {
  id: string;
  senderId: number;
  nickname: string;
  content: string;
  sendAt: string;
  read: boolean;
}

const PAGE_SIZE = 5;

export default function MessagesTab() {
  const [selected, setSelected] = useState<Message | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [tab, setTab] = useState<"received" | "sent">("received");
  const { message, totalPages, refetch, markMessageAsRead, handleDelete } =
    useMessageSocket(tab, currentPage);

  const sendReply = async () => {
    if (!selected || !replyContent.trim()) {
      alert("쪽지와 내용을 선택하세요.");
      return;
    }
    const MypageMessageWriteReqDto = {
      content: replyContent,
      receiverId: selected.senderId,
    };

    try {
      setIsSending(true);
      const res = await api.post(
        "/private/mypage/message/send",
        MypageMessageWriteReqDto,
      );
      if (res.data.httpCode == 201) {
        alert("답장을 보냈습니다!");
        setReplyContent("");
        setSelected(null);
        if (tab === "sent") {
          await refetch();
        }
      }
    } catch (error) {
      console.error(error);
      alert("잠시후 다시 시도 해 주세요.");
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkAsRead = async (msg: Message) => {
    if (tab !== "received" || msg.read) return;
    try {
      await api.put(`/private/mypage/message/${msg.id}/read`);
      markMessageAsRead(msg.id);
    } catch (err) {
      console.error("쪽지 읽음 처리 실패", err);
    }
  };

  const handleMessageDelete = async (msg: Message) => {
    if (confirm("삭제 하시겠습니까?")) {
      try {
        await api.put(`/private/mypage/message/${msg.id}/delete`);
        handleDelete(msg.id);
      } catch (err) {
        console.error("쪽지 읽음 처리 실패", err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 탭 */}
      <div className="flex gap-2">
        {["received", "sent"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setTab(type as "received" | "sent");
              setCurrentPage(1);
              setSelected(null);
            }}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              tab === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {type === "received" ? "받은 쪽지함" : "보낸 쪽지함"}
          </button>
        ))}
      </div>

      {/* 메시지와 상세 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 메시지 목록 */}
        <div className="border p-4 rounded bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col h-[460px]">
          <div className="overflow-y-auto flex-1">
            {message.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                쪽지가 없습니다.
              </p>
            ) : (
              message.map((msg) => {
                const isSelected = selected?.id === msg.id;
                let bgClass = "";

                if (isSelected) {
                  bgClass = "bg-blue-100 dark:bg-blue-900";
                } else if (tab === "received") {
                  bgClass = msg.read
                    ? "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "bg-gray-100 dark:bg-gray-700";
                } else {
                  bgClass =
                    "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";
                }

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelected(msg);
                      handleMarkAsRead(msg);
                    }}
                    className={`p-3 mb-2 cursor-pointer rounded ${bgClass} flex flex-col justify-between h-28`} // ✅ 높이 고정
                  >
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {msg.nickname}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {msg.sendAt}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 max-h-10 overflow-hidden truncate">
                        {msg.content}
                      </div>
                    </div>

                    {/* ✅ 삭제 버튼 아래 고정 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 선택 방지
                        handleMessageDelete(msg);
                      }}
                      className="self-end mt-2 text-xs text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-sm text-black dark:text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>

        {/* 상세 보기 */}
        <div className="border p-4 rounded bg-white dark:bg-gray-800 dark:border-gray-700 col-span-2 flex flex-col">
          {selected ? (
            <>
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">
                {selected.nickname}
              </h2>
              <p className="mb-4 text-gray-800 dark:text-gray-300 whitespace-pre-wrap flex-1">
                {selected.content}
              </p>
              {tab === "received" && (
                <>
                  <textarea
                    className="w-full h-32 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="답장 내용을 입력하세요..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button
                    onClick={sendReply}
                    disabled={isSending}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded w-full disabled:opacity-50"
                  >
                    {isSending ? "전송 중..." : "답장 보내기"}
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 m-auto">
              쪽지를 선택하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
