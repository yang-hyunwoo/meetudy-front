import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Plus, Star } from "lucide-react";
import MainCarousel from "@/components/common/Carousel";
import RecommendedStudyGroups from "@/components/main/RecommendedStudyGroupList";

const carouselItems = [
  {
    title: "안내사항",
    description:
      "관련있는 프로젝트를 모아 보고 맞춤형 양식으로 편리하게 지원하세요 🚀",
    imageUrl: "/images/slide1.png",
    href: "/contact/notice/list", // 클릭 시 이동할 주소
  },
  {
    title: "프로젝트 추천",
    description: "관심 주제 기반으로 추천되는 HOT 프로젝트를 확인하세요 🔥",
    imageUrl: "/images/slide2.png",
  },
];

const studyGroups = [
  {
    id: 1,
    title: "스터디 그룹 1",
    description: "설명입니다1.",
    href: "/group/1", // 여기에 상세페이지 링크
  },
  {
    id: 2,
    title: "스터디 그룹 2",
    description: "설명입니다2.",
    href: "/group/2", // 여기에 상세페이지 링크
  },
  {
    id: 3,
    title: "스터디 그룹 3",
    description: "설명입니다3.",
    href: "/group/2", // 여기에 상세페이지 링크
  },
];
export default function MainPage() {
  return (
    <div className="w-full px-6 space-y-8">
      <header className="flex justify-between items-center"></header>
      <MainCarousel items={carouselItems} />
      {/* 추천 스터디 그룹 */}
      <RecommendedStudyGroups groups={studyGroups} />

      {/* 공지사항 */}
      <section></section>

      {/* 알림 목록 */}
      <section></section>
    </div>
  );
}
