"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MessagesTab from "@/components/mypage/MessagesTab";
import PostsTab from "@/components/mypage/PostsTab";
import MyInfoTab from "@/components/mypage/MyInfoTab";

export default function MyPageTabs() {
  return (
    <Tabs defaultValue="myinfo" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="myinfo">내 정보</TabsTrigger>
        <TabsTrigger value="messages">쪽지함</TabsTrigger>
        <TabsTrigger value="posts">내가 쓴 글</TabsTrigger>
      </TabsList>

      <TabsContent value="myinfo">
        <MyInfoTab />
      </TabsContent>

      <TabsContent value="messages">
        <MessagesTab />
      </TabsContent>

      <TabsContent value="posts">
        <PostsTab />
      </TabsContent>
    </Tabs>
  );
}
