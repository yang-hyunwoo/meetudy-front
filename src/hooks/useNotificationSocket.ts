"use client";
export const dynamic = "force-dynamic";
import { Client } from "@stomp/stompjs";
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { api } from "@/lib/axios";

interface NotificationResDto {
  id: number;
  message: string;
  linkUrl: string;
}

export function useNotificationSocket() {
  const [notification, setNotification] = useState<NotificationResDto[]>([]);
  const clientRef = useRef<Client | null>(null);
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
            `/ws-notification?accessToken=${accessToken}`,
        ),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("notification connected");

        subscription = client.subscribe("/user/queue/notification", (msg) => {
          const notification: NotificationResDto = JSON.parse(msg.body);

          setNotification((prev) => {
            const index = prev.findIndex((item) => item.id === notification.id);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                message: notification.message,
                linkUrl: notification.linkUrl,
              };
              return updated;
            } else {
              return [notification, ...prev];
            }
          });
        });
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
      if (subscription) {
        subscription.unsubscribe(); // 👈 구독 해제
      }
      client.deactivate(); // 연결 해제
    };
  }, []);

  useEffect(() => {
    notificationList();
  }, []);

  const notificationList = async () => {
    try {
      const res = await api.get(`/private/notification/list`);
      const notificationData = res.data.data;
      setNotification(notificationData);
    } catch (err: any) {
      if (err.response?.data?.errCode) {
        // 에러 처리
      }
    }
  };

  const handleRead = async (notificationId: number, href: string) => {
    try {
      const res = await api.put(`/private/notification/${notificationId}/read`);
      if (res.data.httpCode === 200) {
        setNotification((prev) =>
          prev.filter((item) => item.id !== notificationId),
        );
        if (href && href.trim() !== "") {
          window.location.href = href;
        }
      }
    } catch (err) {
      console.error("알림 읽음 실패", err);
    }
  };

  return {
    notification,
    handleRead,
  };
}
