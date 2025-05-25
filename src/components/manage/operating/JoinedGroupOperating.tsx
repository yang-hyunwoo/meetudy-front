"use client";

import { useState, useEffect } from "react";
import AttendanceDonutChart from "@/components/manage/joined/AttendanceDonutChart";
import OperatingGroupCard from "@/components/manage/operating/OperatingGroupCard";
import OperatingMemberCard from "@/components/manage/operating/OperatingMemberCard";
import PendingMemberCard from "@/components/manage/operating/PendingMemberCard";
import EndGroupCard from "@/components/manage/operating/EndGroupCard";

import { api } from "@/lib/axios";
import dayjs from "dayjs";

interface Member {
  id: string;
  nickname: string;
  avatarUrl: string;
}

interface JoinedGroup {
  currentMemberCount: number;
  maxMemberCount: number;
  id: string;
  regionEnum: string;
  status: string;
  thumbnailFileUrl?: null;
  title: string;
}

interface JoinedGroupOperatingProps {
  ongoingGroup?: JoinedGroup[];
  endGroup?: JoinedGroup[];
  errorMessage?: string;
}

export default function JoinedGroupOperating({
  ongoingGroup,
  endGroup,
  errorMessage,
}: JoinedGroupOperatingProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [attendanceRate, setAttendanceRate] = useState<number>(0);
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [pendingMembers, setPendingMembers] = useState<Member[]>([]);
  const [groupStatuses, setGroupStatuses] = useState<Record<string, boolean>>(
    {},
  );

  const attendanceData: Record<string, { rate: number; dates: string[] }> = {
    "user-1": {
      rate: 92,
      dates: ["2025-04-01", "2025-04-02", "2025-04-03"],
    },
    "user-2": {
      rate: 78,
      dates: ["2025-04-01", "2025-04-04", "2025-04-07"],
    },
    "user-3": {
      rate: 85,
      dates: ["2025-04-02", "2025-04-05", "2025-04-06"],
    },
    "user-4": {
      rate: 60,
      dates: ["2025-04-01", "2025-04-08"],
    },
    "user-5": {
      rate: 100,
      dates: [
        "2025-04-01",
        "2025-04-02",
        "2025-04-03",
        "2025-04-04",
        "2025-04-05",
      ],
    },
  };

  const handleApproveMember = (memberId: string) => {
    const approved = pendingMembers.find((m) => m.id === memberId);
    if (approved) {
      setMembers((prev) => [...prev, approved]);
      setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };
  const handleRejectMember = (memberId: string) => {
    if (confirm("정말 이 멤버를 거절하시겠습니까?")) {
      setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };
  const handleKickMember = (memberId: string) => {
    if (confirm("정말 이 멤버를 강퇴하시겠습니까?")) {
      setMembers((prev) => prev.filter((member) => member.id !== memberId));

      // 강퇴한 멤버가 선택돼 있으면 초기화
      if (selectedMemberId === memberId) {
        setSelectedMemberId(null);
        setAttendanceRate(0);
        setAttendanceDates([]);
      }
    }
  };
  const handleMemberClick = (memberId: string) => {
    if (selectedMemberId === memberId) {
      setSelectedMemberId(null);
      setAttendanceRate(0);
      setAttendanceDates([]);
      return;
    }

    setSelectedMemberId(memberId);

    const data = attendanceData[memberId];
    if (data) {
      setAttendanceRate(data.rate);
      setAttendanceDates(data.dates);
    } else {
      // 해당 멤버 출석 데이터 없으면 초기화
      setAttendanceRate(0);
      setAttendanceDates([]);
    }
  };
  const handleToggleClose = (groupId: string) => {
    console.log(groupId);
    setGroupStatuses((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };
  const handleCardClick = async (groupId: string) => {
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
      setMembers([]);
      setSelectedMemberId(null);
      setAttendanceRate(0);
      setAttendanceDates([]);
      return;
    }

    setSelectedGroupId(groupId);
    setLoading(true);
    console.log(groupId);
    // 그룹 변경할 때 이전 멤버 선택 상태 초기화
    setSelectedMemberId(null);
    setAttendanceRate(0);
    setAttendanceDates([]);

    try {
      setMembers([
        { id: "user-1", nickname: "홍길동", avatarUrl: "/avatars/user1.png" },
        { id: "user-2", nickname: "김철수", avatarUrl: "/avatars/user2.png" },
        { id: "user-3", nickname: "이영희", avatarUrl: "/avatars/user3.png" },
        { id: "user-4", nickname: "박지민", avatarUrl: "/avatars/user4.png" },
        { id: "user-5", nickname: "최준석", avatarUrl: "/avatars/user5.png" },
      ]);
      setPendingMembers([
        {
          id: "pending-1",
          nickname: "이대기",
          avatarUrl: "/avatars/user6.png",
        },
        {
          id: "pending-2",
          nickname: "정기다림",
          avatarUrl: "/avatars/user7.png",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">운영 중인 스터디 그룹</h2>

      {/* 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ongoingGroup?.map((group) => (
          <OperatingGroupCard
            key={group.id}
            id={group.id}
            title={group.title}
            thumbnail={group.thumbnailFileUrl || "/images/no-image.png"}
            status={group.status}
            currentMemberCount={group.currentMemberCount}
            maxMemberCount={group.maxMemberCount}
            //isClosed={groupStatuses[group.id] ?? group.isClosed} //  groupStatuses 먼저 보고, 없으면 group.isClosed
            onClick={() => handleCardClick(group.id)}
            onEdit={() => {
              alert("수정");
            }}
            onDelete={() => {
              if (confirm("삭제하시겠습니까?")) alert("삭제 완료");
            }}
            onToggleClose={() => handleToggleClose(group.id)}
          />
        ))}
      </div>

      {/* 선택된 그룹 인원 리스트 */}
      {selectedGroupId && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">멤버 목록</h3>

          {loading ? (
            <p>멤버 정보를 불러오는 중입니다...</p>
          ) : members.length === 0 ? (
            <p>아직 멤버가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {members.map((member) => (
                <OperatingMemberCard
                  key={member.id}
                  id={member.id}
                  nickname={member.nickname}
                  avatarUrl={member.avatarUrl}
                  onClick={() => handleMemberClick(member.id)}
                  onKick={() => handleKickMember(member.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {selectedMemberId && (
        <div className="mt-10 flex flex-col items-center gap-6">
          <AttendanceDonutChart rate={attendanceRate} />
          <div className="w-full max-w-md">
            <h4 className="text-lg font-bold mb-2">출석한 날짜</h4>
            <ul className="list-disc list-inside">
              {attendanceDates.map((date) => (
                <li key={date} className="text-sm">
                  {date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {pendingMembers.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">승인 대기 중인 인원</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pendingMembers.map((member) => (
              <PendingMemberCard
                key={member.id}
                id={member.id}
                nickname={member.nickname}
                avatarUrl={member.avatarUrl}
                onApprove={() => handleApproveMember(member.id)}
                onReject={() => handleRejectMember(member.id)}
              />
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 mt-4">종료 된 스터디 그룹</h2>
      {/* 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {endGroup?.map((group) => (
          <EndGroupCard
            key={group.id}
            id={group.id}
            title={group.title}
            thumbnail={group.thumbnailFileUrl || "/images/no-image.png"}
            isClosed={true}
            currentMemberCount={group.currentMemberCount}
            //isClosed={groupStatuses[group.id] ?? group.isClosed} //  groupStatuses 먼저 보고, 없으면 group.isClosed
            onClick={() => handleCardClick(group.id)}
          />
        ))}
      </div>
    </div>
  );
}
