"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MoonIcon,
  SunIcon,
  HamburgerMenuIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useRef, useEffect, useState } from "react";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import MainNavigation from "@/components/layout/MainNavigation";
import MobileMenu from "@/components/layout/MobileMenu";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

const meetudyGroup = [
  { href: "/study/list/seoul", title: "서울" },
  { href: "/study/list/busan", title: "부산" },
  { href: "/study/list/daegu", title: "대구" },
  { href: "/study/list/incheon", title: "인천" },
  { href: "/study/list/gwonggu", title: "광주" },
  { href: "/study/list/daejeon", title: "대전" },
  { href: "/study/list/ulsan", title: "울산" },
  { href: "/study/list/etc", title: "기타" },
];

const contactItems = [
  { href: "/contact/notice/list", title: "공지사항", description: "" },
  { href: "/contact/faq", title: "FAQ", description: "자주 묻는 질문" },
  { href: "/contact/qna", title: "QNA", description: "1:1 문의" },
];

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationOpen]);

  return (
    <header className="w-full border-b shadow-sm bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 h-20">
        {/* Logo */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {mounted && (
            <Link href="/" className="mr-4">
              <Image
                src={
                  resolvedTheme === "dark"
                    ? "/logo/meetudy-dark.png"
                    : "/logo/meetudy-light.png"
                }
                alt="Logo"
                width={100}
                height={24}
                className="object-contain"
                priority
              />
            </Link>
          )}
          {/* PC Navigation */}
          <div className="hidden md:flex">
            <MainNavigation
              meetudyGroup={meetudyGroup}
              contactItems={contactItems}
            />
          </div>
        </div>

        {/* 로그인/로그아웃 + 다크모드 + 햄버거 */}
        <div className="flex items-center space-x-6">
          <NotificationDropdown />
          {/* 내 정보 */}
          <Link
            href="/mypage"
            className="hidden md:block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm"
          >
            내 정보
          </Link>

          {/* 로그인/로그아웃 */}
          {isLoggedIn ? (
            <Button
              variant="outline"
              onClick={onLogout}
              className="hidden md:block"
            >
              로그아웃
            </Button>
          ) : (
            <div className="hidden md:flex flex-col items-end space-y-1">
              <Link href="/login">
                <Button size="sm" className="px-4 py-1.5">
                  로그인
                </Button>
              </Link>
              <Link
                href="/join"
                className="text-xs text-blue-500 hover:underline dark:text-blue-400"
              >
                회원가입 →
              </Link>
            </div>
          )}

          {/* 다크모드 토글 */}
          {mounted && resolvedTheme && (
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          )}

          {/* 햄버거 (모바일 전용) */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <Cross1Icon width={24} height={24} />
            ) : (
              <HamburgerMenuIcon width={24} height={24} />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <MobileMenu
          meetudyGroup={meetudyGroup}
          contactItems={contactItems}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          setMenuOpen={setMenuOpen}
        />
      )}
    </header>
  );
}
