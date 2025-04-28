"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import ListItem from "@/components/layout/ListItem";
import clsx from "clsx";

interface MainNavigationProps {
  meetudyGroup: { href: string; title: string }[];
  contactItems: { href: string; title: string; description: string }[];
}

export default function MainNavigation({
  meetudyGroup,
  contactItems,
}: MainNavigationProps) {
  const isShortMeetudyGroupList = meetudyGroup.length <= 3;
  const isShortList = contactItems.length <= 3;

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-nowrap space-x-6">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              meetudy란?
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>meetudy 그룹</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className={clsx(
                "grid list-none p-6",
                isShortMeetudyGroupList
                  ? "grid-cols-1 gap-3 min-w-[300px]"
                  : "sm:w-[600px] sm:grid-flow-col sm:grid-rows-3 gap-x-2.5",
              )}
            >
              {meetudyGroup.map((item, index) => (
                <ListItem
                  key={`${item.href}-${index}`}
                  href={item.href}
                  title={item.title}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>그룹 관리</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid list-none p-6 grid-cols-1 gap-3 min-w-[300px]">
              <ListItem href="/group/manage/operating" title="운영중인 그룹" />
              <ListItem href="/group/manage/joined" title="참여중인 그룹" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>문의</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className={clsx(
                "grid list-none p-6",
                isShortList
                  ? "grid-cols-1 gap-3 min-w-[300px]"
                  : "sm:w-[600px] sm:grid-flow-col sm:grid-rows-3 gap-x-2.5",
              )}
            >
              {contactItems.map((item, index) => (
                <ListItem
                  key={`${item.href}-${index}`}
                  href={item.href}
                  title={item.title}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/board/list"
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              자유게시판
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
