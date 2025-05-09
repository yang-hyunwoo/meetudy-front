import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      api
        .get("/user/me")
        .then(() => setIsLoggedIn(true))
        .catch(() => setIsLoggedIn(false));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return { isLoggedIn };
}
