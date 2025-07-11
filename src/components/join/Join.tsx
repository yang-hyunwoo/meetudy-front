"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordInput from "@/components/join/PasswordInput";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  const birthdayInputRef = useRef<HTMLInputElement>(null);
  const [birthday, setBirthday] = useState("");
  const [birthdayError, setBirthdayError] = useState("");

  const hpNumInputRef = useRef<HTMLInputElement>(null);
  const [hpNum, setHpNum] = useState("");
  const [hpNumError, setHpNumError] = useState("");

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const passwordConfirmInputRef = useRef<HTMLInputElement>(null);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  const [agreeEmail, setAgreeEmail] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const NAME_REGEX = /^[가-힣a-zA-Z]+$/;
  const EMAIL_NOT_NULL = "이메일은 공백일 수 없습니다.";
  const NAME_NOT_NULL = "이름은 공백일 수 없습니다.";
  const NICKNAME_NOT_NULL = "닉네임은 공백일 수 없습니다.";
  const BIRTHDAY_NOT_NULL = "생일은 공백일 수 없습니다.";
  const PASSWORD_NOT_NULL = "비밀번호는 공백일 수 없습니다.";
  /**
   * 이메일 포커스 유효성 검사
   */
  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError(EMAIL_NOT_NULL);
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
    } else {
      setEmailError("");
    }
  };
  useEffect(() => {
    if (!document.querySelector("#recaptcha-script")) {
      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  /**
   * 이름 포커스 유효성 검사
   */
  const handleNameBlur = () => {
    if (!name.trim()) {
      setNameError(NAME_NOT_NULL);
    } else if (!NAME_REGEX.test(name)) {
      setNameError("이름은 한글 또는 영문만 입력 가능합니다.");
    } else if (name.length > 50) {
      setNameError(
        "이름은 한글 또는 영문으로 1자 이상 50자 이하로 입력해야 합니다.",
      );
    } else {
      setNameError("");
    }
  };

  /**
   * 닉네임 포커스 유효성 검사
   */
  const handleNicknameBlur = () => {
    if (!nickname.trim()) {
      setNicknameError(NICKNAME_NOT_NULL);
    } else if (!NAME_REGEX.test(nickname)) {
      setNicknameError("닉네임은 한글 또는 영문만 입력 가능합니다.");
    } else if (nickname.length > 30) {
      setNicknameError(
        "닉네임은 한글 또는 영문으로 1자 이상 50자 이하로 입력해야 합니다.",
      );
    } else {
      setNicknameError("");
    }
  };

  /**
   * 생일 포커스 유효성 검사
   */
  const handleBirthdayBlur = () => {
    if (!birthday.trim()) {
      setBirthdayError(BIRTHDAY_NOT_NULL);
    } else if (birthday.length != 8) {
      setBirthdayError("생년월일 형식을 확인 해주세요.");
    } else {
      setBirthdayError("");
    }
  };

  const isValidPhone = (value: string): boolean => {
    return /^010/.test(value);
  };

  /**
   * 휴대폰 포커스 유효성 검사
   */
  const handleHpNumBlur = () => {
    if (!hpNum.trim()) {
      if (!isValidPhone(hpNum)) {
        setHpNumError("휴대폰 번호는 010으로 시작해야 합니다.");
      } else if (hpNum.length != 11) {
        setHpNumError("휴대폰 번호는 11자리여야 합니다.");
      } else {
        setHpNumError("");
      }
    } else {
      setHpNumError("");
    }
  };

  const isValidPassword = (password: string): boolean => {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,20}$/;
    return pattern.test(password);
  };

  /**
   * 비밀번호 포커스 유효성 검사
   */
  const handlePasswordBlur = () => {
    if (!password.trim()) {
      setPasswordError(PASSWORD_NOT_NULL);
    } else if (!isValidPassword(password)) {
      setPasswordError(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다.",
      );
    } else {
      if (!passwordConfirm.trim()) {
        setPasswordError("");
      } else {
        if (passwordConfirm != password) {
          setPasswordError("비밀번호가 일치하지 않습니다.");
          setPasswordConfirmError("");
        } else {
          setPasswordError("");
          setPasswordConfirmError("");
        }
      }
    }
  };

  /**
   * 비밀번호 포커스 유효성 검사
   */
  const handlePasswordConfirmBlur = () => {
    if (!passwordConfirm.trim()) {
      setPasswordConfirmError(PASSWORD_NOT_NULL);
    } else if (!isValidPassword(passwordConfirm)) {
      setPasswordConfirmError(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다.",
      );
    } else {
      if (!password.trim()) {
        setPasswordConfirmError("");
      } else {
        if (passwordConfirm != password) {
          setPasswordError("비밀번호가 일치하지 않습니다.");
          setPasswordConfirmError("");
        } else {
          setPasswordError("");
          setPasswordConfirmError("");
        }
      }
    }
  };

  /**
   * 회원가입 api 호출
   * @param e
   * @returns
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorList = [
      emailError,
      nameError,
      nicknameError,
      birthdayError,
      hpNumError,
      passwordError,
      passwordConfirmError,
    ];

    // 하나라도 에러가 있다면 중단
    if (errorList.some(Boolean)) {
      return;
    }

    // 값 비었는지도 체크
    const fields = [
      { name: "email", value: email, message: EMAIL_NOT_NULL },
      { name: "name", value: name, message: NAME_NOT_NULL },
      { name: "nickName", value: nickname, message: NICKNAME_NOT_NULL },
      { name: "birth", value: birthday, message: BIRTHDAY_NOT_NULL },
      { name: "password", value: password, message: PASSWORD_NOT_NULL },
      {
        name: "passwordConfirm",
        value: passwordConfirm,
        message: PASSWORD_NOT_NULL,
      },
    ];
    for (const field of fields) {
      if (!field.value.trim()) {
        setErrorByField(`${field.name}`, `${field.message}`);
        return;
      }
    }
    setIsLoading(true); // 로딩 시작
    try {
      if (!window.grecaptcha) return alert("reCAPTCHA 로드 실패");
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: "join" },
      );

      const JoinMemberReqDto = {
        email: email,
        name: name,
        nickName: nickname,
        birth: birthday,
        phoneNumber: hpNum,
        password: password,
        isEmailAgreed: agreeEmail,
        recaptchaToken: token,
      };

      const res = await api.post("/join", JoinMemberReqDto);
      //회원가입 완료 페이지
      router.push("/join/success");
    } catch (error) {
      //에러 검증 실패
      if (axios.isAxiosError(error)) {
        if (error.response?.data.httpCode == 409) {
          //이메일 중복
          setEmailError(error.response?.data?.message);
        } else {
          const field = error.response?.data?.data.field;
          const message = error.response?.data?.data.message;
          if (field && message) {
            setErrorByField(field, message);
          }
        }
      }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const setErrorByField = (field: string, message: string) => {
    switch (field) {
      case "email":
        setEmailError(message);
        break;
      case "name":
        setNameError(message);
        break;
      case "nickName":
        setNicknameError(message);
        break;
      case "birth":
        setBirthdayError(message);
        break;
      case "phoneNumber":
        setHpNumError(message);
        break;
      case "password":
        setPasswordError(message);
        break;
      default:
        alert("오류가 발생했습니다. \n 잠시후 다시 시도해 주세요.");
        return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-13 px-4 space-y-6">
      {/* 로고 */}
      {mounted && (
        <Link href="/">
          <Image
            src={
              resolvedTheme === "dark"
                ? "/logo/meetudy-dark.png"
                : "/logo/meetudy-light.png"
            }
            alt="Meetudy Logo"
            width={160}
            height={20}
          />
        </Link>
      )}

      {/* 회원가입 카드 */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">회원 가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="email"
                type="text"
                value={email}
                onBlur={handleEmailBlur}
                placeholder="you@example.com"
                ref={emailInputRef}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-xs text-red-500 mt-3">{emailError}</p>
              )}
            </div>

            <div>
              <Input
                id="name"
                placeholder="이름"
                value={name}
                onBlur={handleNameBlur}
                ref={nameInputRef}
                maxLength={50}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && (
                <p className="text-xs text-red-500 mt-3">{nameError}</p>
              )}
            </div>
            <div>
              <Input
                id="nickname"
                placeholder="닉네임"
                value={nickname}
                onBlur={handleNicknameBlur}
                ref={nicknameInputRef}
                maxLength={30}
                onChange={(e) => setNickname(e.target.value)}
              />
              {nicknameError && (
                <p className="text-xs text-red-500 mt-3">{nicknameError}</p>
              )}
            </div>
            <div>
              <Input
                id="birthday"
                type="text"
                placeholder="예: 19990101"
                inputMode="numeric"
                pattern="\d{8}"
                value={birthday}
                onBlur={handleBirthdayBlur}
                ref={birthdayInputRef}
                maxLength={8}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  setBirthday(onlyNums.slice(0, 8));
                }}
              />
              {birthdayError && (
                <p className="text-xs text-red-500 mt-3">{birthdayError}</p>
              )}
            </div>
            <div>
              <Input
                id="hpnum"
                type="text"
                placeholder="예: 01011112222"
                pattern="\d{11}"
                value={hpNum}
                onBlur={handleHpNumBlur}
                ref={hpNumInputRef}
                maxLength={11}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  setHpNum(onlyNums.slice(0, 11));
                }}
              />
              {hpNumError && (
                <p className="text-xs text-red-500 mt-3">{hpNumError}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <PasswordInput
              id="password"
              placeholder="비밀번호"
              value={password}
              onBlur={handlePasswordBlur}
              ref={passwordInputRef}
              maxLength={20}
              onChange={setPassword}
            />
            {passwordError && (
              <p className="text-xs text-red-500 mt-3">{passwordError}</p>
            )}

            {/* 비밀번호 확인 입력 */}
            <PasswordInput
              id="passwordconfirm"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onBlur={handlePasswordConfirmBlur}
              ref={passwordConfirmInputRef}
              maxLength={20}
              onChange={setPasswordConfirm}
            />
            {passwordConfirmError && (
              <p className="text-xs text-red-500 mt-3">
                {passwordConfirmError}
              </p>
            )}

            {/* ✅ Checkbox 영역 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeEmail"
                checked={agreeEmail}
                onCheckedChange={(checked) => setAgreeEmail(!!checked)}
              />
              <label
                htmlFor="agreeEmail"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                이메일 수신에 동의합니다.
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full "
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              {isLoading ? "회원가입 중..." : "회원가입"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
