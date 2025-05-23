"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface TagOverflowProps {
  tags: string[];
}

export default function GroupTagOverflow({ tags }: TagOverflowProps) {
  const [visibleCount, setVisibleCount] = useState(tags.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const measurerRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!measurerRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const children = Array.from(measurerRef.current.children) as HTMLElement[];

    let total = 0;
    let fit = tags.length;

    for (let i = 0; i < children.length; i++) {
      const width = children[i].offsetWidth + 8;
      total += width;

      const hasMore = i < tags.length - 1;
      const moreBtnSize = 40;

      if (total + (hasMore ? moreBtnSize : 0) > containerWidth) {
        fit = i;
        break;
      }
    }

    if (fit === 0 && tags.length > 0) fit = 1;

    setVisibleCount(fit);
    setReady(true);
  }, [tags]);

  const visible = tags.slice(0, visibleCount);
  const hidden = tags.slice(visibleCount);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* 실제 표시 영역 */}
      {ready && (
        <div className="flex gap-2 overflow-hidden">
          {visible.map((tag, i) => (
            <span
              key={`visible-${tag}-${i}`}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full whitespace-nowrap flex-shrink-0"
            >
              #{tag}
            </span>
          ))}
          {hidden.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="px-2 py-0 h-6 text-xs rounded-full flex-shrink-0"
                >
                  +{hidden.length}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit max-w-xs flex flex-wrap gap-2">
                {hidden.map((tag, i) => (
                  <span
                    key={`hidden-${tag}-${i}`}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      {/* 가상 측정기 */}
      <div
        ref={measurerRef}
        className="flex gap-2 absolute invisible pointer-events-none h-0 overflow-hidden"
      >
        {tags.map((tag, i) => (
          <span
            key={`measure-${tag}-${i}`}
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full whitespace-nowrap"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
