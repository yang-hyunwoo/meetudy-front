"use client";

import { useState, useEffect } from "react";

interface Message {
  id: string;
  sender: string;
  subject: string;
  body: string;
  date: string;
}

const PAGE_SIZE = 5;

export default function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const dummyMessages = Array.from({ length: 23 }, (_, idx) => ({
      id: String(idx + 1),
      sender: "관리자",
      subject: `공지사항 ${idx + 1}`,
      body: `공지사항 본문 ${idx + 1}`,
      date: "2025.04.28",
    }));

    setMessages(dummyMessages);
  }, []);

  const paginatedMessages = messages.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const totalPages = Math.ceil(messages.length / PAGE_SIZE);

  const sendReply = async () => {
    if (!selected) {
      alert("쪽지를 선택하세요.");
      return;
    }
    if (!replyContent.trim()) {
      alert("답장 내용을 입력하세요.");
      return;
    }

    try {
      setIsSending(true);

      // 여기서 실제 API 호출을 합니다.
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 가짜 딜레이

      alert("답장을 보냈습니다!");
      setReplyContent("");
    } catch (error) {
      console.error(error);
      alert("답장 보내기에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
      {/* 쪽지 리스트 */}
      <div className="border p-4 rounded overflow-y-auto max-h-[400px] bg-white dark:bg-gray-800 dark:border-gray-700">
        {paginatedMessages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => setSelected(msg)}
            className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <div className="font-semibold truncate text-black dark:text-white">
              {msg.subject}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {msg.date}
            </div>
          </div>
        ))}

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

      {/* 쪽지 상세보기 */}
      <div className="border p-4 rounded flex-1 bg-white dark:bg-gray-800 dark:border-gray-700">
        {selected ? (
          <>
            <h2 className="text-lg font-bold mb-2 text-black dark:text-white">
              {selected.subject}
            </h2>
            <p className="mb-6 text-gray-800 dark:text-gray-300">
              {selected.body}
            </p>

            {/* ✅ 답장 입력창 */}
            <textarea
              className="w-full h-32 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="답장 내용을 입력하세요..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />

            {/* ✅ 답장 보내기 버튼 */}
            <button
              onClick={sendReply}
              disabled={isSending}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded w-full disabled:opacity-50"
            >
              {isSending ? "전송 중..." : "답장 보내기"}
            </button>
          </>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            쪽지를 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}
