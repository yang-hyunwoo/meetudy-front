"use client";

import { useState, useEffect } from "react";
import JoinedGroupCard from "@/components/manage/joined/JoinedGroupCard";
import AttendanceDialog from "@/components/manage/joined/AttendanceDialog";
import MembersDialog from "@/components/manage/joined/MembersDialog";

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
  thumbnailFileUrl?: string;
  title: string;
  summary: string;
}

interface JoinedGroupListProps {
  groups: JoinedGroup[];
}

//  그룹별 출석률 + 출석시간 Mock 데이터
const groupAttendanceMock: Record<string, { rate: number; times: string[] }> = {
  g1: {
    rate: 82,
    times: ["2025.04.01 18:00", "2025.04.08 18:00", "2025.04.15 18:00"],
  },
  g2: {
    rate: 90,
    times: [
      "2025.03.28 19:00",
      "2025.04.04 19:00",
      "2025.04.11 19:00",
      "2025.04.18 19:00",
    ],
  },
  g3: {
    rate: 75,
    times: ["2025.04.05 17:00", "2025.04.12 17:00"],
  },
};

export default function JoinedGroupList({ groups }: JoinedGroupListProps) {
  const [openAttendanceGroupId, setOpenAttendanceGroupId] = useState<
    string | null
  >(null);
  const [openMembersGroupId, setOpenMembersGroupId] = useState<string | null>(
    null,
  );

  const [myAttendanceRate, setMyAttendanceRate] = useState<number>(0);
  const [attendanceTimes, setAttendanceTimes] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (openAttendanceGroupId) {
      const attendanceData = groupAttendanceMock[openAttendanceGroupId];
      if (attendanceData) {
        setMyAttendanceRate(attendanceData.rate);
        setAttendanceTimes(attendanceData.times);
      } else {
        setMyAttendanceRate(0);
        setAttendanceTimes([]);
      }
    } else {
      setMyAttendanceRate(0);
      setAttendanceTimes([]);
    }
  }, [openAttendanceGroupId]);

  useEffect(() => {
    if (openMembersGroupId) {
      const mockMembers: Member[] = [
        { id: "u1", nickname: "홍길동", avatarUrl: "/avatar/user1.png" },
        { id: "u2", nickname: "김철수", avatarUrl: "/avatar/user2.png" },
        { id: "u3", nickname: "이영희", avatarUrl: "/avatar/user3.png" },
      ];
      setMembers(mockMembers);
    } else {
      setMembers([]);
    }
  }, [openMembersGroupId]);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.id} className="relative">
          {/*  그룹 카드 클릭: 출석률 다이얼로그 */}

          {/* 그룹 카드 */}
          <JoinedGroupCard
            id={group.id}
            title={group.title}
            thumbnailFileUrl={group.thumbnailFileUrl ?? ""}
            currentMemberCount={group.currentMemberCount}
            summary={group.summary}
            onClick={() => setOpenAttendanceGroupId(group.id)} //  그룹 카드 클릭 시 출석률 다이얼로그 열기
            onClickMembers={() => setOpenMembersGroupId(group.id)}
            onClickWithdraw={() =>
              console.log(`${group.title} 탈퇴하기 클릭됨`)
            }
          />

          {/* 출석률 다이얼로그 */}
          <AttendanceDialog
            open={openAttendanceGroupId === group.id}
            onOpenChange={(open) =>
              setOpenAttendanceGroupId(open ? group.id : null)
            }
            groupName={group.title}
            attendanceRate={myAttendanceRate}
            attendanceTimes={attendanceTimes}
          />

          {/* 인원 보기 다이얼로그 */}
          <MembersDialog
            open={openMembersGroupId === group.id}
            onOpenChange={(open) =>
              setOpenMembersGroupId(open ? group.id : null)
            }
            groupName={group.title}
            members={members}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      ))}
    </div>
  );
}
