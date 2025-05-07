import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    api
      .get("/api/user/me")
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return { isLoggedIn };
}
