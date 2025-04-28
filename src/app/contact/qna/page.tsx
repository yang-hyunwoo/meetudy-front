"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InquiryForm from "@/components/contact/qna/InquiryForm";
import InquiryList from "@/components/contact/qna/InquiryList";

export default function QnaPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Q&A 문의</h1>
      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="register">문의 등록</TabsTrigger>
          <TabsTrigger value="view">문의 조회</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <InquiryForm />
        </TabsContent>

        <TabsContent value="view">
          <InquiryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
