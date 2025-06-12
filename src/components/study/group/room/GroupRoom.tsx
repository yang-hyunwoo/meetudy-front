"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import NoticeTab from "@/components/study/group/room/NoticeTab";
import FilesTab from "@/components/study/group/room/FilesTab";
import LinksTab from "@/components/study/group/room/LinksTab";
import LateUsersTab from "@/components/study/group/room/LateUsersTab";
import MobileTabModal from "@/components/study/group/room/MobileTabModal";
import UserListSidebar from "@/components/study/group/room/UserListSidebar";
import DMModal from "@/components/study/group/room/DMModal";
import { useChatSocket } from "@/hooks/useChatSocket";
import ChatInput from "./ChatInput";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { api } from "@/lib/axios";

interface User {
  memberId: number;
  name: string;
  nickname: string;
  thumbnailFileUrl?: string;
  online?: boolean;
  isLate?: boolean;
}

//TODO : 간혈적으로 ON/OFF 오류가 나는듯 함

export default function GroupRoomLayout() {
  dayjs.locale("ko");
  const [activeSideTab, setActiveSideTab] = useState<
    "notice" | "files" | "links" | "late"
  >("notice");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [validLinks, setValidLinks] = useState<string[]>([]);
  const [notices, setNotices] = useState<string[]>([]);
  const [newNotice, setNewNotice] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [currentMobileTab, setCurrentMobileTab] = useState<
    "notice" | "files" | "links" | "late"
  >("notice");
  const params = useParams();
  const studyGroupId = Number(params.id);
  const [pendingOnlineIds, setPendingOnlineIds] = useState<
    number[] | number | null
  >(null);
  const [users, setUsers] = useState<User[]>([]);

  // DM용 상태
  const [dmModalOpen, setDmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dmMessage, setDmMessage] = useState("");
  const hasFetchedRef = useRef(false);
  const lateUsers = users.filter((user) => user.isLate);
  const currentUserId = useCurrentUser()?.id;
  const chatWrapperRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  /**채팅방 접속  */
  const handleUserEnter = useCallback((incomingIds: number[] | number) => {
    setUsers((prevUsers) => {
      if (!prevUsers || prevUsers.length === 0) {
        console.warn(" users 아직 초기화 안됨");
        setPendingOnlineIds(incomingIds);
        return prevUsers;
      }

      if (Array.isArray(incomingIds)) {
        const onlineSet = new Set(incomingIds.map(String));
        return prevUsers.map((user) => {
          const isOnline = onlineSet.has(String(user.memberId));
          return { ...user, online: isOnline };
        });
      } else {
        return prevUsers.map((user) =>
          String(user.memberId) === String(incomingIds)
            ? { ...user, online: true }
            : user,
        );
      }
    });
  }, []);

  const {
    messages,
    sendMessage,
    fetchMoreMessages,
    hasMore,
    isInitialLoadDone,
  } = useChatSocket(studyGroupId, handleUserEnter);

  useEffect(() => {
    if (users.length > 0 && pendingOnlineIds !== null) {
      console.log("✅ 대기 중이던 온라인 유저 반영");
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;
      handleUserEnter(pendingOnlineIds);
      setPendingOnlineIds(null);
    }
  }, [users, pendingOnlineIds]);

  useEffect(() => {
    console.log(
      "🟡 users state updated",
      users.map((u) => [u.memberId, u.online]),
    );
  }, [users]);

  useEffect(() => {
    const memberList = async () => {
      try {
        const res = await api.get(`/private/chat/${studyGroupId}/member/list`);
        setUsers(res.data.data);
      } catch (err: any) {
        if (err.response.data.errCode) {
        }
      } finally {
      }
    };
    memberList();
  }, [studyGroupId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  //링크 유효성
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  //채팅 스크롤 이벤트
  const scrollToBottom = () => {
    const wrapper = chatWrapperRef.current;
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  };

  //링크 등록
  const handleAddLink = () => {
    if (!isValidUrl(linkInput)) {
      alert("유효하지 않은 링크입니다.");
      return;
    }
    setValidLinks((prev) => [...prev, linkInput]);
    setLinkInput("");
  };

  const handleSendDM = () => {
    if (!selectedUser || dmMessage.trim() === "") {
      alert("메시지를 입력해주세요.");
      return;
    }

    console.log(`👉 ${selectedUser.nickname} 에게 쪽지 전송:`, dmMessage);

    // 쪽지 전송 후 초기화
    setDmModalOpen(false);
    setDmMessage("");
    setSelectedUser(null);
  };

  const handleAddNotice = () => {
    if (newNotice.trim() === "") return;
    setNotices((prev) => [...prev, newNotice.trim()]);
    setNewNotice("");
  };

  const handleDeleteNotice = (index: number) => {
    setNotices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditNotice = (index: number) => {
    setEditingIndex(index);
    setEditingText(notices[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || editingText.trim() === "") return;
    const updated = [...notices];
    updated[editingIndex] = editingText.trim();
    setNotices(updated);
    setEditingIndex(null);
    setEditingText("");
  };

  useEffect(() => {
    if (isInitialLoadDone) {
      setTimeout(() => {
        if (chatWrapperRef.current) {
          chatWrapperRef.current.scrollTop =
            chatWrapperRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [isInitialLoadDone]);

  const handleScroll = useCallback(async () => {
    const wrapper = chatWrapperRef.current;
    if (!wrapper || !hasMore || !isInitialLoadDone) return;

    if (isFetchingRef.current) return;

    if (wrapper.scrollTop < 50) {
      isFetchingRef.current = true;
      const prevScrollHeight = wrapper.scrollHeight;

      await fetchMoreMessages();

      requestAnimationFrame(() => {
        wrapper.scrollTop = wrapper.scrollHeight - prevScrollHeight;
        isFetchingRef.current = false;
      });
    }
  }, [fetchMoreMessages, hasMore, isInitialLoadDone]);

  useEffect(() => {
    const wrapper = chatWrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener("scroll", handleScroll);
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] border rounded-lg overflow-hidden relative">
        {/*  사용자 목록 사이드바 */}
        <UserListSidebar
          users={users}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onDmClick={(user) => {
            setSelectedUser(null);
            setDmModalOpen(true);
          }}
        />
        {/*  메인 채팅 영역 */}
        <main className="flex-1 w-full flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
          <Tabs
            defaultValue="chat"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsContent
              value="chat"
              className="flex-1 overflow-y-auto p-4 space-y-2"
              ref={chatWrapperRef}
            >
              {messages.map((m, i) => {
                const isMine = m.senderId === currentUserId;
                const prevMessage = messages[i - 1];
                const showDate =
                  i === 0 ||
                  !dayjs(m.sentAt).isSame(dayjs(prevMessage.sentAt), "day");
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isMine ? "items-end" : "items-start"} space-y-1`}
                  >
                    {showDate && (
                      <div className="text-sm text-muted-foreground my-2 text-center w-full">
                        📅 {dayjs(m.sentAt).format("YYYY년 MM월 DD일 ddd요일")}
                      </div>
                    )}
                    {/* 상대 메시지일 경우 닉네임 표시 */}
                    {!isMine && (
                      <span className="text-sm font-semibold text-muted-foreground">
                        {m.nickname}
                      </span>
                    )}

                    {/* 메시지 말풍선 */}
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg shadow ${
                        isMine
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                    >
                      <div className="text-base">{m.message}</div>
                    </div>

                    {/* 날짜는 항상 아래 */}
                    <span className="text-xs text-muted-foreground px-1">
                      {dayjs(m.sentAt).format("HH:mm")}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </TabsContent>
          </Tabs>

          {/*  채팅 입력창 */}
          <ChatInput
            onSend={(message) => {
              sendMessage(message);
              // 약간의 딜레이 후 스크롤
              setTimeout(scrollToBottom, 100);
            }}
          />
        </main>

        {/* PC 전용 사이드 탭 */}
        <aside className="hidden md:flex flex-col w-80 border-l bg-muted p-4 text-sm">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {["notice", "files", "links", "late"].map((tab) => (
              <Button
                key={tab}
                variant={activeSideTab === tab ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setActiveSideTab(tab as any)}
              >
                {tab === "notice" && "공지"}
                {tab === "files" && "자료"}
                {tab === "links" && "링크"}
                {tab === "late" && "지각"}
              </Button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 rounded p-3 shadow-inner">
            {activeSideTab === "notice" && (
              <NoticeTab
                notices={notices}
                newNotice={newNotice}
                editingIndex={editingIndex}
                editingText={editingText}
                onNewNoticeChange={setNewNotice}
                onAddNotice={handleAddNotice}
                onEditNotice={handleEditNotice}
                onDeleteNotice={handleDeleteNotice}
                onEditingTextChange={setEditingText}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => setEditingIndex(null)}
              />
            )}
            {activeSideTab === "files" && (
              <FilesTab
                uploadedFiles={uploadedFiles}
                onFileChange={handleFileChange}
              />
            )}
            {activeSideTab === "links" && (
              <LinksTab
                validLinks={validLinks}
                linkInput={linkInput}
                onLinkInputChange={setLinkInput}
                onAddLink={handleAddLink}
              />
            )}
            {activeSideTab === "late" && <LateUsersTab lateUsers={users} />}
          </div>
        </aside>

        {/*  모바일 하단 탭 바 */}
        <div className="fixed bottom-0 left-0 w-full md:hidden flex bg-white dark:bg-zinc-900 border-t">
          {["notice", "files", "links", "late"].map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className="flex-1 rounded-none text-xs"
              onClick={() => {
                setCurrentMobileTab(tab as any);
                setMobileTabOpen(true);
              }}
            >
              {tab === "notice" && "공지"}
              {tab === "files" && "자료"}
              {tab === "links" && "링크"}
              {tab === "late" && "지각"}
            </Button>
          ))}
        </div>

        {/*  모바일 탭 모달 */}
        <MobileTabModal
          open={mobileTabOpen}
          onOpenChange={setMobileTabOpen}
          title={
            currentMobileTab === "notice"
              ? "📢 공지사항"
              : currentMobileTab === "files"
                ? "📂 자료실"
                : currentMobileTab === "links"
                  ? "🔗 유용한 링크"
                  : currentMobileTab === "late"
                    ? "⏰ 지각 인원"
                    : ""
          }
        >
          {currentMobileTab === "notice" && (
            <NoticeTab
              notices={notices}
              newNotice={newNotice}
              editingIndex={editingIndex}
              editingText={editingText}
              onNewNoticeChange={setNewNotice}
              onAddNotice={handleAddNotice}
              onEditNotice={handleEditNotice}
              onDeleteNotice={handleDeleteNotice}
              onEditingTextChange={setEditingText}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={() => setEditingIndex(null)}
            />
          )}
          {currentMobileTab === "files" && (
            <FilesTab
              uploadedFiles={uploadedFiles}
              onFileChange={handleFileChange}
            />
          )}
          {currentMobileTab === "links" && (
            <LinksTab
              validLinks={validLinks}
              linkInput={linkInput}
              onLinkInputChange={setLinkInput}
              onAddLink={handleAddLink}
            />
          )}
          {currentMobileTab === "late" && (
            <LateUsersTab lateUsers={lateUsers} />
          )}
        </MobileTabModal>

        {/*  DM 모달 */}
        <DMModal
          open={dmModalOpen}
          onOpenChange={setDmModalOpen}
          selectedUser={selectedUser}
          message={dmMessage}
          onMessageChange={setDmMessage}
          onSend={handleSendDM}
        />
      </div>
    </TooltipProvider>
  );
}
