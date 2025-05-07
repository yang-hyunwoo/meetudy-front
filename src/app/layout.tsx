"use client";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer"; // ← 경로 맞게 수정
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useAuth } from "@/hooks/useAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn);
  const pathname = usePathname();
  const authPages = ["/login", "/join"];
  const isAuthPage = authPages.some((path) => pathname?.startsWith(path));
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextTopLoader color="#7c3aed" height={3} showSpinner={false} />
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            {!isAuthPage && <Header isLoggedIn={isLoggedIn} />}

            {/* Main content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
