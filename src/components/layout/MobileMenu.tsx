"use client";

import Link from "next/link";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  meetudyGroup: { href: string; title: string }[];
  contactItems: { href: string; title: string; description: string }[];
  isLoggedIn: boolean;
  onLogout?: () => void;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileMenu({
  meetudyGroup,
  contactItems,
  isLoggedIn,
  onLogout,
  setMenuOpen,
}: MobileMenuProps) {
  const [openSubMenu, setOpenSubMenu] = useState<"group" | "contact" | null>(
    null,
  );

  const toggleSubMenu = (menu: "group" | "contact") => {
    setOpenSubMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 px-6 py-4 space-y-4 border-t">
      <div className="flex flex-col space-y-2">
        <Link
          href="/about"
          onClick={() => setMenuOpen(false)}
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          meetudy란?
        </Link>

        {/* meetudy 그룹 */}
        <button
          onClick={() => toggleSubMenu("group")}
          className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300"
        >
          meetudy 그룹
          <ChevronDownIcon
            className={clsx(
              "transition-transform",
              openSubMenu === "group" && "rotate-180",
            )}
          />
        </button>
        {openSubMenu === "group" && (
          <div className="ml-4 flex flex-col space-y-1">
            {meetudyGroup.map((item, index) => (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm"
              >
                {item.title}
              </Link>
            ))}
          </div>
        )}

        {/* 그룹 관리 */}
        <Link
          href="/group/manage/operating"
          onClick={() => setMenuOpen(false)}
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          운영중인 그룹
        </Link>
        <Link
          href="/group/manage/joined"
          onClick={() => setMenuOpen(false)}
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          참여중인 그룹
        </Link>

        {/* 문의 */}
        <button
          onClick={() => toggleSubMenu("contact")}
          className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300"
        >
          문의
          <ChevronDownIcon
            className={clsx(
              "transition-transform",
              openSubMenu === "contact" && "rotate-180",
            )}
          />
        </button>
        {openSubMenu === "contact" && (
          <div className="ml-4 flex flex-col space-y-1">
            {contactItems.map((item, index) => (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm"
              >
                {item.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 로그인/로그아웃 + 내정보 (모바일) */}
      <div className="pt-4 border-t space-y-2">
        <Link
          href="/mypage"
          onClick={() => setMenuOpen(false)}
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          내 정보
        </Link>
        {isLoggedIn ? (
          <Button
            variant="outline"
            onClick={() => {
              onLogout?.();
              setMenuOpen(false);
            }}
            className="w-full"
          >
            로그아웃
          </Button>
        ) : (
          <>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button className="w-full">로그인</Button>
            </Link>
            <Link
              href="/join"
              onClick={() => setMenuOpen(false)}
              className="block text-center text-xs text-blue-500 hover:underline dark:text-blue-400 pt-2"
            >
              회원가입 →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
