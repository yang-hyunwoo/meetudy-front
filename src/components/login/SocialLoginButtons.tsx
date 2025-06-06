"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const providers = [
  { id: "naver", label: "Naver" },
  { id: "kakao", label: "Kakao" },
  { id: "google", label: "Google" },
];

export default function SocialLoginButtons() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {providers.map(({ id, label }) => (
        <Button
          key={id}
          variant="outline"
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Image src={`/icons/${id}.svg`} alt={label} width={20} height={20} />
          {label}
        </Button>
      ))}
    </div>
  );
}
