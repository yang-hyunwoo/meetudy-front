"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import InquiryCategorySelect from "@/components/contact/qna/InquiryCategorySelect";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/axios";
import axios from "axios";

export default function InquiryForm() {
  const [qnaType, setQnaType] = useState<string | null>(null);
  const [qnaTypeError, setQnaTypeError] = useState("");

  const [questionTitle, setQuestionTitle] = useState("");
  const [questionTitleError, setQuestionTitleError] = useState("");

  const [questionContent, setQuestionContent] = useState("");
  const [questionContentError, setQuestionContentError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  /** qna 저장 요청 데이터 */
  const QnaWriteReqDto = {
    qnaType,
    questionTitle,
    questionContent,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const fields = [
      {
        name: "qnaType",
        value: qnaType,
        message: "문의 유형을 선택해 주세요.",
      },
      {
        name: "questionTitle",
        value: questionTitle,
        message: "문의 제목은 공백일 수 없습니다.",
      },
      {
        name: "questionContent",
        value: questionContent,
        message: "문의 내용은 공백일 수 없습니다.",
      },
    ];

    for (const field of fields) {
      if (!(field.value ?? "").toString().trim()) {
        setErrorByField(field.name, field.message);
        return;
      }
    }

    // 에러 상태가 있으면 중단
    if (
      [qnaTypeError, questionTitleError, questionContentError].some(Boolean)
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/private/qna/insert", QnaWriteReqDto);
      if (res.data.httpCode === 201) {
        alert(res.data.message);
        setQnaType(null);
        setQnaTypeError("");
        setQuestionTitle("");
        setQuestionTitleError("");
        setQuestionContent("");
        setQuestionContentError("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const field = error.response?.data?.data?.field;
        const message = error.response?.data?.data?.message;
        if (field && message) {
          setErrorByField(field, message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setErrorByField = (field: string, message: string) => {
    switch (field) {
      case "qnaType":
        setQnaTypeError(message);
        break;
      case "questionTitle":
        setQuestionTitleError(message);
        break;
      case "questionContent":
        setQuestionContentError(message);
        break;
      default:
        alert("알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 문의 유형 선택 */}
      <InquiryCategorySelect
        value={qnaType}
        onChange={(value) => {
          setQnaType(value);
          if (value) setQnaTypeError("");
        }}
      />
      {qnaTypeError && (
        <p className="text-xs text-red-500 mt-2">{qnaTypeError}</p>
      )}

      {/* 제목 */}
      <Input
        type="text"
        placeholder="제목을 입력해주세요."
        value={questionTitle}
        onChange={(e) => {
          setQuestionTitle(e.target.value);
          if (e.target.value.trim()) setQuestionTitleError("");
        }}
      />
      {questionTitleError && (
        <p className="text-xs text-red-500 mt-2">{questionTitleError}</p>
      )}

      {/* 본문 */}
      <Textarea
        placeholder="문의 내용을 입력해주세요."
        value={questionContent}
        onChange={(e) => {
          setQuestionContent(e.target.value);
          if (e.target.value.trim()) setQuestionContentError("");
        }}
        className="h-38"
      />
      {questionContentError && (
        <p className="text-xs text-red-500 mt-2">{questionContentError}</p>
      )}

      {/* 등록 버튼 */}
      <Button
        type="submit"
        className="w-full text-white bg-gray-800 hover:bg-gray-900 dark:bg-violet-500 dark:hover:bg-violet-600"
        disabled={isLoading}
      >
        {isLoading && <Spinner />}
        {isLoading ? "문의 등록 중..." : "문의 등록"}
      </Button>
    </form>
  );
}
