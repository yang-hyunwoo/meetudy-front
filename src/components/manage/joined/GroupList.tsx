"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

interface DayList {
  groupId: string;
  groupName: string;
  groupImageUrl: string;
  nextMeeting: string;
  attended?: String;
  endMeeting?: string;
}

interface GroupListProps {
  groups: DayList[];
}

export default function GroupList({ groups }: GroupListProps) {
  const now = new Date();
  const [nowTime, setNowTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(new Date());
    }, 30 * 1000); // 30초마다 현재 시간 갱신

    return () => clearInterval(interval); // 언마운트 시 정리
  }, []);

  const handleEnter = async (groupId: string) => {
    try {
      const StudyGroupAttendanceReqDto = {
        studyGroupId: groupId,
      };
      // 1. 출석 체크 API 호출
      await api.post(`/private/attendance/chk`, StudyGroupAttendanceReqDto);

      // 2. 채팅방으로 이동
      router.push(`/study/group/${groupId}/room`);
    } catch (error: any) {
      alert(error.response?.data.message);
      // 필요 시 에러 메시지 띄우기
    }
  };

  return (
    <div className="space-y-8">
      {groups.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          📭 금일 예정된 스터디가 없습니다.
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-left">
            ⏰ 입장은 시작 시간 기준 <strong>1시간 전부터</strong> 가능합니다.
          </div>
          {groups.map((group) => {
            const meetingStartDate = new Date(group.nextMeeting);
            const meetingEndDate = group.endMeeting
              ? new Date(group.endMeeting)
              : null;

            const oneHourBeforeStart = new Date(
              meetingStartDate.getTime() - 60 * 60 * 1000,
            ); // 시작 1시간 전
            const tenMinutesAfterEnd = meetingEndDate
              ? new Date(meetingEndDate.getTime() + 10 * 60 * 1000)
              : null; // 종료 10분 후

            const canEnter =
              now >= oneHourBeforeStart &&
              (tenMinutesAfterEnd ? now <= tenMinutesAfterEnd : true);

            const dateStartStr = `${meetingStartDate.getMonth() + 1}/${meetingStartDate.getDate()} ${meetingStartDate.getHours()}:${String(meetingStartDate.getMinutes()).padStart(2, "0")}`;
            const dataEndStr = meetingEndDate
              ? `${meetingEndDate.getHours()}:${String(meetingEndDate.getMinutes()).padStart(2, "0")}`
              : "미정";
            return (
              <div
                key={group.groupId + "_" + group.nextMeeting}
                className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow"
              >
                {group.groupImageUrl ? (
                  <Image
                    src={group.groupImageUrl}
                    alt={group.groupName}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <Image
                    src="/images/no-image.png"
                    alt="기본 썸네일"
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                )}

                <div className="flex-1 w-full text-center md:text-left">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {group.groupName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    모임 시간: {dateStartStr} ~ {dataEndStr}
                  </div>
                  <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                    참여 상태: 참여 상태:{" "}
                    {group.attended === "PRESENT"
                      ? "✔️ 출석완료"
                      : group.attended === "ABSENT"
                        ? "❌ 결석"
                        : group.attended === "LATE"
                          ? "⚠️ 지각"
                          : "❌ 출석전"}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  {canEnter ? (
                    <Button
                      size="sm"
                      onClick={() => handleEnter(group.groupId)}
                    >
                      입장하기
                    </Button>
                  ) : (
                    // <Button size="sm" onClick={() => handleEnter(group.groupId)}>
                    //   입장하기
                    // </Button>
                    <Button size="sm" disabled variant="secondary">
                      입장 불가
                    </Button>
                  )}
                  <Link href={`/study/group/${group.groupId}`}>
                    <Button size="sm" variant="ghost">
                      상세보기
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
