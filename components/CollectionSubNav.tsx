"use client";

import { useRef } from "react";
import { NAV_COLLECTIONS } from "@/data/storeData";

type CollectionSubNavProps = {
  selectedCollection: string;
  onSelectCollection: (col: string) => void;
};

export default function CollectionSubNav({
  selectedCollection,
  onSelectCollection,
}: CollectionSubNavProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-11 flex items-center justify-between gap-2">
        <div
          ref={scrollRef}
          className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 flex-1"
        >
          {NAV_COLLECTIONS.map((item) => {
            const isActive = selectedCollection === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onSelectCollection(item)}
                className={`text-xs sm:text-[13px] whitespace-nowrap transition cursor-pointer pb-1 border-b-2 ${
                  isActive
                    ? "font-bold text-neutral-950 border-emerald-600"
                    : "font-medium text-neutral-700 hover:text-neutral-950 border-transparent"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleScrollRight}
          aria-label="Scroll collections right"
          className="shrink-0 w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 text-sm font-bold transition cursor-pointer"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}