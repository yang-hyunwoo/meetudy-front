"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface User {
  memberId: number;
  name: string;
  nickname: string;
  thumbnailFileUrl?: string;
  online?: boolean;
}

interface UserListSidebarProps {
  users: User[];
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onDmClick: (user: User) => void;
}

export default function UserListSidebar({
  users,
  showSidebar,
  onToggleSidebar,
  onDmClick,
}: UserListSidebarProps) {
  const currentUserId = useCurrentUser()?.id;
  return (
    <>
      {/*  모바일 토글 버튼 */}
      {!showSidebar && (
        <Button
          className="md:hidden absolute top-2 left-2 z-20"
          size="sm"
          variant="outline"
          onClick={onToggleSidebar}
        >
          사용자 목록
        </Button>
      )}

      {/*  모바일 사이드바 오버레이 */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/*  실제 사용자 목록 사이드바 */}
      <aside
        className={`
        fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-muted border-r p-4
        transition-transform duration-300 z-10
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 overflow-y-auto
      `}
      >
        <div className="font-bold text-center mb-4">사용자</div>
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={user.memberId}
              className="flex items-center gap-3 p-2 bg-white dark:bg-zinc-800 rounded shadow-sm"
            >
              {/* 아바타 */}
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={user.thumbnailFileUrl || undefined}
                  alt={user.name}
                />
                <AvatarFallback>{user.nickname[0]}</AvatarFallback>
              </Avatar>

              {/* 닉네임 + 이름 */}
              <div className="flex flex-col text-xs">
                <span className="font-medium">{user.nickname}</span>
                <span className="text-gray-500">{user.name}</span>
              </div>

              {/* ⋮ 버튼으로 쪽지보내기 Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-xs"
                  >
                    ⋮
                  </Button>
                </PopoverTrigger>
                {user.memberId !== currentUserId && (
                  <PopoverContent className="w-36 p-2 text-sm">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        onDmClick(user);
                      }}
                    >
                      쪽지 보내기
                    </Button>
                  </PopoverContent>
                )}
              </Popover>

              {/* 온라인/오프라인 상태 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={`w-2 h-2 rounded-full ${user.online ? "bg-green-500" : "bg-gray-400"}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.online ? "온라인" : "오프라인"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
