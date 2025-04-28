"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import InquiryCategorySelect from "@/components/contact/qna/InquiryCategorySelect";

export default function InquiryForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("문의 등록:", { category, email, message });
    // TODO: API 연동
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 문의 유형 선택 */}
      <InquiryCategorySelect value={category} onChange={setCategory} />

      {/* 제목 */}
      <Input
        type="text"
        placeholder="제목을 입력해주세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* 본문 */}
      <Textarea
        placeholder="문의 내용을 입력해주세요"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="h-38"
        required
      />

      {/* 등록 버튼 */}
      <Button
        type="submit"
        className="w-full text-white 
                   bg-gray-800 hover:bg-gray-900 
                   dark:bg-violet-500 dark:hover:bg-violet-600"
      >
        문의 등록
      </Button>
    </form>
  );
}
