export const dynamic = "force-dynamic";
import BoardDetail from "@/components/board/detail/BoardDetail";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardDetailPage({ params }: PageProps) {
  const cookieStore = cookies() as unknown as RequestCookies;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const isAutoLogin = cookieStore.get("isAutoLogin")?.value;
  const resolvedParams = await params;
  const postId = resolvedParams?.id;

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/free-board/${postId}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `${accessToken}`,
          Cookie: `refresh-token=${refreshToken}; isAutoLogin=${isAutoLogin}`,
        },
      },
    );

    const data = await res.json();

    if (res.status !== 200 || !data.data) {
      return (
        <BoardDetail errorMessage="게시글이 존재하지 않거나 삭제되었습니다." />
      );
    }

    return <BoardDetail post={data.data} />;
  } catch (err) {
    return <BoardDetail errorMessage="서버 오류가 발생했습니다." />;
  }
}
