import BoardDetail from "@/components/board/detail/BoardDetail";

export default function BoardDetailPage() {
  const isLoggedIn = true; // 나중에 진짜 로그인 정보 가져오기

  // TODO: 여기서 실제 API 호출해서 가져와야 함 (지금은 목 데이터)
  const post = {
    id: "1",
    title: "자유게시판 테스트 글",
    content: "이것은 자유게시판 테스트 내용입니다.\n줄바꿈도 지원합니다.",
    author: "hyeonu",
    createdAt: "2025-04-28",
    isAuthor: true, // 나중에 로그인 유저랑 작성자 비교
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <BoardDetail post={post} />
    </div>
  );
}
