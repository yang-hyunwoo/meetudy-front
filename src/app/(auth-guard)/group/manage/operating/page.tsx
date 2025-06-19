export const dynamic = "force-dynamic";
import JoinedGroupOperating from "@/components/manage/operating/JoinedGroupOperating";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export default async function JoinedGroupOperatingPage() {
  const cookieStore = cookies() as unknown as RequestCookies;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const isAutoLogin = cookieStore.get("isAutoLogin")?.value;
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/private/study-group/operate/list`,
      {
        cache: "no-store",
        headers: {
          Authorization: `${accessToken}`,
          Cookie: `refresh-token=${refreshToken}; isAutoLogin=${isAutoLogin}`,
        },
      },
    );

    const data = await res.json();
    console.log(data);
    if (res.status !== 200 || !data.data) {
      return (
        <main className="min-h-screen p-6">
          <JoinedGroupOperating errorMessage="서버 오류가 발생했습니다." />
        </main>
      );
    }
    return (
      <main className="min-h-screen p-6">
        <JoinedGroupOperating
          ongoingGroup={data.data.ongoingGroup}
          endGroup={data.data.endGroup}
        />
      </main>
    );
  } catch (err) {
    return (
      <main className="min-h-screen p-6">
        <JoinedGroupOperating errorMessage="서버 오류가 발생했습니다." />
      </main>
    );
  }
}
