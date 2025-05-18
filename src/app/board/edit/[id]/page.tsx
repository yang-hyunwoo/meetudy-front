export const dynamic = "force-dynamic";
import BoardForm from "@/components/board/write/BoardWrite";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

interface BoardFormProps {
  defaultTitle: string;
  defaultContent: string;
  postId: string;
}
export default async function BoardEditPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies() as unknown as RequestCookies;
  const accessToken = cookieStore.get("accessToken")?.value;
  const postId = params.id;

  try {
    const res = await fetch(
      `http://localhost:8080/api/private/free-board/${postId}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `${accessToken}`,
        },
      },
    );

    const data = await res.json();
    console.log(data);

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
