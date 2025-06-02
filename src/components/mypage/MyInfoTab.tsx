"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/mypage/ProfileCard";
import ActivitySummaryCard from "@/components/mypage/ActivitySummaryCard";
import ChangePasswordDialog from "@/components/mypage/ChangePasswordDialog";
import DeleteAccountDialog from "@/components/mypage/DeleteAccountDialog";
import { api } from "@/lib/axios";
interface Profile {
  id: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  profileImageId?: string;
  profileImageUrl?: string;
  providerType: string;
}

export default function MyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [editNickname, setEditNickname] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    memberDetail();
  }, []);

  const memberDetail = async () => {
    const res = await api.get("/private/mypage/profile/detail");
    if (res.data.httpCode == 200) {
      console.log(res.data.data);
      if (res.data.data) {
        setProfile(res.data.data);
      } else {
      }
    }
  };

  useEffect(() => {
    if (profile) {
      setEditNickname(profile.nickname);
      setEditPhone(profile.phoneNumber);
    }
  }, [profile]);

  const handleSave = () => {
    // setProfile({
    //   ...profile,
    //   nickname: editNickname,
    //   phone: editPhone,
    //   avatarUrl: selectedFile
    //     ? URL.createObjectURL(selectedFile)
    //     : profile.avatarUrl,
    // });
    // setIsEditing(false);
    // setSelectedFile(null);
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
      {profile && (
        <>
          {/* 프로필 카드 */}
          <ProfileCard
            profile={{
              id: profile.id,
              nickname: profile.nickname,
              email: profile.email,
              phoneNumber: profile.phoneNumber,
              profileImageId: profile.profileImageId,
              profileImageUrl:
                profile.profileImageUrl?.toString() ?? "/default-avatar.png",
              providerType: profile.providerType,
            }}
            onSave={handleSave} // handleSave 주석 처리 중이면 제거하거나 정의 필요
          />

          {/* 활동 요약 카드 (데이터 구조에 따라 주석 해제 가능) */}
          {/* <ActivitySummaryCard
            operatingGroups={profile.operatingGroups}
            joinedGroups={profile.joinedGroups}
          /> */}
        </>
      )}

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

      {/* 모달 */}
      <ChangePasswordDialog
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
      <DeleteAccountDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </div>
  );
}
