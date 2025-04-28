"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileCard from "@/components/mypage/ProfileCard";
import ActivitySummaryCard from "@/components/mypage/ActivitySummaryCard";
import ChangePasswordDialog from "@/components/mypage/ChangePasswordDialog";
import DeleteAccountDialog from "@/components/mypage/DeleteAccountDialog";

export default function MyPage() {
  const [profile, setProfile] = useState({
    nickname: "김현우",
    email: "hyeonu@example.com",
    phone: "010-1234-5678",
    createdAt: "2024-01-15",
    operatingGroups: 2,
    joinedGroups: 5,
    avatarUrl: "/default-avatar.png",
  });

  const [editNickname, setEditNickname] = useState(profile.nickname);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const handleSave = () => {
    setProfile({
      ...profile,
      nickname: editNickname,
      phone: editPhone,
      avatarUrl: selectedFile
        ? URL.createObjectURL(selectedFile)
        : profile.avatarUrl,
    });
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleChangePassword = () => {
    console.log("비밀번호 변경:", currentPassword, newPassword);
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleDeleteAccount = () => {
    console.log("회원 탈퇴 비밀번호:", deletePassword);
    setIsDeleteModalOpen(false);
    setDeletePassword("");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* 프로필 카드 */}
      <ProfileCard
        profile={{
          nickname: profile.nickname,
          email: profile.email,
          phone: profile.phone,
          avatarUrl: profile.avatarUrl,
        }}
        onSave={handleSave} // ✅ 이렇게!
      />

      {/* 활동 요약 카드 */}
      <ActivitySummaryCard
        operatingGroups={profile.operatingGroups}
        joinedGroups={profile.joinedGroups}
      />

      {/* 보안 섹션 */}
      <div className="flex flex-col gap-4">
        <Button onClick={() => setIsPasswordModalOpen(true)}>
          비밀번호 변경
        </Button>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          회원 탈퇴
        </Button>
      </div>
      {/* 비밀번호 변경 모달 */}
      <ChangePasswordDialog
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />

      {/* 회원 탈퇴 모달 */}
      <DeleteAccountDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </div>
  );
}
