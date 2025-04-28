"use client";

import Image from "next/image";

export default function Abouts() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative py-20 px-6 sm:px-12 text-center bg-gradient-to-br from-violet-100 via-white to-white dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          함께 성장하는 스터디 플랫폼,{" "}
          <span className="text-violet-600 dark:text-violet-400">Meetudy</span>
        </h1>
        <p
          className="text-lg sm:text-xl font-medium leading-relaxed
                     text-gray-700 drop-shadow-sm         
                     dark:text-gray-50 dark:drop-shadow-md"
          style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
        >
          Meetudy는 온라인에서도 오프라인 못지않은 몰입감 있는 <br />
          학습 환경을 제공합니다.
          <br />
          스터디의 모든 과정을 한 곳에서 체계적으로 관리하세요.
        </p>

        {/* 삽화 */}
        <div className="mt-10 flex justify-center">
          <Image
            src="/images/meetudy-about.png"
            alt="스터디 플랫폼 삽화"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="py-16 px-6 sm:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          ✨ Meetudy 기능 소개
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: "👥",
              title: "스터디 그룹 생성 및 참여",
              desc: "누구나 쉽게 스터디를 만들고, 다양한 주제의 그룹에 자유롭게 참여할 수 있어요.",
            },
            {
              icon: "🗓️",
              title: "일정/출석/과제 통합 관리",
              desc: "일정 등록, 출석 체크, 과제 제출 기능으로 참여율을 높이고 진도를 관리할 수 있습니다.",
            },
            {
              icon: "💬",
              title: "그룹 내 커뮤니케이션",
              desc: "댓글, 공지사항, 채팅 기능으로 구성원 간 원활한 소통을 도와줍니다.",
            },
            {
              icon: "🔐",
              title: "소셜 로그인 지원",
              desc: "Google, Kakao, Naver 계정으로 간편하고 빠르게 로그인할 수 있습니다.",
            },
          ].map((feature, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="text-3xl">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Meetudy */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">📚 Meetudy가 특별한 이유</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            혼자보다는 함께할 때 더 큰 동기부여가 생깁니다.
            <br />
            Meetudy는 스터디 구성원들이 서로를 격려하고 피드백을 주고받으며{" "}
            <br />
            함께 성장할 수 있도록 설계된 공간입니다.
            <br />
            단순한 협업을 넘어, 진짜 성장을 경험해보세요.
          </p>
        </div>
      </section>

      {/* CTA (Call to Action) */}
      <section className="py-20 text-center">
        <h3 className="text-2xl font-semibold mb-4">
          지금 바로 Meetudy를 시작해보세요
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          공부 습관, 지금 여기서 만들어 보세요.
        </p>
      </section>
    </div>
  );
}
