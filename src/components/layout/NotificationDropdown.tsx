"use client";

import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Notification {
  id: number;
  text: string;
  href: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "📢 새 공지가 있습니다.", href: "/notice" },
    {
      id: 2,
      text: "✅ 새로운 가입 요청이 있습니다.",
      href: "/group/manage/joined",
    },
    { id: 3, text: "📬 답변이 등록되었습니다.", href: "/contact/qna" },
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNotificationClick = (id: number, href: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    window.location.href = href;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
      </button>
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
        {notifications.length}
      </span>

      {notificationOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNotificationClick(item.id, item.href)}
                className="block w-full text-left px-4 py-3 text-[14px] text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 border-b last:border-0"
              >
                {item.text}
              </button>
            ))
          ) : (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              알림이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
