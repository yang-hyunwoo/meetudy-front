"use client";
export const dynamic = "force-dynamic";

import { Client } from "@stomp/stompjs";
import { useEffect, useState, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { api } from "@/lib/axios";
import dayjs from "dayjs";

interface Message {
  id: string;
  senderId: number;
  nickname: string;
  content: string;
  sendAt: string;
  read: boolean;
}

export function useMessageSocket(
  tab: "received" | "sent",
  page: number,
  size: number = 5,
) {
  const [message, setMessage] = useState<Message[]>([]);
  const clientRef = useRef<Client | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const hasFetchedRef = useRef(false);
  const fetchMessageList = useCallback(async () => {
    try {
      const url =
        tab === "received"
          ? "/private/mypage/message/receive/list"
          : "/private/mypage/message/send/list";

      const res = await api.get(url, {
        params: {
          page: page - 1,
          size,
        },
      });

      if (res.data.httpCode === 200) {
        const formatted = res.data.data.content.map((item: any) => ({
          ...item,
          sendAt: dayjs(item.sendAt).format("YYYY-MM-DD"),
        }));
        setMessage(formatted);
        setTotalElements(res.data.data.totalElements);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err) {
      console.error("쪽지 목록 조회 실패", err);
    }
  }, [tab, page, size]);

  useEffect(() => {
    fetchMessageList();
  }, [fetchMessageList]);

  const pageRef = useRef(page);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const totalPagesRef = useRef(totalPages);

  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  const totalElementsRef = useRef(totalElements);

  useEffect(() => {
    totalElementsRef.current = totalElements;
  }, [totalElements]);

  useEffect(() => {
    let subscription: any = null;
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    if (!accessToken) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(
          process.env.NEXT_PUBLIC_URL +
            `/ws-message?accessToken=${accessToken}`,
        ),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("message connected");

        if (tab === "received") {
          subscription = client.subscribe("/user/queue/message", (msg) => {
            const raw: Message = JSON.parse(msg.body);

            const newMessage: Message = {
              ...raw,
              sendAt: dayjs(raw.sendAt).format("YYYY-MM-DD"),
            };
            totalElementsRef.current++;
            setMessage((prev) => {
              if (pageRef.current === 1) {
                const updated = [newMessage, ...prev];
                const trimmed = updated.slice(0, size);
                let totalCount = Math.ceil(totalElementsRef.current / size);

                setTotalPages((prevTotal) => Math.max(prevTotal, totalCount));
                return trimmed;
              } else {
                let totalCount = Math.ceil(totalElementsRef.current / size);
                setTotalPages((prevTotal) => Math.max(prevTotal, totalCount));
                return prev;
              }
            });
          });
        }
      },
      onStompError: (frame) => {
        console.error("🔴 STOMP error:", frame);
      },
      onWebSocketClose: (event) => {
        console.warn("WebSocket closed:", event);
      },
      onDisconnect: (frame) => {
        console.warn("STOMP disconnected:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (subscription) subscription.unsubscribe();
      client.deactivate();
    };
  }, [tab]);

  const markMessageAsRead = (id: string) => {
    setMessage((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)),
    );
  };

  const handleDelete = (id: string) => {
    //setMessage((prev) => prev.filter((g) => g.id !== id));
    fetchMessageList();
  };

  return {
    message,
    totalPages,
    refetch: fetchMessageList,
    markMessageAsRead,
    handleDelete,
  };
}
