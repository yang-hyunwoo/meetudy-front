"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import ThumbnailUploader from "@/components/study/group/create/ThumbnailUploader";
import WeekdaySelector from "@/components/study/group/create/WeekdaySelector";
import ActiveTimeSelector from "@/components/study/group/create/ActiveTimeSelector";
import StudyPeriodSelector from "@/components/study/group/create/StudyPeriodSelector";
import JoinTypeSelector from "@/components/study/group/create/JoinTypeSelector";
import PrivateRoomSelector from "@/components/study/group/create/PrivateRoomSelector";
import CommentEnabledSelector from "@/components/study/group/create/CommentEnabledSelector";
import LateFeeSelector from "@/components/study/group/create/LateFeeSelector";

interface GroupFormProps {
  defaultValues?: {
    name: string;
    description: string;
    location: string;
    max: number;
    joinType: "free" | "approval";
    isPrivate: "yes" | "no";
    password?: string;
    commentEnabled: "yes" | "no";
    isLateFee: "yes" | "no";
    lateFeeAmount?: string;
    startDate?: Date;
    endDate?: Date;
    content: string;
    frequency: string;
    weekdays: string[];
    activeHour: string;
    activeMinute: string;
  };
  onSubmit?: (values: any) => void;
}

export default function GroupCreatePage({
  defaultValues,
  onSubmit,
}: GroupFormProps) {
  const router = useRouter();
  const regions = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "기타",
  ];

  const [name, setName] = useState(defaultValues?.name || "");
  const [description, setDescription] = useState(
    defaultValues?.description || "",
  );
  const [location, setLocation] = useState(defaultValues?.location || "");
  const [max, setMax] = useState(defaultValues?.max || 10);
  const [joinType, setJoinType] = useState<"free" | "approval">(
    defaultValues?.joinType || "free",
  );
  const [isPrivate, setIsPrivate] = useState<"yes" | "no">(
    defaultValues?.isPrivate || "no",
  );
  const [password, setPassword] = useState(defaultValues?.password || "");
  const [commentEnabled, setCommentEnabled] = useState<"yes" | "no">(
    defaultValues?.commentEnabled || "yes",
  );
  const [isLateFee, setIsLateFee] = useState<"yes" | "no">(
    defaultValues?.isLateFee || "no",
  );
  const [lateFeeAmount, setLateFeeAmount] = useState(
    defaultValues?.lateFeeAmount || "",
  );
  const [content, setContent] = useState(
    defaultValues?.content || "그룹 상세 내용",
  );
  const [frequency, setFrequency] = useState(
    defaultValues?.frequency || "매주",
  );
  const [weekdays, setWeekdays] = useState<string[]>(
    defaultValues?.weekdays || [],
  );
  const [activeHour, setActiveHour] = useState(defaultValues?.activeHour || "");
  const [activeMinute, setActiveMinute] = useState(
    defaultValues?.activeMinute || "",
  );
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultValues?.startDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    defaultValues?.endDate,
  );

  // 태그 추가
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const toggleWeekday = (day: string) => {
    setWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = {
      name,
      description,
      location,
      max,
      joinType,
      isPrivate,
      password,
      commentEnabled,
      isLateFee,
      lateFeeAmount,
      content,
      frequency,
      weekdays,
      activeHour,
      activeMinute,
      thumbnail,
      tags,
    };
    if (onSubmit) return onSubmit(values);
    console.log(values);
    alert("그룹이 생성되었습니다.");
    router.push("/group");
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">스터디 그룹 만들기</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 썸네일 업로드 */}
        <ThumbnailUploader
          thumbnail={thumbnail}
          thumbnailPreview={thumbnailPreview}
          onChange={(file) => {
            setThumbnail(file);
            if (file) {
              const reader = new FileReader();
              reader.onload = () =>
                setThumbnailPreview(reader.result as string);
              reader.readAsDataURL(file);
            } else {
              setThumbnailPreview(null);
            }
          }}
          onRemove={() => {
            setThumbnail(null);
            setThumbnailPreview(null);
          }}
        />

        {/* 지역 선택 */}
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="지역을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 그룹 명 */}
        <Input
          placeholder="그룹 명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* 그룹 요약 */}
        <Input
          placeholder="그룹 요약"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {/*  태그 입력 */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            태그 추가
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagInput.trim()) {
                e.preventDefault();
                if (!tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                }
                setTagInput("");
              }
            }}
            placeholder="#리액트"
            className="flex-1 border px-3 py-2 rounded w-full"
          />
          {/* 태그 리스트 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <div
                key={idx}
                className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
              >
                #{tag}
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 상세 내용 */}
        <TiptapEditor content={content} onChange={(html) => setContent(html)} />
        {/* 시작일 */}
        {/* 시작일 + 종료일 */}
        <StudyPeriodSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        {/* 최대 인원 수 */}
        <div>
          <label
            htmlFor="max-member"
            className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100"
          >
            최대 인원 수
          </label>
          <Input
            id="max-member"
            type="number"
            placeholder="최대 인원 수"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            min={1}
            required
          />
        </div>

        {/* 활동 빈도 */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            활동 빈도
          </label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="빈도를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="매주">매주</SelectItem>
              <SelectItem value="매일">매일</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 요일 선택 */}
        {frequency === "매주" && (
          <div className="mt-4">
            <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
              요일 선택
            </label>
            <WeekdaySelector
              weekdays={weekdays}
              toggleWeekday={toggleWeekday}
            />
          </div>
        )}

        {/* 활동 시간 */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            활동 시간
          </label>
          <ActiveTimeSelector
            activeHour={activeHour}
            activeMinute={activeMinute}
            onHourChange={setActiveHour}
            onMinuteChange={setActiveMinute}
          />
        </div>
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        {/* 가입 방식 */}
        <JoinTypeSelector value={joinType} onChange={setJoinType} />
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        {/* 비밀방 여부 */}
        <PrivateRoomSelector
          value={isPrivate}
          password={password}
          onPrivateChange={setIsPrivate}
          onPasswordChange={setPassword}
        />
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        {/* 댓글 여부 */}
        <CommentEnabledSelector
          value={commentEnabled}
          onChange={setCommentEnabled}
        />
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        {/* 지각비 여부 */}
        <LateFeeSelector
          value={isLateFee}
          amount={lateFeeAmount}
          onLateFeeChange={setIsLateFee}
          onAmountChange={setLateFeeAmount}
        />
        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-violet-600 dark:hover:bg-violet-700"
          >
            그룹 만들기
          </Button>
        </div>
      </form>
    </div>
  );
}
