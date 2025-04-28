"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinksTabProps {
  validLinks: string[];
  linkInput: string;
  onLinkInputChange: (value: string) => void;
  onAddLink: () => void;
}

export default function LinksTab({
  validLinks,
  linkInput,
  onLinkInputChange,
  onAddLink,
}: LinksTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="list-disc list-inside text-sm">
        {validLinks.map((link, idx) => (
          <li key={idx}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t">
        <Input
          value={linkInput}
          onChange={(e) => onLinkInputChange(e.target.value)}
          placeholder="https://example.com"
          className="mb-2"
        />
        <Button size="sm" className="w-full" onClick={onAddLink}>
          링크 추가
        </Button>
      </div>
    </div>
  );
}
