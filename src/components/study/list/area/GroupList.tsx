"use client";

import { useState } from "react";
import CustomPagination from "@/components/common/pagination/Pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OtpModal from "@/components/common/otp/OtpModal"; // 경로는 프로젝트에 맞게
import { useTheme } from "next-themes"; // ✅ 추가
import GroupSearchBar from "@/components/study/list/area/GroupSearchBar";
import GroupListItem from "@/components/study/list/area/GroupListItem";
import { useEffect } from "react";

type JoinStatus = "none" | "joined" | "requested";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  location: string;
  current: number;
  max: number;
  isPrivate?: boolean;
  joinType: "approval" | "free";
  isJoined?: JoinStatus;
}

const ITEMS_PER_PAGE = 10;

const mockStudyGroups: StudyGroup[] = [
  {
    id: "1",
    name: "서울 리액트 스터디",
    description: "리액트를 공부하는 서울 지역 스터디입니다.",
    location: "서울",
    current: 1,
    max: 10,
    isPrivate: true, //비밀번호 여부
    joinType: "approval", // "approval" | "free" 승인 여부
    isJoined: "requested", //방 참가 여부
  },
  {
    id: "2",
    name: "부산 알고리즘 모임",
    description: "PS 문제를 함께 풀어요!",
    location: "부산",
    current: 3,
    max: 10,
    isPrivate: false,
    joinType: "approval",
    isJoined: "joined", //방 참가 여부
  },
  {
    id: "3",
    name: "온라인 자바스크립트 스터디",
    description: "비대면으로 진행하는 JS 스터디입니다.",
    location: "기타",
    current: 10,
    max: 10,
    isPrivate: false,
    joinType: "free",
    isJoined: "requested", //방 참가 여부
  },
  {
    id: "4",
    name: "온라인 자바스크립트 스터디2",
    description: "비대면으로 진행하는 JS 스터디입니다2.",
    location: "기타",
    current: 4,
    max: 10,
    isPrivate: false,
    joinType: "approval",
  },
  {
    id: "5",
    name: "온라인 자바스크립트 스터디3",
    description: "비대면으로 진행하는 JS 스터디입니다3.",
    location: "기타",
    current: 4,
    max: 10,
    isPrivate: false,
    joinType: "free",
  },
];

export default function GroupList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { resolvedTheme } = useTheme(); // ✅ 현재 테마 확인
  const [mounted, setMounted] = useState(false);

  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const handleOtpSubmit = (code: string) => {
    console.log("입력된 OTP:", code);
    if (code == "123456") {
      setIsOtpOpen(false);
    } else {
      alert("비밀번호가 다릅니다.");
      setIsOtpOpen(true);
    }
    // 서버에 인증 요청 등 로직 추가 가능
  };

  // 서버 요청 함수
  // const handleOtpSubmit = async (code: string) => {
  //   try {
  //     const res = await fetch("/api/verify-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ code }),
  //     })
  //     const data = await res.json()

  //     return data.response // 예: "true" 또는 "false"
  //   } catch (error) {
  //     console.error("OTP 확인 중 오류 발생", error)
  //     return "false"
  //   }
  // }

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const filteredGroups = mockStudyGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredGroups.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">스터디 그룹</h1>

      {/* 검색 */}
      <GroupSearchBar
        searchInput={searchInput}
        onInputChange={setSearchInput}
        onSearch={handleSearch}
        onEnter={handleKeyDown}
      />
      {/* ✅ 제목 + 그룹 만들기 버튼 영역 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">스터디 그룹</h1>
        {mounted && (
          <Link href="/study/group/create">
            <Button
              className={`
                text-sm font-medium px-4 py-2 rounded-md transition-colors
                ${
                  resolvedTheme === "dark"
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
              `}
            >
              그룹 만들기
            </Button>
          </Link>
        )}
      </div>
      {/* 목록 */}
      <ul className="space-y-4">
        {currentItems.map((group) => (
          <GroupListItem
            key={group.id}
            group={group}
            onJoinClick={
              group.joinType === "approval"
                ? () => setIsOtpOpen(true)
                : () => {}
            }
          />
        ))}
      </ul>
      {/* ✅ OTP 모달은 루트 영역에 */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSubmit={handleOtpSubmit}
      />
      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
