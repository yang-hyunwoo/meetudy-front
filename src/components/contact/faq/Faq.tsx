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
import DOMPurify from "dompurify";
import "@/components/common/editor/TiptapEditor.css";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import axios from "axios";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  faqType: string;
}
const sanitize = (html: string) =>
  typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;

const ITEMS_PER_PAGE = 10;
const CATEGORIES = ["전체", "출석", "과제", "계정", "서비스"];

export default function Faq() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const CATEGORY_MAP: Record<string, string> = {
    전체: "ALL",
    출석: "ATTENDANCE",
    과제: "ASSIGNMENT",
    계정: "ACCOUNT",
    서비스: "SERVICE",
  };
  useEffect(() => {
    fetchFaqs();
  }, [currentPage, selectedCategory]);

  const fetchFaqs = async () => {
    try {
      const mappedType = CATEGORY_MAP[selectedCategory];

      const params: any = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        question: searchInput?.trim(),
      };

      if (mappedType && mappedType !== "ALL") {
        params.faqType = mappedType;
      }

      const res = await api.get("/contact/faq", { params });

      if (res.data.httpCode === 200) {
        setTotalPages(res.data.data.totalPages);
        setFaqs(res.data.data.content);
      }
    } catch (error) {
      console.error("FAQ 로딩 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFaqs();
  };

  if (isLoading) {
    return <div className="text-center py-6">로딩 중...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">FAQ</h1>
      {/* 검색 필드 */}
      <FaqSearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
      />
      {/* 카테고리 필터 */}
      <FaqCategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
      />
      {/* Q&A 안내 영역 (조건부) */}
      {faqs.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mb-6">
          <p className="mb-2">
            찾으시는 답변이 없다면{" "}
            <span className="font-semibold text-black dark:text-white">
              Q&A 게시판
            </span>
            을 이용해보세요.
          </p>
          <a
            href="/contact/qna"
            className="inline-block text-sm font-medium px-4 py-2 rounded transition
                    text-white 
                    bg-gray-800 hover:bg-gray-900
                    dark:bg-violet-500 dark:hover:bg-violet-600"
          >
            Q&A 바로가기
          </a>
        </div>
      )}
      {/* FAQ 아코디언 */}
      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <div
                className="ProseMirror"
                dangerouslySetInnerHTML={{
                  __html: sanitize(faq.answer),
                }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
