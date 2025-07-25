"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/mypage/ProfileCard";
import ActivitySummaryCard from "@/components/mypage/ActivitySummaryCard";
import ChangePasswordDialog from "@/components/mypage/ChangePasswordDialog";
import DeleteAccountDialog from "@/components/mypage/DeleteAccountDialog";
import { api } from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

interface Profile {
  id: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  profileImageId?: string;
  profileImageUrl?: string;
  providerType: string;
  filesDetailsId: string;
}

interface GroupCount {
  operationCount: number;
  joinCount: number;
}

export default function MyPage() {
  const router = useRouter();
  const { isLoggedIn, checkAuth } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [groupCount, setGroupCount] = useState<GroupCount | null>(null);
  const [editNickname, setEditNickname] = useState("");
  const [editNicknameError, setEditNicknameError] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPhoneError, setEditPhoneError] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const NICKNAME_REGEX = /^[가-힣a-zA-Z]+$/;
  const NICKNAME_NOT_NULL = "닉네임은 공백일 수 없습니다.";
  const NICKNAME_REGEX_VALID = "닉네임은 한글 또는 영문만 입력 가능합니다.";
  const PHONE_NOT_NULL = "휴대폰번호는 공백일 수 없습니다.";
  const PHONE_NOT_LENGTH = "휴대폰 번호 자리수를 확인 해 주세요.";

  useEffect(() => {
    memberDetail();
  }, []);

  /**
   * 멤버 상세 조회
   */
  const memberDetail = async () => {
    const res = await api.get("/private/mypage/profile/detail");
    if (res.data.httpCode == 200) {
      if (res.data.data) {
        setProfile(res.data.data);
      } else {
      }
    }
    const group = await api.get("/private/mypage/group/count");
    if (group.data.httpCode == 200) {
      if (group.data.data) {
        setGroupCount(group.data.data);
      } else {
      }
    }
  };

  /**
   * 비밀번호 변경
   * @param currentPassword
   * @param newPassword
   */
  const verifyPassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    var MypagePwdChgReqDto = {
      currentPw: currentPassword,
      newPw: newPassword,
    };
    const res = await api.put(
      "/private/mypage/profile/pwd-change",
      MypagePwdChgReqDto,
    );
    if (res.data.httpCode !== 200) {
      throw new Error("Invalid password");
    }
    setIsPasswordModalOpen(true);
    alert("비밀번호가 변경 되었습니다.");
  };

  const handleOpenChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  useEffect(() => {
    if (profile) {
      setEditNickname(profile.nickname);
      setEditPhone(profile.phoneNumber);
    }
  }, [profile]);

  /**
   * 상세 수정
   * @param nickname
   * @param phone
   * @param selectedFile
   * @returns
   */

  const handleSave = async (
    nickname: string,
    phone: string,
    selectedFile: File | null,
  ): Promise<boolean> => {
    if (!nickname.trim()) {
      setEditNicknameError(NICKNAME_NOT_NULL);
      return false;
    }
    if (!NICKNAME_REGEX.test(nickname)) {
      setEditNicknameError(NICKNAME_REGEX_VALID);
      return false;
    }
    if (phone.trim() && phone.length !== 11) {
      setEditPhoneError(PHONE_NOT_LENGTH);
      return false;
    }

    setEditNicknameError("");

    const newProfile = {
      ...profile!,
      nickname,
      phoneNumber: phone,
      profileImageUrl: selectedFile
        ? URL.createObjectURL(selectedFile)
        : profile?.profileImageUrl,
    };
    setProfile(newProfile);
    var MypagePwdChgReqDto = {
      nickname: newProfile.nickname,
      phoneNumber: newProfile.phoneNumber,
      profileImageId: profile?.profileImageId,
    };

    const formData = new FormData();
    const deleteFormData = new FormData();

    if (selectedFile) {
      formData.append("files", selectedFile);
      if (profile?.profileImageId) {
        formData.append("fileId", profile.profileImageId);
        deleteFormData.append("fileId", profile.profileImageId);
        deleteFormData.append("delFileDetailsId", profile.filesDetailsId);
        const deleteRes = await api.put("/private/file-delete", deleteFormData);
      }
      const uploadRes = await api.post("/private/file-upload", formData);
      const uploadedFileId = uploadRes.data.data?.fileId;
      if (uploadedFileId) {
        MypagePwdChgReqDto.profileImageId = uploadedFileId;
      }
    }

    try {
      const res = await api.put(
        "/private/mypage/profile/detail/update",
        MypagePwdChgReqDto,
      );
      if (res.data.httpCode == 200) {
        if (res.data.data) {
          setProfile(res.data.data);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const field = error.response?.data?.data.field;
        const message = error.response?.data?.data.message;
        if (field && message) {
          setErrorByField(field, message);
          return false;
        }
      }
    }
    return true;
  };

  const verifyWithdraw = async (currentPassword: string) => {
    var MypageWithdrawReqDto = {
      currentPw: currentPassword,
    };
    const res = await api.put(
      "/private/mypage/profile/withdraw",
      MypageWithdrawReqDto,
    );
    if (res.data.httpCode !== 200) {
      throw new Error("Invalid password");
    }
    setIsDeleteModalOpen(true);
    localStorage.removeItem("accessToken");
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    checkAuth(); // ⭐ 상태 업데이트
    router.push("/mypage/withdraw");
  };

  const setErrorByField = (field: string, message: string) => {
    switch (field) {
      case "nickname":
        setEditNicknameError(message);
        break;
      case "phoneNumber":
        setEditPhoneError(message);
        break;
      default:
        alert("오류가 발생했습니다. \n 잠시후 다시 시도해 주세요.");
        return;
    }
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
            editNicknameError={editNicknameError}
            setEditNicknameError={setEditNicknameError}
            onSave={handleSave} // handleSave 주석 처리 중이면 제거하거나 정의 필요
          />

          {/* 활동 요약 카드 (데이터 구조에 따라 주석 해제 가능) */}
          {groupCount && (
            <ActivitySummaryCard
              operatingGroups={groupCount.operationCount}
              joinedGroups={groupCount.joinCount}
            />
          )}
        </>
      )}

      {/* 보안 섹션 */}
      <div className="flex flex-col gap-4">
        <Button onClick={handleOpenChangePassword}>비밀번호 변경</Button>
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
        onConfirm={verifyPassword}
      />
      <DeleteAccountDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={verifyWithdraw}
      />
    </div>
  );
}
