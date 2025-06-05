"use client";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import { api } from "@/lib/axios";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {" "}
            {/* ⭐ Provider로 전체 감싸기 */}
            <NextTopLoader color="#7c3aed" height={3} showSpinner={false} />
            <LayoutContents>{children}</LayoutContents>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function LayoutContents({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, checkAuth } = useAuthContext();
  const pathname = usePathname();
  const authPages = ["/login", "/join", "/mypage/withdraw"];
  const isAuthPage = authPages.some((path) => pathname?.startsWith(path));

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("accessToken");
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      checkAuth(); // ⭐ 상태 업데이트
      window.location.href = "/";
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
