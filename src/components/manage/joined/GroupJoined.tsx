"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import JoinedGroupList from "./JoinedGroupList";
import CalendarStyle from "./CalendarStyle";
import { useMemo, useState, useRef, useEffect } from "react";
import RequestedGroupList from "./RequestedGroupList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/axios";
import GroupList from "./GroupList";

interface DayList {
  groupId: string;
  groupName: string;
  groupImageUrl: string;
  nextMeeting: string;
  attended?: string;
  endMeeting?: string;
}

interface monthList {
  groupId: string;
  groupName: string;
  nextMeeting: string;
  endMeeting?: string;
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
  const [monthLists, setMonthLists] = useState<monthList[]>([]);
  const [dayLists, setDayLists] = useState<DayList[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const calendarRef = useRef<FullCalendar | null>(null);
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);
  const [ongoingGroup, setOngoingGroup] = useState<JoinedGroup[]>([]);
  const [endGroup, setEndGroup] = useState<JoinedGroup[]>([]);
  useEffect(() => {
    if (calendarRef.current) {
      (calendarRef.current?.getApi() as any).render();
    }
  }, [selectedDate]);

  useEffect(() => {
    groupList();
  }, []);

  const groupList = async () => {
    const res = await api.get("/private/study-group/operate/list");
    if (res.data.httpCode === 200) {
      console.log(res.data.data);
      setOngoingGroup(res.data.data.ongoingGroup);
    } else {
      setOngoingGroup([]);
    }
  };

  useEffect(() => {
    if (currentMonth != "") {
      monthList();
    }
  }, [currentMonth]);

  useEffect(() => {
    if (selectedDate != null) {
      dayList();
    }
  }, [selectedDate]);

  const monthList = async () => {
    const params: any = {
      scheduleDate: currentMonth,
    };

    const res = await api.get("/private/study-group/join/month/list", {
      params,
    });
    if (res.data.httpCode === 200) {
      setMonthLists(res.data.data);
    } else {
      setMonthLists([]);
    }
  };
  const dayList = async () => {
    const params: any = {
      scheduleDate: selectedDate,
    };
    const res = await api.get("/private/study-group/join/day/list", {
      params,
    });
    if (res.data.httpCode === 200) {
      setDayLists(res.data.data);
    } else {
      setDayLists([]);
    }
  };

  const weekList = async (startDate: any, endDate: any) => {
    const params: any = {
      startDate: startDate,
      endDate: endDate,
    };
    const res = await api.get("/private/study-group/join/week/list", {
      params,
    });
    if (res.data.httpCode === 200) {
      setDayLists(res.data.data);
    } else {
      setDayLists([]);
    }
  };

  const fetchWeekList = (startDate: any, endDate: any) => {
    weekList(startDate, endDate);
  };

  const calendarEvents = useMemo(() => {
    return monthLists.map((g) => ({
      title: g.groupName,
      start: g.nextMeeting,
      end: g.endMeeting,
      extendedProps: g,
      display: "auto",
      titleAttr: g.groupName,
    }));
  }, [monthLists]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">📅 참여 중인 스터디</h1>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="calendar">참여 중인 일정</TabsTrigger>
          <TabsTrigger value="groups">참여 중인 그룹 목록</TabsTrigger>
          <TabsTrigger value="requests">승인 요청 그룹 목록</TabsTrigger>{" "}
          {/*  추가 */}
        </TabsList>

        {/* 참여 중인 일정 탭 */}
        <TabsContent value="calendar">
          <CalendarStyle />
          <div className="mb-12 bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden p-4">
            <FullCalendar
              ref={calendarRef}
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
              dateClick={(info) => {
                const currentView = info.view.type;
                const clickedDate = info.dateStr.split("T")[0];
                if (currentView === "dayGridMonth") {
                  setSelectedDate(clickedDate);
                }
              }}
              datesSet={(arg) => {
                const viewType = arg.view.type;

                const year = arg.view.currentStart.getFullYear();
                const month = (arg.view.currentStart.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const monthZeroBased = arg.view.currentStart.getMonth();
                const formattedMonth = `${year}-${month}`;
                setCurrentMonth(formattedMonth);
                if (viewType === "dayGridMonth") {
                  // 해당 월의 1일로 selectedDate 설정
                  const firstDate = new Date(year, monthZeroBased, 1); // 1일
                  const firstDateStr = firstDate.toLocaleDateString("sv-SE"); // yyyy-mm-dd

                  const todayStr = new Date().toISOString().split("T")[0];
                  const startStr = arg.start.toISOString().split("T")[0];
                  const endStr = arg.end.toISOString().split("T")[0];
                  if (startStr <= todayStr && todayStr <= endStr) {
                    setSelectedDate(todayStr); // 오늘 버튼 눌렀을 때 처리
                  } else {
                    setSelectedDate(firstDateStr);
                  }
                }

                if (viewType === "timeGridWeek") {
                  const startStr = arg.start.toLocaleDateString("sv-SE");
                  const endDate = new Date(arg.end);
                  endDate.setDate(endDate.getDate() - 1); // 하루 빼기
                  const endStr = endDate.toLocaleDateString("sv-SE");
                  fetchWeekList(startStr, endStr);
                }
              }}
              dayCellClassNames={(arg) => {
                const dateStr = arg.date.toLocaleDateString("sv-SE");
                const viewType = calendarRef.current?.getApi().view.type;

                if (viewType === "dayGridMonth" && selectedDate === dateStr) {
                  return ["selected-cell"];
                }
                return [];
              }}
            />
          </div>

          {/* 그룹별 입장 리스트 */}
          <GroupList groups={dayLists} />
        </TabsContent>

        {/* 참여 중인 그룹 목록 탭 */}
        <TabsContent value="groups">
          <h2 className="text-xl font-bold mb-4">✨ 참여 중인 그룹 목록</h2>
          <JoinedGroupList groups={ongoingGroup} />
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
