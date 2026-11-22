"use client";

import { useState } from "react";
import { COLLECTIONS, CollectionItem } from "@/data/storeData";

type CollectionsRowProps = {
  collections?: CollectionItem[];
  selectedCollection: string;
  onSelectCollection: (col: string) => void;
};

const PROMO_ITEMS = [
  "✦ 30M+ Happy Customers",
  "✦ Free Delivery over Rs 2000",
  "✦ 7 Days Replacement & 1 Year Warranty",
  "✦ Cash On Delivery All Over Pakistan",
];

export default function CollectionsRow({
  collections = COLLECTIONS,
  selectedCollection,
  onSelectCollection,
}: CollectionsRowProps) {
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  return (
    <>
      <style jsx>{`
        @keyframes growmoreMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-growmore-marquee {
          display: flex;
          width: max-content;
          animation: growmoreMarquee 45s linear infinite;
        }
        .marquee-wrapper:hover .animate-growmore-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-wrapper w-full bg-white border-b border-neutral-100 py-3 overflow-hidden">
        <div className="animate-growmore-marquee items-center text-[11px] sm:text-xs font-semibold text-neutral-800 whitespace-nowrap">
          {[...PROMO_ITEMS, ...PROMO_ITEMS, ...PROMO_ITEMS, ...PROMO_ITEMS].map(
            (text, idx) => (
              <span key={idx} className="mx-8 sm:mx-14 inline-block">
                {text}
              </span>
            )
          )}
        </div>
      </div>

      <section id="collections" className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-start justify-between gap-4 sm:gap-6 overflow-x-auto pb-3">
          {collections.map((col) => {
            const isActive = selectedCollection === col.filterValue;
            const showFallback = brokenImages[col.imagePath];

            return (
              <button
                key={col.label}
                type="button"
                onClick={() =>
                  onSelectCollection(
                    selectedCollection === col.filterValue ? "All" : col.filterValue
                  )
                }
                className="group flex flex-col items-center text-center min-w-[120px] sm:min-w-[140px] flex-1 cursor-pointer"
              >
                <div
                  className={`relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                    isActive
                      ? "bg-neutral-200 ring-2 ring-emerald-600 ring-offset-2"
                      : "bg-[#EFEFEF] group-hover:bg-[#E5E5E5]"
                  }`}
                >
                  {!showFallback && col.imagePath ? (
                    <img
                      src={col.imagePath}
                      alt={col.label}
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [col.imagePath]: true }))
                      }
                      className="w-full h-full object-cover object-center block"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl select-none">
                      {col.fallbackIcon}
                    </span>
                  )}
                </div>

                <span
                  className={`mt-3 text-[11px] sm:text-xs font-bold tracking-wider uppercase leading-snug max-w-[145px] ${
                    isActive ? "text-black underline underline-offset-4" : "text-neutral-900"
                  }`}
                >
                  {col.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}