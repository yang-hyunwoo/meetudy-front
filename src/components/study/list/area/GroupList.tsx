"use client";

import { useState } from "react";
import CustomPagination from "@/components/common/pagination/Pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OtpModal from "@/components/common/otp/OtpModal";
import { useTheme } from "next-themes";
import GroupSearchBar from "@/components/study/list/area/GroupSearchBar";
import GroupListItem from "@/components/study/list/area/GroupListItem";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { useAuthContext } from "@/context/AuthContext";

interface StudyGroup {
  id: string;
  title: string;
  summary: string;
  regionEnum: string;
  currentMemberCount: number;
  maxMemberCount: number;
  secret: boolean;
  joinType: boolean;
  tag: string;
  isJoined?: string;
  thumbnailFileUrl?: string;
  startDate: string;
  endDate: string;
  meetingStartTime: string;
  meetingEndTime: string;
  meetingFrequency: string;
  meetingDay: string;
}

const ITEMS_PER_PAGE = 10;

export default function GroupList({ region }: { region: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [studyGroupList, setStudyGroupList] = useState<StudyGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { resolvedTheme } = useTheme(); //  현재 테마 확인
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuthContext();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [otpErrorMsg, setOtpErrorMsg] = useState<string | null>(null);
  const [otpResetCounter, setOtpResetCounter] = useState(0);

  useEffect(() => {
    fetchStudyGroup();
  }, [currentPage]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchStudyGroup = async () => {
    try {
      const params: any = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        region: region.toUpperCase(),
        searchKeyword: searchInput,
      };

      const res = await api.get("/study-group/list", { params });

      if (res.data.httpCode === 200) {
        const groupList = res.data.data.content;
        setTotalPages(res.data.data.totalPages);
        const groupIds = groupList.map((g: any) => g.id);
        const statusRes = await api.post("/study-group/my-status", groupIds);
        const statusData = statusRes.data.data;
        const statusMap = new Map<number, string>();
        if (statusData && Array.isArray(statusData)) {
          statusData.forEach((item: any) => {
            statusMap.set(item.studyGroupId, item.joinStatus);
          });
        }
        const enrichedList = groupList.map((group: any) => ({
          ...group,
          isJoined: statusMap.get(group.id) || "none",
        }));
        setStudyGroupList(enrichedList);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  //비밀방 번호 입력
  const handleOtpSubmit = async (code: string) => {
    if (!selectedGroupId) return;
    try {
      const StudyGroupOtpReqDto = {
        studyGroupId: selectedGroupId,
        otpNumber: code,
      };
      const res = await api.post(
        "/private/study-group/otp/auth",
        StudyGroupOtpReqDto,
      );
      if (res.data.httpCode == 200) {
        if (res.data.data) {
          setIsOtpOpen(false);
          joinGroupAxios(selectedGroupId);
        } else {
          setOtpErrorMsg("비밀번호가 틀렸습니다.");
          setOtpResetCounter((prev) => prev + 1);
          setIsOtpOpen(true);
        }
      }
    } catch (error) {}
  };

  const joinGroup = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 가능합니다.");
      return;
    }
    joinGroupAxios(id);
  };

  const joinGroupAxios = async (id: string) => {
    try {
      const StudyGroupJoinReqDto = {
        studyGroupId: id,
      };

      const res = await api.post(
        "/private/study-group/join",
        StudyGroupJoinReqDto,
      );

      if (res.data.httpCode === 201) {
        const { studyGroupId, joinStatus, currentMemberCount } = res.data.data;
        setStudyGroupList((prevList) =>
          prevList.map((group) =>
            String(group.id) === String(studyGroupId)
              ? {
                  ...group,
                  isJoined: joinStatus,
                  currentMemberCount:
                    currentMemberCount ?? group.currentMemberCount,
                }
              : group,
          ),
        );
      }
    } catch (error) {
      alert("강제퇴장 된 그룹은 참여 하실 수 없습니다.");
    }
  };

  const optGroup = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 가능합니다");
    }
    setSelectedGroupId(id);
    setIsOtpOpen(true);
  };

  const cancelGroup = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 가능 합니다.");
      return;
    }
    if (confirm("요청을 취소하시겠습니까?")) {
      cancelAxios(id);
    }
  };

  const cancelAxios = async (id: string) => {
    try {
      const StudyGroupCancelReqDto = {
        studyGroupId: id,
      };

      const res = await api.put(
        "/private/study-group/cancel",
        StudyGroupCancelReqDto,
      );
      if (res.data.httpCode === 200) {
        setStudyGroupList((prevList) =>
          prevList.map((group) =>
            String(group.id) === String(id)
              ? { ...group, isJoined: "NONE" }
              : group,
          ),
        );
      }
    } catch (error) {
      alert("잠시 후 다시 시도해주세요.");
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
    fetchStudyGroup();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  if (isLoading) {
    return <div className="text-center py-6">로딩 중...</div>;
  }

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

      {studyGroupList.length === 0 ? (
        <>
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-4">스터디 그룹이 없습니다.</p>
            {isLoggedIn && (
              <Link href="/study/group/create">
                <Button
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors
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
        </>
      ) : (
        <>
          {/*  제목 + 그룹 만들기 버튼 영역 */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">스터디 그룹</h1>
            {mounted && isLoggedIn && (
              <>
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
              </>
            )}
          </div>
          {/* 목록 */}
          <ul className="space-y-4">
            {studyGroupList.map((group) => (
              <GroupListItem
                key={group.id + group.isJoined}
                group={group}
                onJoinCancelClick={(id) => {
                  cancelGroup(id);
                }}
                onJoinClick={(id) => {
                  if (group.secret) {
                    optGroup(id);
                  } else {
                    joinGroup(id); // axios 호출 함수
                  }
                }}
              />
            ))}
          </ul>
          {/*  OTP 모달은 루트 영역에 */}
          <OtpModal
            isOpen={isOtpOpen}
            onClose={() => {
              setIsOtpOpen(false);
              setOtpErrorMsg(null); // 닫을 때 메시지 초기화
            }}
            onSubmit={handleOtpSubmit}
            errorMsg={otpErrorMsg}
            setErrorMsg={setOtpErrorMsg}
            resetTrigger={otpResetCounter}
          />
        </>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
