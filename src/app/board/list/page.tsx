import BoardList from "@/components/board/list/BoardList";

// ✅ 추후 API 호출로 교체할 예정 (지금은 mock 데이터)
const mockPosts = [
  {
    id: "1",
    title: "첫 번째 글입니다",
    author: "hyeonu",
    createdAt: "2025-04-27",
  },
  {
    id: "2",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "3",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "4",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "5",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "6",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "7",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "8",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "9",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "10",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
  {
    id: "11",
    title: "두 번째 글 테스트",
    author: "seoyoon",
    createdAt: "2025-04-27",
  },
];

export default function BoardPage() {
  const isLoggedIn = true; // TODO: 실제 로그인 여부로 바꿔야 함

  return (
    <div className="max-w-3xl mx-auto p-6">
      <BoardList posts={mockPosts} isLoggedIn={isLoggedIn} />
    </div>
  );
}
