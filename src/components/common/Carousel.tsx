import React from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CarouselItemType {
  title: string;
  description: string;
  imageUrl: string;
  href?: string;
}

interface MainCarouselProps {
  items: CarouselItemType[];
}

export default function MainCarousel({ items }: MainCarouselProps) {
  return (
    <div className="w-full bg-muted py-20 px-8 rounded-3xl">
      <Carousel className="w-full max-w-[1600px] mx-auto">
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="px-8 md:px-12 lg:px-20">
              <Link
                href={item.href || "#"}
                className="block group"
                prefetch={false}
              >
                <Card
                  className="flex flex-col md:flex-row items-center 
                               justify-between p-8 md:p-16 bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl 
                               gap-8 md:gap-14 min-h-[380px] 
                               transition-transform duration-200 group-hover:scale-[1.015]"
                >
                  <div className="flex-1 w-full md:w-auto text-center md:text-left">
                    <span className="text-base font-semibold text-rose-500">
                      {item.title}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mt-4 md:mt-6 mb-6 md:mb-8 text-gray-900 dark:text-gray-100 leading-snug">
                      {item.description}
                    </h2>
                  </div>
                  <div className="relative w-full h-[200px] md:w-[480px] md:h-[300px]">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-contain rounded-xl"
                    />
                  </div>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
