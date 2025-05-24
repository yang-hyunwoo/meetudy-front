"use client";

import { useEffect, useState } from "react";
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
import { validateFields, FieldValidation } from "@/utils/validateFileds";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/axios";
import axios from "axios";

interface GroupFormProps {
  defaultValues?: {
    title: string;
    summary: string;
    region: string;
    maxMemberCount: number;
    joinType: boolean;
    secret: boolean;
    secretPassword?: string;
    allowComment: boolean;
    isLateFee: boolean;
    lateFeeAmount?: string;
    startDate?: Date;
    endDate?: Date;
    content: string;
    meetingFrequency: string;
    meetingDay: string[];
    meetingStartTime: string;
    meetingEndTime: string;
    tag: string;
  };
  onSubmit?: (values: any) => void;
}

export default function GroupCreatePage({
  defaultValues,
  onSubmit,
}: GroupFormProps) {
  const TITLE_NOT_NULL = "스터디 그룹 명은 공백일 수 없습니다.";
  const REGION_NOT_NULL = "스터디 그룹 지역을 선택 해주세요.";
  const CONTENT_NOT_NULL = "스터디 그룹 상세 설명은 공백일 수 없습니다.";
  const STARTDATE_NOT_NULL = "스터디 그룹 시작일은 공백일 수 없습니다.";
  const ENDDATE_NOT_NULL = "스터디 그룹 종료일은 공백일 수 없습니다.";
  const STARTTIME_NOT_NULL = "스터디 그룹 시작 시간은 공백일 수 없습니다.";
  const ENDTIME_NOT_NULL = "스터디 그룹 종료 시간은 공백일 수 없습니다.";
  const MEETINGDAY_NOT_NULL = "스터디 모임 요일은 공백일 수 없습니다.";
  const MAXMEMBERCOUNT_NOT_NULL = "최대 인원 수는 공백일 수 없습니다.";
  const MEETINGFREQUENCY_NOT_NULL =
    "스터디 그룹 활동 빈도는 공백일 수 없습니다.";
  const MEETINGSTARTTIME_NOT_NULL =
    "스터디 모임 시작 시간은 공백일 수 없습니다.";
  const MEETINGENDTIME_NOT_NULL = "스터디 모임 종료 시간은 공백일 수 없습니다.";
  const SECRETPASSWORD_NOT_NULL = "비밀방 비밀번호는 공백일 수 없습니다.";
  const SECRETPASSWORD_NOT_LENGTH = "비밀방 비밀번호 6자리 입력해주세요.";

  const router = useRouter();
  const regions = [
    { code: "SEOUL", label: "서울" },
    { code: "BUSAN", label: "부산" },
    { code: "INCHEON", label: "인천" },
    { code: "DAEJEON", label: "대전" },
    { code: "DAEGU", label: "대구" },
    { code: "GWANGJU", label: "광주" },
    { code: "ULSAN", label: "울산" },
    { code: "JEJU", label: "제주" },
    { code: "ETC", label: "기타" },
  ];

  const [title, setTitle] = useState(defaultValues?.title || "");
  const [titleError, setTitleError] = useState("");

  const [summary, setSummary] = useState(defaultValues?.summary || "");

  const [region, setRegion] = useState(defaultValues?.region || "");
  const [regionError, setRegionError] = useState(defaultValues?.region || "");
  const [regionTouched, setRegionTouched] = useState(false);

  const [maxMemberCount, setMaxMemberCount] = useState<number | undefined>(
    defaultValues?.maxMemberCount,
  );
  const [maxMemberCountError, setMaxMemberCountError] = useState("");

  const [joinType, setJoinType] = useState<boolean>(
    defaultValues?.joinType ?? false, // 자유가입이 기본
  );

  const [secret, setSecret] = useState<boolean>(defaultValues?.secret ?? false);
  const [secretPassword, setSecretPassword] = useState(
    defaultValues?.secretPassword || "",
  );
  const [secretPasswordError, setSecretPasswordError] = useState("");

  const [allowComment, setAllowComment] = useState<boolean>(
    defaultValues?.allowComment ?? false,
  );

  const [isLateFee, setIsLateFee] = useState<boolean>(
    defaultValues?.isLateFee ?? false,
  );
  const [lateFeeAmount, setLateFeeAmount] = useState(
    defaultValues?.lateFeeAmount || "",
  );

  const [content, setContent] = useState(defaultValues?.content);
  const [contentError, setContentError] = useState("");

  const [meetingFrequency, setMeetingFrequency] = useState(
    defaultValues?.meetingFrequency || "매주",
  );

  const [meetingDay, setMeetingDay] = useState<string[]>(
    defaultValues?.meetingDay || [],
  );
  const [meetingDayError, setMeetingDayError] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [startHour, setStartHour] = useState(
    defaultValues?.meetingStartTime?.split(":")[0] || "",
  );
  const [startMinute, setStartMinute] = useState(
    defaultValues?.meetingStartTime?.split(":")[1] || "",
  );
  const [startTimeError, setStartTimeError] = useState(false);

  const [endHour, setEndHour] = useState(
    defaultValues?.meetingEndTime?.split(":")[0] || "",
  );
  const [endMinute, setEndMinute] = useState(
    defaultValues?.meetingEndTime?.split(":")[1] || "",
  );
  const [timeValidError, setTimeValidError] = useState("");
  const [dateValidError, setDateValidError] = useState("");
  const [endTimeError, setEndTimeError] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultValues?.startDate,
  );
  const [startDateError, setStartDateError] = useState(false);

  const [endDate, setEndDate] = useState<Date | undefined>(
    defaultValues?.endDate,
  );
  const [endDateError, setEndDateError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  //그룹 명 이벤트
  const handleTitleBlur = () => {
    if (!title.trim()) {
      setTitleError(TITLE_NOT_NULL);
    } else {
      setTitleError("");
    }
  };

  useEffect(() => {
    if (meetingDay.length != 0) {
      setMeetingDayError("");
    }
  }, [meetingDay]);

  //상세 내용 이벤트
  const handleEditorChange = (html: string) => {
    setContent(html);
    const trueFalse = !html || html.trim() === "" || html === "<p></p>";
    if (trueFalse) {
      setContentError(CONTENT_NOT_NULL);
    } else {
      setContentError("");
    }
  };
  //최대 인원수 이벤트
  const handleMaxMemberCounteBlur = () => {
    if (maxMemberCount === undefined) {
      setMaxMemberCountError(MAXMEMBERCOUNT_NOT_NULL);
    } else {
      setMaxMemberCountError("");
    }
  };

  //비밀방 비밀번호 이벤트
  const handleSecretPasswordBlur = () => {
    if (secret && !secretPassword.trim()) {
      setSecretPasswordError("비밀방 비밀번호를 입력하세요");
    } else {
      setSecretPasswordError("");
    }
  };

  //비밀방 여부 이벤트
  const handlePrivateChange = (value: boolean) => {
    setSecret(value);
    if (!value) {
      setSecretPassword("");
      setSecretPasswordError("");
    }
  };
  // 태그 추가
  const [tag, setTag] = useState<string[]>(
    typeof defaultValues?.tag === "string"
      ? defaultValues.tag.split(",").map((tag) => tag.trim())
      : defaultValues?.tag || [],
  );
  const [tagInput, setTagInput] = useState("");

  //활동 빈도 이벤트
  const toggleWeekday = (day: string) => {
    setMeetingDay((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };
  const handleMeetingFrequencyChange = (value: string) => {
    setMeetingFrequency(value);

    if (value === "매일") {
      // 요일 전체 자동 설정 (월~일)
      setMeetingDay(["월", "화", "수", "목", "금", "토", "일"]);
    } else {
      // "매주" 선택 시 비워두거나 초기화
      setMeetingDay([]);
    }
  };

  const handleStartDateChange = (value?: Date) => {
    setStartDate(value);
    setStartDateError(false);
    setDateValidError("");
    if (endDate != undefined && value != undefined) {
      if (value > endDate) {
        setDateValidError("시작일은 종료일보다 빠를 수 없습니다.");
      }
    }
  };

  const handleEndDateChange = (value?: Date) => {
    setEndDate(value);
    setEndDateError(false);
    setDateValidError("");
    if (startDate != undefined && value != undefined) {
      if (value < startDate) {
        setDateValidError("시작일은 종료일보다 빠를 수 없습니다.");
      }
    }
  };

  //활동 시작 시간 이벤트
  const handleStartHourChange = (value: string) => {
    setStartHour(value);
    if (value && startMinute) {
      setStartTimeError(false);
      setTimeValidError("");
      if (endMinute && endHour) {
        if (value > endHour) {
          setTimeValidError("시작시간은 종료시간보다 빠를 수 없습니다.");
        } else if (value == endHour) {
          if (startMinute > endMinute) {
            setTimeValidError("시작시간은 종료시간보다 빠를 수 없습니다.");
          }
        }
      }
    }
  };

  //활동 시작 분 이벤트
  const handleStartMinuteChange = (value: string) => {
    setStartMinute(value);
    if (startHour && value) {
      setStartTimeError(false);
      setTimeValidError("");
      if (endMinute && endHour) {
        if (startHour > endHour) {
          setTimeValidError("시작시간은 종료시간보다 빠를 수 없습니다.");
        } else if (startHour == endHour) {
          if (value > endMinute) {
            setTimeValidError("시작시간은 종료시간보다 빠를 수 없습니다.");
          }
        }
      }
    }
  };

  //활동 종료 시간 이벤트
  const handleEndHourChange = (value: string) => {
    setEndHour(value);
    if (value && endMinute) {
      setEndTimeError(false);
      setTimeValidError("");
      if (startMinute && startHour) {
        if (startHour > value) {
          setTimeValidError("시작시간은 종료시간보다 빠를 수 없습니다.");
        } else if (startHour == endHour) {
          if (startMinute > endMinute) {
            setTimeValidError("시작시간은 종료시간보다 빠를 수 없습니다.");
          }
        }
      }
    }
  };

  //활동 종료 분 이벤트
  const handleEndMinuteChange = (value: string) => {
    setEndMinute(value);
    if (endHour && value) {
      setEndTimeError(false);
      setTimeValidError("");
      if (startMinute && startHour) {
        if (startHour > endHour) {
          setTimeValidError("시작시간은 종료시간보다 빠를 수 없습니다.");
        } else if (startHour == endHour) {
          if (startMinute > value) {
            setTimeValidError("시작시간은 종료시간보다 빠를 수 없습니다.");
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorList = [
      titleError,
      regionError,
      maxMemberCountError,
      contentError,
      startDateError,
      endDateError,
      startTimeError,
      endTimeError,
      timeValidError,
      dateValidError,
    ];
    // 하나라도 에러가 있다면 중단
    if (errorList.some(Boolean)) {
      return;
    }
    const values = {
      title,
      summary,
      region,
      maxMemberCount,
      joinType,
      startDate: startDate?.toISOString().split("T")[0],
      endDate: endDate?.toISOString().split("T")[0],
      secret,
      secretPassword,
      allowComment,
      lateFeeAmount,
      content,
      meetingFrequency,
      meetingDay: meetingDay.join(","),
      meetingStartTime: `${startHour}:${startMinute}`,
      meetingEndTime: `${endHour}:${endMinute}`,
      thumbnailFileId: thumbnail,
      tag: tag.join(","),
    };
    const fieldChecks: FieldValidation[] = [
      { name: "region", value: region, message: REGION_NOT_NULL },
      { name: "title", value: title, message: TITLE_NOT_NULL },
      {
        name: "content",
        value: content,
        message: CONTENT_NOT_NULL,
      },
      { name: "startDate", value: startDate, message: STARTDATE_NOT_NULL },
      { name: "endDate", value: endDate, message: ENDDATE_NOT_NULL },
      {
        name: "maxMemberCount",
        value: maxMemberCount,
        message: MAXMEMBERCOUNT_NOT_NULL,
      },
      {
        name: "meetingDay",
        value: meetingDay.join(","),
        message: MEETINGDAY_NOT_NULL,
      },
      {
        name: "startTime",
        value: startHour && startMinute ? `${startHour}:${startMinute}` : "",
        message: STARTTIME_NOT_NULL,
      },
      {
        name: "endTime",
        value: endHour && endMinute ? `${endHour}:${endMinute}` : "",
        message: ENDTIME_NOT_NULL,
      },
    ];
    const isValid = validateFields(fieldChecks, setErrorByField);
    if (!isValid) return;
    if (secret) {
      if (!secretPassword.trim()) {
        setSecretPasswordError(SECRETPASSWORD_NOT_NULL);
        return;
      } else if (secretPassword.length != 6) {
        setSecretPasswordError(SECRETPASSWORD_NOT_LENGTH);
        return;
      } else {
        setSecretPasswordError("");
      }
    }
    setIsLoading(true); // 로딩 시작
    try {
      //TODO : 파일 첨부 추가
      const formData = new FormData();
      if (thumbnail) {
        formData.append("files", thumbnail);
        const uploadRes = await api.post("/private/file-upload", formData);
        const uploadedFileId = uploadRes.data.data?.fileId; // 또는 필요한 key
        if (uploadedFileId) {
          values.thumbnailFileId = uploadedFileId; // 서버에서 기대하는 필드명
        }
      }

      const res = await api.post("/private/study-group/insert", values);

      router.push("/study/list/" + region.toLowerCase());
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data.errCode == "ERR_017") {
          setTimeValidError(error.response?.data.errCodeMsg);
          return;
        }
        if (error.response?.data.errCode == "ERR_016") {
          setDateValidError(error.response?.data.errCodeMsg);
          return;
        }
        const field = error.response?.data?.data.field;
        const message = error.response?.data?.data.message;
        if (field && message) {
          setErrorByField(field, message);
        }
      }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const setErrorByField = (field: string, message: string) => {
    switch (field) {
      case "region":
        setRegionError(message);
        break;
      case "title":
        setTitleError(message);
        break;
      case "content":
        setContentError(message);
        break;
      case "startDate":
        setStartDateError(true);
        break;
      case "endDate":
        setEndDateError(true);
        break;
      case "maxMemberCount":
        setMaxMemberCountError(message);
        break;
      case "meetingDay":
        setMeetingDayError(message);
        break;
      case "startTime":
        setStartTimeError(true);
        break;
      case "endTime":
        setEndTimeError(true);
        break;
      case "meetingStartTime":
        setStartTimeError(true);
        break;
      case "meetingEndTime":
        setEndTimeError(true);
        break;
      default:
        alert("오류가 발생했습니다. \n 잠시후 다시 시도해 주세요.");
        return;
    }
  };
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">스터디 그룹 생성</h1>

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
        <Select
          value={region}
          onValueChange={(val) => {
            setRegion(val);
            setRegionError(""); // 선택 시 에러 초기화
          }}
          onOpenChange={(open) => {
            if (!open) {
              setRegionTouched(true);
              if (!region) {
                setRegionError("지역을 선택해주세요.");
              }
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="지역을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.code} value={region.code}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {regionError && (
          <p className="text-xs text-red-500 mt-3">{regionError}</p>
        )}

        {/* 그룹 명 */}
        <Input
          placeholder="그룹 명"
          value={title}
          onBlur={handleTitleBlur}
          onChange={(e) => setTitle(e.target.value)}
        />
        {titleError && (
          <p className="text-xs text-red-500 mt-3">{titleError}</p>
        )}

        {/* 그룹 요약 */}
        <Input
          placeholder="그룹 요약"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
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
                if (!tag.includes(tagInput.trim())) {
                  setTag([...tag, tagInput.trim()]);
                }
                setTagInput("");
              }
            }}
            placeholder="입력후 엔터를 눌러주세요.(ex:리액트)"
            className="flex-1 border px-3 py-2 rounded w-full"
          />
          {/* 태그 리스트 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tag.map((tagItem, idx) => (
              <div
                key={idx}
                className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
              >
                #{tagItem}
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => setTag(tag.filter((_, i) => i !== idx))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 상세 내용 */}
        <TiptapEditor content={content} onChange={handleEditorChange} />
        {contentError && (
          <p className="text-xs text-red-500 mt-3">{contentError}</p>
        )}
        {/* 시작일 */}
        {/* 시작일 + 종료일 */}
        <StudyPeriodSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          showStartError={startDateError}
          showEndError={endDateError}
        />
        {dateValidError && (
          <p className="text-xs text-red-500 mt-3">{dateValidError}</p>
        )}
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
            type="text"
            inputMode="numeric" // 모바일에서 숫자 키패드
            placeholder="최대 인원 수"
            value={maxMemberCount ?? ""}
            onBlur={handleMaxMemberCounteBlur}
            onChange={(e) => {
              const input = e.target.value.replace(/[^0-9]/g, ""); // 숫자 이외 제거
              const numeric = Number(input);
              if (numeric > 30) {
                setMaxMemberCount(30);
              } else {
                setMaxMemberCount(numeric);
              }
            }}
          />
          {maxMemberCountError && (
            <p className="text-xs text-red-500 mt-3">{maxMemberCountError}</p>
          )}
        </div>

        {/* 활동 빈도 */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            활동 빈도
          </label>
          <Select
            value={meetingFrequency}
            onValueChange={handleMeetingFrequencyChange}
          >
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
        {meetingFrequency === "매주" && (
          <div className="mt-4">
            <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
              요일 선택
            </label>
            <WeekdaySelector
              weekdays={meetingDay}
              toggleWeekday={toggleWeekday}
            />
            {meetingDayError && (
              <p className="text-xs text-red-500 mt-3">{meetingDayError}</p>
            )}
          </div>
        )}

        {/* 활동 시간 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            활동 시간
          </label>
          <div className="flex gap-4">
            <ActiveTimeSelector
              activeHour={startHour}
              activeMinute={startMinute}
              onHourChange={handleStartHourChange}
              onMinuteChange={handleStartMinuteChange}
              showError={startTimeError}
            />
            <span className="text-gray-400">~</span>
            <ActiveTimeSelector
              activeHour={endHour}
              activeMinute={endMinute}
              onHourChange={handleEndHourChange}
              onMinuteChange={handleEndMinuteChange}
              showError={endTimeError}
            />
          </div>
          {timeValidError && (
            <p className="text-xs text-red-500 mt-3">{timeValidError}</p>
          )}
        </div>
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        {/* 가입 방식 */}
        <JoinTypeSelector value={joinType} onChange={setJoinType} />
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        {/* 비밀방 여부 */}
        <PrivateRoomSelector
          value={secret}
          password={secretPassword}
          onPrivateChange={handlePrivateChange}
          onPasswordChange={setSecretPassword}
          onPasswordBlur={handleSecretPasswordBlur}
          passwordError={secretPasswordError}
        />
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        {/* 댓글 여부 */}
        <CommentEnabledSelector
          value={allowComment}
          onChange={setAllowComment}
        />
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        {/* 지각비 여부 */}
        {/* <LateFeeSelector
          value={isLateFee}
          amount={lateFeeAmount}
          onLateFeeChange={setIsLateFee}
          onAmountChange={setLateFeeAmount}
        /> */}
        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-violet-600 dark:hover:bg-violet-700"
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            {isLoading ? "그룹 생성중..." : "그룹 생성"}
          </Button>
        </div>
      </form>
    </div>
  );
}
