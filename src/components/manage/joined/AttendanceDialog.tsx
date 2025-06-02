"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AttendanceDonutChart from "@/components/manage/joined/AttendanceDonutChart";
import dayjs from "dayjs";

interface attendanceList {
  attendanceAt: Date;
  status?: string;
}

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  attendanceRate: number;
  attendanceTimes: attendanceList[];
}

export default function AttendanceDialog({
  open,
  onOpenChange,
  groupName,
  attendanceRate,
  attendanceTimes,
}: AttendanceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{groupName} 출석 정보</DialogTitle>
        </DialogHeader>

        <div className="mt-6 mb-8">
          <AttendanceDonutChart rate={attendanceRate} />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            출석한 시간
          </h3>

          {attendanceTimes.length > 0 ? (
            <>
              <ul className="space-y-2">
                {attendanceTimes.slice(0, 10).map((time, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {dayjs(time.attendanceAt).format("YYYY.MM.DD HH:mm")}
                    &nbsp;&nbsp; [
                    {time.status === "PRESENT"
                      ? "✔️ 출석완료"
                      : time.status === "ABSENT"
                        ? "❌ 결석"
                        : time.status === "LATE"
                          ? "⚠️ 지각"
                          : "❌ 출석전"}
                    ]
                  </li>
                ))}
              </ul>

              {/* 안내 문구 추가 */}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                * 최근 출석 기준 최대 10건까지만 표시됩니다.
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              출석 기록이 없습니다.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
