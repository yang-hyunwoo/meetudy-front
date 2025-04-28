"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import GroupList from "./GroupList";
import JoinedGroupList from "./JoinedGroupList";
import CalendarStyle from "./CalendarStyle";
import { useMemo } from "react";
import RequestedGroupList from "./RequestedGroupList"; // ✅ 추가
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // ✅ 탭 관련 추가

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

const mockGroupEvents: GroupEvent[] = [
  {
    groupId: "g1",
    groupName: "리액트 스터디",
    groupImageUrl: "/thumb/react.png",
    nextMeeting: "2025-04-30T19:00:00",
    endMeeting: "2025-04-30T21:00:00",
    status: { attended: true, missionSubmitted: false },
  },
  {
    groupId: "g3",
    groupName: "리액트 스터디",
    groupImageUrl: "/thumb/react.png",
    nextMeeting: "2025-04-23T19:00:00",
    endMeeting: "2025-04-23T21:00:00",
    status: { attended: true, missionSubmitted: false },
  },
  {
    groupId: "g4",
    groupName: "리액트 스터디",
    groupImageUrl: "/thumb/react.png",
    nextMeeting: "2025-04-26T21:00:00",
    endMeeting: "2025-04-26T22:00:00",
    status: { attended: true, missionSubmitted: false },
  },
  {
    groupId: "g2",
    groupName: "자료구조 스터디",
    groupImageUrl: "/thumb/data.png",
    nextMeeting: "2025-05-01T20:00:00",
    endMeeting: "2025-05-01T22:00:00",
    status: { attended: false, missionSubmitted: true },
  },
];

const joinedGroups = [
  {
    id: "g1",
    name: "리액트 스터디",
    thumbnail: "/thumb/react.png",
    memberCount: 15,
    description: "리액트를 공부하는 스터디입니다.",
  },
  {
    id: "g2",
    name: "자료구조 스터디",
    thumbnail: "/thumb/data.png",
    memberCount: 20,
    description: "자료구조를 깊게 공부하는 모임입니다.",
  },
];

const requestedGroups = [
  {
    id: "r1",
    name: "알고리즘 스터디",
    thumbnail: "/thumb/algorithm.png",
    memberCount: 8,
    description: "알고리즘 문제를 함께 풉니다.",
  },
  {
    id: "r2",
    name: "CS 전공 스터디",
    thumbnail: "/thumb/cs.png",
    memberCount: 10,
    description: "전산학 전공 과목을 공부합니다.",
  },
];

export default function GroupCalendarPage() {
  const calendarEvents = useMemo(() => {
    return mockGroupEvents.map((g) => ({
      title: g.groupName,
      start: g.nextMeeting,
      end: g.endMeeting,
      extendedProps: g,
      display: "auto",
      titleAttr: g.groupName,
    }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">📅 참여 중인 스터디</h1>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="calendar">참여 중인 일정</TabsTrigger>
          <TabsTrigger value="groups">참여 중인 그룹 목록</TabsTrigger>
          <TabsTrigger value="requests">승인 요청 그룹 목록</TabsTrigger>{" "}
          {/* ✅ 추가 */}
        </TabsList>

        {/* 참여 중인 일정 탭 */}
        <TabsContent value="calendar">
          <CalendarStyle />
          <div className="mb-12 bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                start: "prev,next today",
                center: "title",
                end: "dayGridMonth,timeGridWeek",
              }}
              buttonText={{
                today: "오늘",
                month: "월",
                week: "주",
              }}
              locale={koLocale}
              events={calendarEvents}
              height="auto"
              dayMaxEventRows={true}
              eventDisplay="block"
              eventColor="#3b82f6"
              eventTextColor="#ffffff"
              views={{
                timeGridWeek: {
                  type: "timeGridWeek",
                  slotMinTime: "00:00:00",
                  slotMaxTime: "24:00:00",
                },
              }}
            />
          </div>

          {/* 그룹별 입장 리스트 */}
          <GroupList groups={mockGroupEvents} />
        </TabsContent>

        {/* 참여 중인 그룹 목록 탭 */}
        <TabsContent value="groups">
          <h2 className="text-xl font-bold mb-4">✨ 참여 중인 그룹 목록</h2>
          <JoinedGroupList groups={joinedGroups} />
        </TabsContent>

        {/* 승인 요청 그룹 목록 탭 */}
        <TabsContent value="requests">
          <h2 className="text-xl font-bold mb-4">🚀 승인 요청한 그룹 목록</h2>
          <RequestedGroupList
            groups={requestedGroups}
            onCancelRequest={(id) => {
              console.log("요청 취소 클릭:", id);
              // 여기서 요청 취소 API 호출하거나, 상태 업데이트 하면 됩니다
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
