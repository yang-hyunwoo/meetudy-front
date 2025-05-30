"use client";

import { useEffect } from "react";

export default function CalendarStyle() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .fc {
        background-color: transparent;
        color: inherit;
      }
      .dark .fc-theme-standard .fc-scrollgrid {
        border-color: rgba(255, 255, 255, 0.1);
      }
      .dark .fc .fc-daygrid-day-number,
      .dark .fc .fc-col-header-cell,
      .dark .fc .fc-col-header-cell-cushion,
      .dark .fc .fc-toolbar-title {
        color: #e5e7eb;
      }
      .dark .fc .fc-col-header-cell {
        background-color: #1f2937;
      }
      .fc .fc-button {
        background-color: #3b82f6;
        border: none;
        color: white;
      }
      .fc .fc-button:hover {
        background-color: #2563eb;
      }
      .fc .fc-button-primary:not(:disabled):active,
      .fc .fc-button-primary:not(:disabled).fc-button-active {
        background-color: #1d4ed8;
        color: white;
      }
      .fc-daygrid-event {
        background-color: #3b82f6; /*  파란색 배경 */
        color: white;
        padding: 2px 4px;
        border-radius: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        font-size: 0.875rem;
        max-width: 100%;
        line-height: 1.2;
        }
      .fc-event-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-word;
        display: block;
        max-width: 100%;
        line-height: 1.2;
      }
        /* 기본 (라이트모드) */
        .fc-day-sat .fc-daygrid-day-number {
        color: #3b82f6; /* 토요일 파란색 */
        }

        .fc-day-sun .fc-daygrid-day-number {
        color: #ef4444; /* 일요일 빨간색 */
        }

        /* 다크모드용 */
        .dark .fc-day-sat .fc-daygrid-day-number {
        color: #60a5fa; /* 다크 토요일: 좀 더 밝은 파란색 */
        }

        .dark .fc-day-sun .fc-daygrid-day-number {
        color: #f87171; /* 다크 일요일: 좀 더 밝은 빨간색 */
        }
        /* 헤더(요일) 색상 */
        .fc-col-header-cell.fc-day-sat .fc-col-header-cell-cushion {
        color: #3b82f6; /* 토요일 헤더 파란색 */
        }

        .fc-col-header-cell.fc-day-sun .fc-col-header-cell-cushion {
        color: #ef4444; /* 일요일 헤더 빨간색 */
        }

.fc-daygrid-day.selected-date {
  background-color: #bae6fd !important;
}
.fc-daygrid-day.selected-date .fc-daygrid-day-number {
  color: #1e3a8a !important; /* 텍스트 진하게 */
}

.selected-cell {
  background-color: #bae6fd !important;
}

.fc-theme-standard .fc-daygrid-day.selected-cell .fc-daygrid-day-number {
  color: #1e3a8a !important;
}
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
