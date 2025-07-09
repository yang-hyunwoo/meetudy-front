export const dynamic = "force-dynamic";

import GroupRoom from "@/components/study/group/room/GroupRoom";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

interface PageProps {
  params: Promise<{ id: string }>; // params를 Promise로 정의
}

export default async function GroupRoomPage({ params }: PageProps) {
  const cookieStore = cookies() as unknown as RequestCookies;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const isAutoLogin = cookieStore.get("isAutoLogin")?.value;
  const resolvedParams = await params;
  const studyGroupId = resolvedParams?.id;

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/private/chat/${studyGroupId}/detail/auth`,
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
      return <GroupRoom errorMessage="그룹에 권한이 없습니다." />;
    }

    return <GroupRoom />;
  } catch (err) {
    return <GroupRoom errorMessage="서버 오류가 발생하였습니다." />;
  }
}
