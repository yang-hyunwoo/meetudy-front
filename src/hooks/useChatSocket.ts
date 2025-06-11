export const dynamic = "force-dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { api } from "@/lib/axios";

interface ChatMessageDto {
  studyGroupId: number;
  sentAt: string;
  message: string;
  senderId: number;
  nickname: string;
  id: number;
}

export function useChatSocket(studyGroupId: number) {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const clientRef = useRef<Client | null>(null);
  const groupIdRef = useRef(studyGroupId);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 메시지가 있는지
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoadDone, setInitialLoadDone] = useState(false);
  const [totalPageTest, setTotalPageTest] = useState(1);
  const isFetchingRef = useRef(false);
  const pageRef = useRef(0);
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    groupIdRef.current = studyGroupId;

    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    if (!accessToken) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(
          `http://localhost:8080/ws-chat?accessToken=${accessToken}&studyGroupId=${studyGroupId}`,
        ),
      reconnectDelay: 5000, // 자동 재연결 시도
      onConnect: () => {
        console.log("✅ STOMP connected");
        client.subscribe(`/topic/room.${studyGroupId}`, (message: IMessage) => {
          const body: ChatMessageDto = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });
      },
      onStompError: (frame) => {
        console.error("🔴 STOMP error:", frame);
        if (frame.headers["message"]?.includes("expired")) {
          console.warn("🟡 Access token expired - refresh flow needed");
          // TODO: refresh token -> get new accessToken -> re-activate
        }
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [studyGroupId]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    setMessages([]);
    setHasMore(true);
    setInitialLoadDone(false);
    pageRef.current = 1; // 첫 페이지 로드 이후부터 시작
    fetchMessages(0).then(() => setInitialLoadDone(true));
  }, [studyGroupId]);

  const fetchMessages = useCallback(
    async (targetPage: number) => {
      if (isFetching || !hasMore || targetPage >= totalPageTest) return;
      setIsFetching(true);
      try {
        const res = await api.get(`/private/chat/${studyGroupId}/list`, {
          params: { page: targetPage, size: 30 },
        });
        const data: ChatMessageDto[] = res.data.data.content;
        setTotalPageTest(res.data.data.totalPages);
        const reversed = [...data].reverse();
        setMessages((prev) => {
          const merged = [...reversed, ...prev];
          const unique = Array.from(
            new Map(merged.map((m) => [m.id, m])).values(),
          );
          return unique;
        });

        if (targetPage + 1 >= res.data.data.totalPages) {
          setHasMore(false);
        }
      } finally {
        setIsFetching(false);
      }
    },
    [isFetching, hasMore, totalPageTest, studyGroupId],
  );

  const fetchMoreMessages = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    const targetPage = pageRef.current;
    try {
      await fetchMessages(targetPage);
      pageRef.current += 1;
    } finally {
      isFetchingRef.current = false;
    }
  }, [fetchMessages]);

  const sendMessage = (msg: string) => {
    if (clientRef.current?.connected) {
      const payload: ChatMessageDto = {
        studyGroupId: groupIdRef.current,
        message: msg,
        senderId: 0, // 서버에서 지정됨
        nickname: "",
        sentAt: "",
        id: 0,
      };

      clientRef.current.publish({
        destination: `/app/chat.send`,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("🔴 STOMP client is not connected.");
    }
  };
  return {
    sendMessage,
    messages,
    fetchMoreMessages,
    hasMore,
    pageRef,
    isInitialLoadDone, // ⬅ 추가
  };
}
