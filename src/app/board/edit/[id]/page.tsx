import BoardForm from "@/components/board/write/BoardWrite";

export default function BoardEditPage({ params }: { params: { id: string } }) {
  const postId = params.id;

  // 임시 데이터 (나중에 fetch로 바꿀 것)
  const existingPost = {
    title: "기존 제목",
    content: "<p>기존 내용입니다</p>",
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <BoardForm
        mode="edit"
        postId={postId}
        defaultTitle={existingPost.title}
        defaultContent={existingPost.content}
      />
    </div>
  );
}
