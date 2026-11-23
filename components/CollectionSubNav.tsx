"use client";

type CollectionSubNavProps = {
  selectedCollection: string;
  onSelectCollection: (col: string) => void;
};

const NAV_ITEMS = [
  { label: "Home", icon: "🏠", href: "#hero-section", filter: "All" },
  { label: "Shop", icon: "", href: "#products-section", filter: "All", hasCaret: true },
  { label: "Collections", icon: "", href: "#collections-section", filter: "All", hasCaret: true },
  { label: "New Arrivals", icon: "", href: "#products-section", filter: "All" },
  { label: "Best Sellers", icon: "", href: "#products-section", filter: "All" },
  { label: "Deals", icon: "", href: "#deals-section", filter: "All", hot: true },
  { label: "About", icon: "", href: "#trust-section", filter: "All" },
  { label: "Contact", icon: "", href: "#footer-section", filter: "All" },
];

export default function CollectionSubNav({
  selectedCollection,
  onSelectCollection,
}: CollectionSubNavProps) {
  const isHomeActive =
    selectedCollection === "All" || selectedCollection === "";

  return (
    <nav
      aria-label="Primary Navigation"
      className="w-full bg-white border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex items-center justify-center gap-2 sm:gap-5 overflow-x-auto text-xs sm:text-[13px]">
        {NAV_ITEMS.map((item) => {
          const active = item.label === "Home" && isHomeActive;

          if (item.label === "Home") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelectCollection("All")}
                style={
                  active
                    ? { backgroundColor: "#7C3AED" }
                    : undefined
                }
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer transition ${
                  active
                    ? "text-white shadow-xs"
                    : "text-gray-700 hover:text-[#7C3AED]"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                if (item.filter) onSelectCollection(item.filter);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 font-semibold text-gray-800 hover:text-[#7C3AED] whitespace-nowrap transition"
            >
              <span>{item.label}</span>
              {item.hasCaret && <span className="text-[10px] text-gray-500">⌄</span>}
              {item.hot && (
                <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                  Hot
                </span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}