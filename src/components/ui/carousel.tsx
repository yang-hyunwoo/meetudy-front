// components/ui/carousel.tsx
"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function Carousel({ children, className, ...props }: CarouselProps) {
  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  return (
    <div ref={emblaRef} className={cn("overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

export function CarouselContent({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-4">{children}</div>;
}

export function CarouselItem({
  children,
  className,
  ...props
}: CarouselItemProps) {
  return (
    <div className={cn("min-w-full", className)} {...props}>
      {children}
    </div>
  );
}

export function CarouselPrevious({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );
}

export function CarouselNext({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  );
}
