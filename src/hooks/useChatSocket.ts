"use client";
export const dynamic = "force-dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { api } from "@/lib/axios";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ChatMessageDto {
  studyGroupId: number;
  sentAt: string;
  message: string;
  senderId: number;
  nickname: string;
  id: number;
  status: string;
}

interface ChatNoticeDto {
  studyGroupId: number;
  id: number;
  message: string;
  senderId: number;
  status: string;
}

interface ChatLinkDto {
  studyGroupId: number;
  id: number;
  linkUrl: string;
  memberId: number;
  status: string;
  modifyChk: boolean;
}

export function useChatSocket(
  studyGroupId: number,
  onUserEnter?: (userIds: number[]) => void,
) {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);

  const [notices, setNotices] = useState<ChatNoticeDto[]>([]);

  const [links, setLinks] = useState<ChatLinkDto[]>([]);
  const clientRef = useRef<Client | null>(null);
  const groupIdRef = useRef(studyGroupId);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 메시지가 있는지
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoadDone, setInitialLoadDone] = useState(false);
  const [totalPageTest, setTotalPageTest] = useState(1);
  const isFetchingRef = useRef(false);
  const pageRef = useRef(0);
  const hasFetchedRef = useRef(false);
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const currentUserId = useCurrentUser()?.id;

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
        //접속시
        console.log("✅ STOMP connected");
        client.subscribe(`/topic/room.${studyGroupId}`, (message: IMessage) => {
          const jsonBody = JSON.parse(message.body);
          if (jsonBody.status === "ENTER") {
            onUserEnter?.(jsonBody.senderId); //채팅 접속 시 온라인  표시
          } else if (jsonBody.status === "LEAVE") {
            onUserEnter?.([jsonBody.senderId]);
          } else {
            const body: ChatMessageDto = jsonBody;
            setMessages((prev) => [...prev, body]); //메시지
          }
        });

        client.publish({
          //방 입장
          destination: "/app/chat.enter",
          body: JSON.stringify({ studyGroupId }),
        });

        client.subscribe("/user/queue/online", (msg) => {
          //온라인 사용자 조회
          const onlineUserIds: number[] = JSON.parse(msg.body);
          onUserEnter?.(onlineUserIds);
        });
        client.subscribe(`/topic/room.${studyGroupId}.online`, (msg) => {
          const onlineUserIds = JSON.parse(msg.body);
          onUserEnter?.(onlineUserIds); // 또는 setUsers로 직접 처리
        });

        // 공지사항
        client.subscribe(`/topic/notice.${studyGroupId}`, (msg) => {
          const notice: ChatNoticeDto = JSON.parse(msg.body);
          if (notice.status === "CREATE") {
            setNotices((prev) => [notice, ...prev]);
          } else if (notice.status === "UPDATE") {
            setNotices((prev) =>
              prev.map((n) =>
                n.id === notice.id ? { ...n, message: notice.message } : n,
              ),
            );
          } else if (notice.status === "DELETE") {
            setNotices((prev) => prev.filter((n) => n.id !== notice.id));
          }
        });

        //링크
        client.subscribe(`/topic/link.${studyGroupId}`, (msg) => {
          const links: ChatLinkDto = JSON.parse(msg.body);
          if (links.status === "CREATE") {
            links.modifyChk = links.memberId === currentUserId;

            setLinks((prev) => [links, ...prev]);
          } else if (links.status === "DELETE") {
            setLinks((prev) => prev.filter((n) => n.id !== links.id));
          }
        });
      },
      onStompError: (frame) => {
        console.error("🔴 STOMP error:", frame);
        if (frame.headers["message"]?.includes("expired")) {
          console.warn("🟡 Access token expired - refresh flow needed");
          // TODO: refresh token -> get new accessToken -> re-activate
        }
      },
      onWebSocketClose: (event) => {
        console.warn("WebSocket closed:", event);
        // reconnect 시도 로직 가능
      },

      // ✅ STOMP disconnect (optional)
      onDisconnect: (frame) => {
        console.warn("STOMP disconnected:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [studyGroupId]);

  //새로고침 , 탭 이동 시 사용자 온라인, 오프라인 여부 체크
  useEffect(() => {
    const sendLeaveMessage = () => {
      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: "/app/chat.leave",
          body: JSON.stringify({ studyGroupId }),
        });
      }
    };

    const sendEnterMessage = () => {
      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: "/app/chat.enter",
          body: JSON.stringify({ studyGroupId }),
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendLeaveMessage();
      } else if (document.visibilityState === "visible") {
        // 딜레이 주는게 안정적
        setTimeout(() => {
          sendEnterMessage();
        }, 100); // 예: 100ms 정도
      }
    };

    // 브라우저 종료
    window.addEventListener("beforeunload", sendLeaveMessage);
    window.addEventListener("pagehide", sendLeaveMessage); // 모바일 대응

    // 탭 전환 감지
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      sendLeaveMessage(); // 언마운트 시도
      window.removeEventListener("beforeunload", sendLeaveMessage);
      window.removeEventListener("pagehide", sendLeaveMessage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [studyGroupId]);

  //첫 페이지 진입 시
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    setMessages([]);
    setHasMore(true);
    setInitialLoadDone(false);
    pageRef.current = 1; // 첫 페이지 로드 이후부터 시작
    fetchMessages(0).then(() => setInitialLoadDone(true));
    NoticeList();
    LinkList();
  }, [studyGroupId]);

  const NoticeList = async () => {
    const res = await api.get(`/private/chat/${studyGroupId}/notice/list`);
    console.log(res.data.data);
    const data: ChatNoticeDto[] = res.data.data;
    setNotices((prev) => {
      const merged = [...data, ...prev];
      const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
      return unique;
    });
  };

  const LinkList = async () => {
    console.log(currentUserId);
    const res = await api.get(`/private/chat/${studyGroupId}/link/list`);
    console.log(res.data.data);
    const data: ChatLinkDto[] = res.data.data;
    const withModifyFlag = data.map((link) => ({
      ...link,
      modifyChk: link.memberId === currentUserId,
    }));

    setLinks((prev) => {
      const merged = [...withModifyFlag, ...prev];
      const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
      return unique;
    });
  };

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

  // 메시지 전송
  const sendMessage = (msg: string) => {
    if (clientRef.current?.connected) {
      const payload: ChatMessageDto = {
        studyGroupId: groupIdRef.current,
        message: msg,
        senderId: 0, // 서버에서 지정됨
        nickname: "",
        sentAt: "",
        id: 0,
        status: "SEND",
      };

      clientRef.current.publish({
        destination: `/app/chat.send`,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("🔴 STOMP client is not connected.");
    }
  };

  //공지 전송
  const sendNotice = (msg: string, type: string, id: number) => {
    if (clientRef.current?.connected) {
      const payload: ChatNoticeDto = {
        studyGroupId: groupIdRef.current,
        message: msg,
        senderId: 0, // 서버에서 지정됨
        id: id,
        status: type,
      };

      clientRef.current.publish({
        destination: `/app/notice.send`,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("🔴 STOMP client is not connected.");
    }
  };

  //링크 전송
  const sendLink = (msg: string, type: string, id: number) => {
    if (clientRef.current?.connected) {
      const payload: ChatLinkDto = {
        studyGroupId: groupIdRef.current,
        linkUrl: msg,
        memberId: 0, // 서버에서 지정됨
        id: id,
        status: type,
        modifyChk: true,
      };

      clientRef.current.publish({
        destination: `/app/link.send`,
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
    isInitialLoadDone,
    sendNotice,
    notices,
    sendLink,
    links,
  };
}
