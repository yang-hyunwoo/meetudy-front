"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { api } from "@/lib/axios";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";

interface BoardFormProps {
  defaultTitle?: string;
  defaultContent?: string;
  postId?: string; // 수정할 때만 필요
}

export default function BoardForm({
  defaultTitle = "",
  defaultContent = "",
  postId,
}: BoardFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(defaultTitle);
  const [titleError, setTitleError] = useState("");
  const [content, setContent] = useState(defaultContent);
  const [contentError, setContentError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const TITLE_NOT_NULL = "제목은 공백일 수 없습니다.";
  const CONTENT_NOT_NULL = "내용은 공백일 수 없습니다.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorList = [titleError, contentError];

    // 하나라도 에러가 있다면 중단
    if (errorList.some(Boolean)) {
      return;
    }

    const fields = [
      { name: "title", value: title, message: TITLE_NOT_NULL },
      { name: "content", value: content, message: CONTENT_NOT_NULL },
    ];

    for (const field of fields) {
      if (!field.value.trim()) {
        setErrorByField(`${field.name}`, `${field.message}`);
        return;
      }
    }
    setIsLoading(true); // 로딩 시작
    try {
      const FreeWriteReqDto = {
        title: title,
        content: content,
        postId: postId,
      };

      const res = await api.post("/private/free-board/insert", FreeWriteReqDto);
      if (res.data.httpCode == 201) {
        alert(res.data.message);
        router.push("/board/list");
      }
      //회원가입 완료 페이지
      //router.push("/join/success");
    } catch (error) {
      //에러 검증 실패
      if (axios.isAxiosError(error)) {
        const field = error.response?.data?.data.field;
        const message = error.response?.data?.data.message;
        if (field && message) {
          setErrorByField(field, message);
        }
      }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const setErrorByField = (field: string, message: string) => {
    switch (field) {
      case "title":
        setTitleError(message);
        break;
      case "content":
        setContentError(message);
        break;
      default:
        alert("오류가 발생했습니다. \n 잠시후 다시 시도해 주세요.");
        return;
    }
  };
  const handleTitleBlur = () => {
    if (!title.trim()) {
      setTitleError(TITLE_NOT_NULL);
    } else if (title.length > 100) {
      setTitleError("제목은 1자 이상 100자 이하로 입력해야 합니다.");
    } else {
      setTitleError("");
    }
  };

  const handleEditorChange = (html: string) => {
    setContent(html);
    const trueFalse = !html || html.trim() === "" || html === "<p></p>";
    if (trueFalse) {
      setContentError(CONTENT_NOT_NULL);
    } else {
      setContentError("");
    }
  };
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {/* {mode === "create" ? "글 작성" : "글 수정"} */}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="제목을 입력하세요"
          value={title}
          onBlur={handleTitleBlur}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        {titleError && (
          <p className="text-xs text-red-500 mt-3">{titleError}</p>
        )}
        <TiptapEditor content={content} onChange={handleEditorChange} />
        {contentError && (
          <p className="text-xs text-red-500 mt-3">{contentError}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner />}
            {isLoading ? "작성 중..." : "작성하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
