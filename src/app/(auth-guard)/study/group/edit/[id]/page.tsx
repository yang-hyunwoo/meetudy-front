export const dynamic = "force-dynamic";
import GroupCreate from "@/components/study/group/create/GroupCreate";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export default async function GroupEditPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies() as unknown as RequestCookies;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const isAutoLogin = cookieStore.get("isAutoLogin")?.value;
  const postId = params.id;

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/private/study-group/operate/${postId}/detail`,
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
        <GroupCreate errorMessage="그룹이 존재하지 않거나 삭제되었습니다." />
      );
    }

    return (
      <div className="max-w-3xl mx-auto p-6">
        <GroupCreate defaultValues={data.data} />
      </div>
    );
  } catch (err) {
    return <GroupCreate errorMessage="서버 오류가 발생하였습니다." />;
  }
}
