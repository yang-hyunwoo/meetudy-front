export const dynamic = "force-dynamic";
import GroupDetail from "@/components/study/group/detail/GroupDetail";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function GroupDetailPage({ params }: PageProps) {
  const cookieStore = cookies() as unknown as RequestCookies;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const isAutoLogin = cookieStore.get("isAutoLogin")?.value;
  const postId = params.id;
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/study-group/detail/${postId}`,
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
        <GroupDetail errorMessage="게시글이 존재하지 않거나 삭제되었습니다." />
      );
    }

    return <GroupDetail post={data.data} />;
  } catch (err) {
    return <GroupDetail errorMessage="서버 오류가 발생했습니다." />;
  }
}
