"use client";

import { CollectionItem } from "@/data/storeData";
import { resolveMediaUrl } from "@/data/storeConfig";

interface CollectionsRowProps {
  collections: CollectionItem[];
  selectedCollection: string;
  onSelectCollection: (col: string) => void;
}

const DEFAULT_8_CATEGORIES: {
  label: string;
  filterValue: string;
  icon: string;
}[] = [
  { label: "Phone Cases", filterValue: "Phone Cases", icon: "📱" },
  { label: "Earbuds", filterValue: "Earbuds & Headphones", icon: "🎧" },
  { label: "Chargers", filterValue: "Chargers & Cables", icon: "🔌" },
  { label: "Power Banks", filterValue: "Power Banks", icon: "🔋" },
  { label: "Screen Protectors", filterValue: "Screen Protectors", icon: "🛡️" },
  { label: "Holders", filterValue: "Phone Holders", icon: "🚗" },
  { label: "Smart Watches", filterValue: "Smart Watches", icon: "⌚" },
  { label: "Gaming", filterValue: "Gaming Accessories", icon: "🎮" },
];

export default function CollectionsRow({
  collections,
  selectedCollection,
  onSelectCollection,
}: CollectionsRowProps) {
  const cards =
    collections && collections.length > 0
      ? collections.slice(0, 8).map((c, idx) => ({
          label: c.label,
          filterValue: c.filterValue,
          imagePath: c.imagePath,
          fallbackIcon:
            c.fallbackIcon ||
            DEFAULT_8_CATEGORIES[idx % DEFAULT_8_CATEGORIES.length].icon,
        }))
      : DEFAULT_8_CATEGORIES.map((c) => ({
          label: c.label,
          filterValue: c.filterValue,
          imagePath: "",
          fallbackIcon: c.icon,
        }));

  const isFiltered =
    selectedCollection !== "" && selectedCollection !== "All";

  return (
    <section id="collections-section" className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            style={{ backgroundColor: "#7C3AED" }}
            className="w-1.5 h-6 rounded-full"
          />
          <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
            {isFiltered ? selectedCollection : "Shop By Categories"}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onSelectCollection("All")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[#7C3AED] text-[#7C3AED] text-xs font-bold cursor-pointer transition"
        >
          <span>View All Categories</span>
          <span>→</span>
        </button>
      </div>

      {/* 8-Card Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))",
          gap: "12px",
        }}
      >
        {cards.map((col) => {
          const active =
            selectedCollection.toLowerCase() === col.filterValue.toLowerCase();
          const imgSrc = col.imagePath
            ? resolveMediaUrl(col.imagePath, "")
            : "";

          return (
            <button
              type="button"
              key={col.label}
              onClick={() =>
                onSelectCollection(active ? "All" : col.filterValue)
              }
              style={
                active
                  ? { borderColor: "#7C3AED", backgroundColor: "#F5F3FF" }
                  : undefined
              }
              className="bg-white rounded-2xl border border-gray-100 hover:border-[#7C3AED] p-3 flex flex-col items-center justify-between text-center shadow-2xs hover:shadow-sm cursor-pointer transition"
            >
              <div className="w-full h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-2 p-1">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={col.label}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-3xl">{col.fallbackIcon}</span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-800 line-clamp-1">
                {col.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}