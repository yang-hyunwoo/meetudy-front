"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GroupEvent {
  groupId: string;
  groupName: string;
  groupImageUrl: string;
  nextMeeting: string;
  status: {
    attended: boolean;
    missionSubmitted: boolean;
  };
  endMeeting?: string;
}

interface GroupListProps {
  groups: GroupEvent[];
}

export default function GroupList({ groups }: GroupListProps) {
  const now = new Date();

  return (
    <div className="space-y-8">
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
          (tenMinutesAfterEnd ? now <= tenMinutesAfterEnd : true); // endMeeting 없으면 무조건 true

        const dateStr = `${meetingStartDate.getMonth() + 1}/${meetingStartDate.getDate()} ${meetingStartDate.getHours()}:${String(meetingStartDate.getMinutes()).padStart(2, "0")}`;

        return (
          <div
            key={group.groupId}
            className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow"
          >
            <Image
              src={group.groupImageUrl}
              alt={group.groupName}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <div className="flex-1 w-full text-center md:text-left">
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {group.groupName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                모임 시간: {dateStr}
              </div>
              <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                참여 상태:
                {group.status.attended ? " ✔️ 출석완료" : " ❌ 출석전"}
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {canEnter ? (
                <Link href={`/study/group/room`}>
                  <Button size="sm">입장하기</Button>
                </Link>
              ) : (
                <Link href={`/study/group/room`}>
                  <Button size="sm">입장하기</Button>
                </Link>
                // <Button size="sm" disabled variant="secondary">입장 불가</Button>
              )}
              <Button size="sm" variant="ghost">
                상세보기
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
