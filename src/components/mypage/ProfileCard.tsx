"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/lib/axios";
import axios from "axios";

interface ProfileCardProps {
  profile: {
    nickname: string;
    email: string;
    phone: string;
    avatarUrl: string;
  };
  onSave: (nickname: string, phone: string, selectedFile: File | null) => void;
}

export default function ProfileCard({ profile, onSave }: ProfileCardProps) {
  const [editNickname, setEditNickname] = useState(profile.nickname);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); //  여기서 미리 URL 저장

      const formData = new FormData();
      formData.append("files", file);

      const res = await api.post("/private/file-upload", formData);
      console.log(res);
    }
  };
  const handleSave = () => {
    onSave(editNickname, editPhone, selectedFile);
    setIsEditing(false);
    setSelectedFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 정보</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={previewUrl ? previewUrl : profile.avatarUrl}
              alt="프로필 이미지"
            />
            <AvatarFallback>HW</AvatarFallback>
          </Avatar>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute top-0 left-0 w-24 h-24 opacity-0 cursor-pointer"
            />
          )}
        </div>

        <div className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium">닉네임</label>
            <Input
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">이메일</label>
            <Input value={profile.email} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium">휴대폰 번호</label>
            <Input
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing ? (
          <Button onClick={handleSave}>저장하기</Button>
        ) : (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            수정하기
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
