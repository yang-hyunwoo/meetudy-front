"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TiptapEditor from "@/components/common/editor/TiptapEditor";

interface BoardFormProps {
  defaultTitle?: string;
  defaultContent?: string;
  mode: "create" | "edit";
  postId?: string; // 수정할 때만 필요
}

export default function BoardForm({
  defaultTitle = "",
  defaultContent = "",
  mode,
  postId,
}: BoardFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(content);
    e.preventDefault();

    if (title.trim() === "" || content.trim() === "") {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "create") {
        // 작성
        // await api.post("/board", { title, content });
        console.log(" 작성", { title, content });
      } else {
        // 수정
        if (!postId) throw new Error("Post ID가 없습니다.");
        // await api.patch(`/board/${postId}`, { title, content });
        console.log("✏️ 수정", { postId, title, content });
      }

      alert(
        mode === "create"
          ? "게시글이 작성되었습니다!"
          : "게시글이 수정되었습니다!",
      );
      //router.push("/study/board");
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {mode === "create" ? "글 작성" : "글 수정"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />

        <TiptapEditor content={content} onChange={(html) => setContent(html)} />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "create"
                ? "작성 중..."
                : "수정 중..."
              : mode === "create"
                ? "작성하기"
                : "수정하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
