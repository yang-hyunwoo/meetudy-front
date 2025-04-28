"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import NoticeTab from "@/components/study/group/room/NoticeTab";
import FilesTab from "@/components/study/group/room/FilesTab";
import LinksTab from "@/components/study/group/room/LinksTab";
import LateUsersTab from "@/components/study/group/room/LateUsersTab";
import MobileTabModal from "@/components/study/group/room/MobileTabModal";
import UserListSidebar from "@/components/study/group/room/UserListSidebar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DMModal from "@/components/study/group/room/DMModal";

interface User {
  name: string;
  nickname: string;
  avatarUrl?: string;
  online: boolean;
  isLate?: boolean;
}

const mockUsers: User[] = [
  {
    name: "김현우",
    nickname: "hyeonu",
    avatarUrl: "",
    online: true,
    isLate: false,
  },
  {
    name: "이서윤",
    nickname: "seoyoon",
    avatarUrl: "",
    online: false,
    isLate: true,
  },
  {
    name: "박민준",
    nickname: "minjun",
    avatarUrl: "",
    online: true,
    isLate: true,
  },
];

export default function GroupRoomLayout() {
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

  // DM용 상태
  const [dmModalOpen, setDmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dmMessage, setDmMessage] = useState("");

  const lateUsers = mockUsers.filter((user) => user.isLate);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] border rounded-lg overflow-hidden relative">
        {/* ✅ 사용자 목록 사이드바 */}
        <UserListSidebar
          users={mockUsers}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onDmClick={(user) => {
            setSelectedUser(user);
            setDmModalOpen(true);
          }}
        />

        {/* ✅ 메인 채팅 영역 */}
        <main className="flex-1 w-full flex flex-col bg-white dark:bg-zinc-950">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsContent value="chat" className="flex-1 p-4 overflow-y-auto">
              <div className="text-center text-gray-500 text-sm">
                채팅 메시지 표시 영역
              </div>
            </TabsContent>
          </Tabs>

          {/* ✅ 채팅 입력창 */}
          <div className="flex items-center gap-2 p-3 border-t bg-white dark:bg-zinc-900">
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              className="flex-1 px-3 py-2 text-sm rounded border dark:bg-zinc-800 dark:text-white"
            />
            <Button size="sm">전송</Button>
          </div>
        </main>

        {/* ✅ PC 전용 사이드 탭 */}
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
            {activeSideTab === "late" && <LateUsersTab lateUsers={lateUsers} />}
          </div>
        </aside>

        {/* ✅ 모바일 하단 탭 바 */}
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

        {/* ✅ 모바일 탭 모달 */}
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

        {/* ✅ DM 모달 */}
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
