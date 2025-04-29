"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-900 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <p>© {new Date().getFullYear()} meetudy. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link
            href="https://coder-newbie.tistory.com/"
            className="hover:underline"
            target="_blank"
          >
            tistory
          </Link>
          <Link
            href="https://github.com/yang-hyunwoo/meetudy-front"
            className="hover:underline"
            target="_blank"
          >
            github
          </Link>
        </div>
      </div>
    </footer>
  );
}
