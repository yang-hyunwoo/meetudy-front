"use client";

import { useState, useEffect } from "react";
import JoinedGroupCard from "@/components/manage/joined/JoinedGroupCard";
import AttendanceDialog from "@/components/manage/joined/AttendanceDialog";
import MembersDialog from "@/components/manage/joined/MembersDialog";
import { api } from "@/lib/axios";
import dayjs from "dayjs";
import { useAuthContext } from "@/context/AuthContext";

interface Member {
  memberId: string;
  nickname: string;
  thumbnailFileUrl?: string;
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

interface attendanceList {
  attendanceAt: Date;
  status?: string;
}

interface JoinedGroupListProps {
  groups: JoinedGroup[];
}

export default function JoinedGroupList({ groups }: JoinedGroupListProps) {
  const [openAttendanceGroupId, setOpenAttendanceGroupId] = useState<
    string | null
  >(null);
  const [openMembersGroupId, setOpenMembersGroupId] = useState<string | null>(
    null,
  );
  const { isLoggedIn } = useAuthContext();
  const [myAttendanceRate, setMyAttendanceRate] = useState<number>(0);
  const [attendanceTimes, setAttendanceTimes] = useState<attendanceList[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [groupList, setGroupList] = useState(groups);
  useEffect(() => {
    if (openAttendanceGroupId) {
      groupMemberRate();
    } else {
      setMyAttendanceRate(0);
      setAttendanceTimes([]);
    }
  }, [openAttendanceGroupId]);

  useEffect(() => {
    setGroupList(groups);
  }, [groups]);

  const groupMemberRate = async () => {
    const res = await api.get(
      `/private/study-group/join/member/${openAttendanceGroupId}/rate`,
    );
    if (res.data.httpCode === 200) {
      setMyAttendanceRate(res.data.data.rate);
      setAttendanceTimes(res.data.data.attendanceList);
    } else {
      setMyAttendanceRate(0);
    }
  };
  const memberWidthdraw = async (groupId: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 가능 합니다.");
      return;
    }

    if (!confirm("그룹을 탈퇴 하시겠습니까?")) return;
    try {
      const res = await api.put(
        `/private/study-group/join/member/${groupId}/withdraw`,
      );
      if (res.data.httpCode == 200) {
        alert("탈퇴되었습니다.");
        setGroupList((prev) => prev.filter((g) => g.id !== groupId));
      }
    } catch (error: any) {
      alert(error.response.data?.errCodeMsg);
    }
  };
  useEffect(() => {
    if (openMembersGroupId) {
      groupMemberList();
    } else {
      setMembers([]);
    }
  }, [openMembersGroupId]);

  const groupMemberList = async () => {
    const res = await api.get(
      `/private/study-group/join/member/${openMembersGroupId}/list`,
    );
    if (res.data.httpCode === 200) {
      setMembers(res.data.data);
    } else {
      setMembers([]);
    }
  };

  return (
    <div className="space-y-6">
      {groupList.map((group) => (
        <div key={group.id} className="relative">
          {/*  그룹 카드 클릭: 출석률 다이얼로그 */}

          {/* 그룹 카드 */}
          <JoinedGroupCard
            id={group.id}
            title={group.title}
            thumbnailFileUrl={group.thumbnailFileUrl ?? ""}
            currentMemberCount={group.currentMemberCount}
            summary={group.summary}
            onClick={() => setOpenAttendanceGroupId(group.id)}
            onClickMembers={() => setOpenMembersGroupId(group.id)}
            onClickWithdraw={() => memberWidthdraw(group.id)}
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
