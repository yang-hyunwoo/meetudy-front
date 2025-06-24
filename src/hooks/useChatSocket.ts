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

interface ChatDocumentDto {
  studyGroupId: number;
  memberId: number;
  fileId: number;
  status?: "CREATE" | "READ" | "DELETE"; // enum 가능
  file: FileMessage;
  modifyChk: boolean;
  id: number;
  fileDetailId: number;
}

interface FileMessage {
  filesDetails: FilesDetailsDto[];
}

interface FilesDetailsDto {
  id: number;
  originFileName: string;
  fileUrl: string;
  filesId: number;
  memberId: number;
  modifyChk: boolean;
}

interface User {
  memberId: number;
  name: string;
  nickname: string;
  thumbnailFileUrl?: string;
  online?: boolean;
  isLate?: boolean;
}

export function useChatSocket(
  studyGroupId: number,
  onUserEnter?: (userIds: number[]) => void,
  onUserJoin?: (newUser: User) => void,
  onUserLeave?: (newUser: User) => void,
  errorMessage?: string,
) {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);

  const [notices, setNotices] = useState<ChatNoticeDto[]>([]);
  const [documents, setDocuments] = useState<ChatDocumentDto[]>([]);
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
  const currentUserId = useCurrentUser()?.id;

  useEffect(() => {
    groupIdRef.current = studyGroupId;

    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    if (!accessToken) return;
    if (errorMessage) return;
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(
          process.env.NEXT_PUBLIC_URL +
            `/ws-chat?accessToken=${accessToken}&studyGroupId=${studyGroupId}`,
        ),
      reconnectDelay: 5000, // 자동 재연결 시도
      onConnect: () => {
        //접속시
        console.log(" STOMP connected");
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

        //링크 구독
        client.subscribe(`/topic/link.${studyGroupId}`, (msg) => {
          const links: ChatLinkDto = JSON.parse(msg.body);
          if (links.status === "CREATE") {
            links.modifyChk = links.memberId === currentUserId;

            setLinks((prev) => [links, ...prev]);
          } else if (links.status === "DELETE") {
            setLinks((prev) => prev.filter((n) => n.id !== links.id));
          }
        });

        //그룹 가입 사용자
        client.subscribe(`/topic/group.${studyGroupId}.member.join`, (msg) => {
          const newUser: User = JSON.parse(msg.body);
          onUserJoin?.(newUser);
        });

        //그룹 탈퇴 사용자
        client.subscribe(`/topic/group.${studyGroupId}.member.leave`, (msg) => {
          const newUser: User = JSON.parse(msg.body);
          onUserLeave?.(newUser);
        });

        //자료 구독
        client.subscribe(`/topic/document.${studyGroupId}`, (msg) => {
          const newDocument: ChatDocumentDto = JSON.parse(msg.body);

          if (newDocument.status === "CREATE") {
            //실시간 생성
            newDocument.modifyChk = newDocument.memberId === currentUserId;
            setDocuments((prev) => [newDocument, ...prev]);
          } else if (newDocument.status === "DELETE") {
            //실시간 삭제
            setDocuments((prev) =>
              prev
                .map((doc) => {
                  const originalFiles = doc.file.filesDetails;
                  const updatedFiles = originalFiles.filter(
                    (f) => f.id !== newDocument.fileDetailId,
                  );

                  const wasDeleted =
                    updatedFiles.length !== originalFiles.length;

                  if (wasDeleted) {
                    if (updatedFiles.length > 0) {
                      return {
                        ...doc,
                        file: {
                          ...doc.file,
                          filesDetails: updatedFiles,
                        },
                      };
                    } else {
                      return null;
                    }
                  }

                  return doc;
                })
                .filter((v): v is ChatDocumentDto => v !== null),
            );
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
  }, [studyGroupId, currentUserId, errorMessage]);

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
    if (errorMessage) return;
    setMessages([]);
    setHasMore(true);
    setInitialLoadDone(false);
    pageRef.current = 1; // 첫 페이지 로드 이후부터 시작
    fetchMessages(0).then(() => setInitialLoadDone(true));
    NoticeList();
  }, [studyGroupId, errorMessage]);

  useEffect(() => {
    if (errorMessage) return;
    if (currentUserId !== undefined) {
      LinkList();
      DocumentList();
    }
  }, [currentUserId, errorMessage]);

  const NoticeList = async () => {
    const res = await api.get(`/private/chat/${studyGroupId}/notice/list`);
    const data: ChatNoticeDto[] = res.data.data;
    setNotices((prev) => {
      const merged = [...data, ...prev];
      const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
      return unique;
    });
  };

  const LinkList = async () => {
    const res = await api.get(`/private/chat/${studyGroupId}/link/list`);
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

  const DocumentList = async () => {
    const res = await api.get(`/private/chat/${studyGroupId}/document/list`);
    const data: ChatDocumentDto[] = res.data.data;
    const withModifyFlag = data.map((document) => ({
      ...document,
      modifyChk: document.memberId === currentUserId,
    }));
    setDocuments((prev) => {
      const merged = [...withModifyFlag, ...prev];
      const unique = Array.from(
        new Map(merged.map((m) => [m.fileId, m])).values(),
      );
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
  const sendDocument = (payload: {
    fileId: number;
    memberId: number;
    filesDetails: {
      id: number;
      filesId: number;
      originFileName: string;
      fileUrl: string;
      publicId: string;
    }[];
  }) => {
    if (clientRef.current?.connected) {
      const fileMessage = {
        studyGroupId: groupIdRef.current,
        senderId: 0, // 서버에서 설정
        sentAt: "",
        id: 0,
        status: "CREATE",
        message: "", // 메시지는 비워두고
        file: payload, // 실제 파일 정보 전달
        fileId: payload.fileId,
      };

      clientRef.current.publish({
        destination: `/app/document.send`,
        body: JSON.stringify(fileMessage),
      });
    } else {
      console.warn("🔴 STOMP client is not connected.");
    }
  };

  const deleteDocument = (id: number, fileId: number, fileDetailId: number) => {
    if (clientRef.current?.connected) {
      const fileMessage = {
        studyGroupId: groupIdRef.current,
        senderId: 0, // 서버에서 설정
        sentAt: "",
        id: id,
        status: "DELETE",
        message: "", // 메시지는 비워두고
        fileId: fileId,
        fileDetailId: fileDetailId,
      };

      clientRef.current.publish({
        destination: `/app/document.send`,
        body: JSON.stringify(fileMessage),
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
    sendDocument,
    documents,
    deleteDocument,
  };
}
