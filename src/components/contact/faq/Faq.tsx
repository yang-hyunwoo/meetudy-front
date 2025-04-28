"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import CustomPagination from "@/components/common/pagination/Pagination";
import FaqSearchBar from "@/components/common/search/SearchBar";
import FaqCategoryFilter from "@/components/contact/faq/FaqCategoryFilter";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const ITEMS_PER_PAGE = 10;
const CATEGORIES = ["전체", "출석", "과제", "계정", "서비스"];

const mockFaqs: FaqItem[] = [
  {
    id: "1",
    question: "Meetudy는 어떤 서비스인가요?",
    answer: "Meetudy는 스터디를 체계적으로 관리할 수 있는 플랫폼입니다.",
    category: "서비스",
  },
  {
    id: "2",
    question: "스터디는 어떻게 생성하나요?",
    answer: "회원가입 후 스터디 생성 버튼을 통해 만들 수 있습니다.",
    category: "서비스",
  },
  {
    id: "3",
    question: "출석 체크는 어디서 하나요?",
    answer:
      "스터디 페이지에서 출석 탭을 통해 체크할 수 있어요.스터디 페이지에서 출석 탭을 통해 체크할 수 있어요.스터디 페이지에서 출석 탭을 통해 체크할 수 있어요.스터디 페이지에서 출석 탭을 통해 체크할 수 있어요.스터디 페이지에서 출석 탭을 통해 체크할 수 있어요.",
    category: "출석",
  },
  {
    id: "4",
    question: "과제는 어떻게 등록하나요?",
    answer: "스터디 관리자가 과제를 등록할 수 있습니다.",
    category: "과제",
  },
  {
    id: "5",
    question: "모바일에서도 사용할 수 있나요?",
    answer: "네, 반응형으로 모바일에서도 편하게 이용할 수 있어요.",
    category: "서비스",
  },
  {
    id: "6",
    question: "소셜 로그인은 어떤 게 있나요?",
    answer: "Google, Kakao, Naver 로그인을 지원합니다.",
    category: "계정",
  },
  {
    id: "7",
    question: "비밀번호를 잊어버렸어요.",
    answer: "로그인 페이지에서 비밀번호 재설정을 클릭하세요.",
    category: "계정",
  },
];

export default function Faq() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const filteredFaqs = mockFaqs
    .filter(
      (faq) => selectedCategory === "전체" || faq.category === selectedCategory,
    )
    .filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredFaqs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">FAQ</h1>
      {/* 검색 필드 */}
      <FaqSearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
      />
      {/* Q&A 안내 영역 (조건부) */}
      {filteredFaqs.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mb-6">
          <p className="mb-2">
            찾으시는 답변이 없다면{" "}
            <span className="font-semibold text-black dark:text-white">
              Q&A 게시판
            </span>
            을 이용해보세요.
          </p>
          <a
            href="/qna"
            className="inline-block text-sm font-medium px-4 py-2 rounded transition
                    text-white 
                    bg-gray-800 hover:bg-gray-900
                    dark:bg-violet-500 dark:hover:bg-violet-600"
          >
            Q&A 바로가기
          </a>
        </div>
      )}
      {/* 카테고리 필터 */}
      <FaqCategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
      />
      {/* FAQ 아코디언 */}
      <Accordion type="single" collapsible className="w-full space-y-2">
        {currentItems.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* 페이징 */}
      <div className="mt-8 flex justify-center">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
