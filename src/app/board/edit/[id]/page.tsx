export const dynamic = "force-dynamic";
import BoardForm from "@/components/board/write/BoardWrite";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

interface PageProps {
  params: Promise<{ id: string }>; // params를 Promise로 정의
}

export default async function BoardEditPage({ params }: PageProps) {
  const cookieStore = cookies() as unknown as RequestCookies;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const isAutoLogin = cookieStore.get("isAutoLogin")?.value;
  const resolvedParams = await params;
  const postId = resolvedParams?.id;

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/private/free-board/${postId}`,
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
        <BoardForm errorMessage="게시글이 존재하지 않거나 삭제되었습니다." />
      );
    }

    return (
      <div className="max-w-3xl mx-auto p-6">
        <BoardForm
          postId={postId}
          defaultTitle={data.data.title}
          defaultContent={data.data.content}
        />
      </div>
    );
  } catch (err) {
    return <BoardForm errorMessage="서버 오류가 발생했습니다." />;
  }
}
