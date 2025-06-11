import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export function useCurrentUser() {
  const [user, setUser] = useState<{ id: number; nickname: string } | null>(
    null,
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api
        .get("/user/me")
        .then((res) => {
          setUser(res.data.data);
        })
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  return user;
}
