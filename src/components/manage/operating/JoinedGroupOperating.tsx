"use client";

import { useState, useEffect } from "react";
import AttendanceDonutChart from "@/components/manage/joined/AttendanceDonutChart";
import OperatingGroupCard from "@/components/manage/operating/OperatingGroupCard";
import OperatingMemberCard from "@/components/manage/operating/OperatingMemberCard";
import PendingMemberCard from "@/components/manage/operating/PendingMemberCard";
import EndGroupCard from "@/components/manage/operating/EndGroupCard";
import { useRouter } from "next/navigation";

import { api } from "@/lib/axios";
import dayjs from "dayjs";

interface Member {
  id: string;
  memberId: string;
  nickname: string;
  thumbnailFileUrl: string;
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
  console.log(ongoingGroup);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [attendanceRate, setAttendanceRate] = useState<number>(0);
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [pendingMembers, setPendingMembers] = useState<Member[]>([]);
  const [ongoingGroupState, setOngoingGroupState] = useState<JoinedGroup[]>(
    ongoingGroup || [],
  );
  const [groupStatuses, setGroupStatuses] = useState<Record<string, boolean>>(
    {},
  );

  const router = useRouter();
  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
      router.back(); // 이전 페이지로 이동
    }
  }, [errorMessage, router]);

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

  //승인
  const handleApproveMember = async (memberId: string, id: string) => {
    const approved = pendingMembers.find((m) => m.id === id);
    if (!selectedGroupId) {
      alert("스터디 그룹이 선택되지 않았습니다.");
      return;
    }
    console.log(memberId);
    console.log(id);
    console.log(approved);
    if (approved) {
      if (confirm("승인 하시겠습니까?")) {
        try {
          const GroupMemberStatusReqDto = {
            id: id,
            studyGroupId: selectedGroupId,
            memberId: memberId,
          };
          const res = await api.put(
            "/private/study-group/operate/approve",
            GroupMemberStatusReqDto,
          );
          if (res.data.httpCode == 200) {
            setMembers((prev) => [...prev, approved]);
            setOngoingGroupState((prev) =>
              prev.map((group) =>
                group.id === selectedGroupId
                  ? {
                      ...group,
                      currentMemberCount: group.currentMemberCount + 1,
                    }
                  : group,
              ),
            );
            setPendingMembers((prev) => prev.filter((m) => m.id !== id));
            alert("승인 되었습니다.");
          }
        } catch (error) {
          alert("잠시 후 다시 시도 해주세요.");
          return;
        }
      }
    }
  };

  //승인 거절
  const handleRejectMember = async (memberId: string, id: string) => {
    if (confirm("정말 이 멤버를 거절하시겠습니까?")) {
      try {
        const GroupMemberStatusReqDto = {
          id: id,
          studyGroupId: selectedGroupId,
          memberId: memberId,
        };
        const res = await api.put(
          "/private/study-group/operate/reject",
          GroupMemberStatusReqDto,
        );
        if (res.data.httpCode == 200) {
          setPendingMembers((prev) => prev.filter((m) => m.id !== id));
          alert("거절 되었습니다.");
        }
      } catch (error) {
        alert("잠시 후 다시 시도 해주세요.");
        return;
      }
    }
  };

  const handleKickMember = async (memberId: string, id: string) => {
    if (confirm("정말 이 멤버를 강퇴하시겠습니까?")) {
      try {
        const GroupMemberStatusReqDto = {
          id: id,
          studyGroupId: selectedGroupId,
          memberId: memberId,
        };
        const res = await api.put(
          "/private/study-group/operate/kick",
          GroupMemberStatusReqDto,
        );
        if (res.data.httpCode == 200) {
          setMembers((prev) => prev.filter((member) => member.id !== id));
          setOngoingGroupState((prev) =>
            prev.map((group) =>
              group.id === selectedGroupId
                ? {
                    ...group,
                    currentMemberCount: group.currentMemberCount - 1,
                  }
                : group,
            ),
          );
          alert("강퇴 되었습니다.");
        }
      } catch (error) {
        alert("잠시 후 다시 시도 해주세요.");
        return;
      }

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

  //모집 재개/종료 버튼
  const handleToggleClose = async (groupId: string) => {
    const targetGroup = ongoingGroupState.find((group) => group.id === groupId);
    if (!targetGroup) return;
    let message = "모집을 종료 하시겠습니까?";
    if (targetGroup.status == "active") {
      message = "모집을 종료 하시겠습니까?";
    } else {
      message = " 모집을 재개 하시겠습니까?";
    }
    if (confirm(message)) {
      try {
        const res = await api.put(
          `/private/study-group/operate/${groupId}/status`,
        );
        console.log(res);
        if (res.data.httpCode == 200) {
          setOngoingGroupState((prev) =>
            prev.map((group) =>
              String(group.id) === String(groupId)
                ? {
                    ...group,
                    status: group.status === "active" ? "closed" : "active",
                  }
                : group,
            ),
          );
          if (targetGroup.status == "active") {
            alert("모집이 종료 되었습니다.");
          } else {
            alert("모집이 재개 되었습니다.");
          }
        }
      } catch (err) {
        console.error("상태 변경 실패", err);
      }
    }
  };

  const handleDelete = async (groupId: string) => {
    if (confirm("그룹을 삭제하시겠습니까?")) {
      try {
        const res = await api.put(
          `/private/study-group/operate/${groupId}/delete`,
        );
        if (res.data.httpCode === 200) {
          // 상태 업데이트 (UI에서 해당 그룹 제거)
          setOngoingGroupState((prev) =>
            prev.filter((group) => group.id !== groupId),
          );
          alert("삭제가 완료되었습니다.");
        } else {
          alert("삭제에 실패했습니다.");
        }
      } catch (err) {
        console.error("삭제 실패", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCardClick = async (groupId: string) => {
    try {
      const res = await api.get(
        `/private/study-group/operate/${groupId}/member`,
      );
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
        setMembers([]);
        setPendingMembers([]);
        setSelectedMemberId(null);
        setAttendanceRate(0);
        setAttendanceDates([]);
        return;
      }

      setSelectedGroupId(groupId);
      setLoading(true);
      // 그룹 변경할 때 이전 멤버 선택 상태 초기화
      setSelectedMemberId(null);
      setAttendanceRate(0);
      setAttendanceDates([]);

      setMembers(res.data.data.approvedList);
      setPendingMembers(res.data.data.pendingList);
    } catch (error) {
      setMembers([]);
      setPendingMembers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">운영 중인 스터디 그룹</h2>

      {/* 카드 리스트 */}
      {ongoingGroupState && ongoingGroupState.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ongoingGroupState.map((group) => (
            <OperatingGroupCard
              key={group.id}
              id={group.id}
              title={group.title}
              thumbnail={group.thumbnailFileUrl || "/images/no-image.png"}
              status={group.status}
              currentMemberCount={group.currentMemberCount}
              maxMemberCount={group.maxMemberCount}
              onClick={() => handleCardClick(group.id)}
              onEdit={() => {
                alert("수정");
              }}
              onDelete={() => {
                handleDelete(group.id);
              }}
              onToggleClose={() => handleToggleClose(group.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          운영 중인 스터디 그룹이 없습니다.
        </div>
      )}

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
                  avatarUrl={member.thumbnailFileUrl || "/images/no-image.png"}
                  onClick={() => handleMemberClick(member.memberId)}
                  onKick={() => handleKickMember(member.memberId, member.id)}
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
                avatarUrl={member.thumbnailFileUrl || "/images/no-image.png"}
                onApprove={() =>
                  handleApproveMember(member.memberId, member.id)
                }
                onReject={() => handleRejectMember(member.memberId, member.id)}
              />
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 mt-4">종료 된 스터디 그룹</h2>
      {/* 카드 리스트 */}

      {endGroup && endGroup.length > 0 ? (
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
      ) : (
        <div className="text-center text-muted-foreground py-10">
          종료된 스터디 그룹이 없습니다.
        </div>
      )}
    </div>
  );
}
