export const dynamic = "force-dynamic";
import MainCarousel from "@/components/common/Carousel";
import RecommendedStudyGroups from "@/components/main/RecommendedStudyGroupList";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export default async function MainPage() {
  const cookieStore = cookies() as unknown as RequestCookies;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const isAutoLogin = cookieStore.get("isAutoLogin")?.value;
  const groupList = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/main/study-group/list`,
    {
      cache: "no-store",
      headers: {
        Authorization: `${accessToken}`,
        Cookie: `refresh-token=${refreshToken}; isAutoLogin=${isAutoLogin}`,
      },
    },
  );

  const noticeList = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/main/notice/list`,
    {
      cache: "no-store",
      headers: {
        Authorization: `${accessToken}`,
        Cookie: `refresh-token=${refreshToken}; isAutoLogin=${isAutoLogin}`,
      },
    },
  );

  const groupListData = await groupList.json();
  const noticeListData = await noticeList.json();

  return (
    <div className="w-full px-6 space-y-8">
      <header className="flex justify-between items-center"></header>
      <MainCarousel items={noticeListData.data} />
      {/* 추천 스터디 그룹 */}
      <RecommendedStudyGroups groups={groupListData.data} />

      {/* 공지사항 */}
      <section></section>

      {/* 알림 목록 */}
      <section></section>
    </div>
  );
}
