"use client";

import Link from "next/link";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onResetHome: () => void;
  onOpenCart: () => void;
  wishlistCount: number;
  totalItems: number;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  onResetHome,
  onOpenCart,
  wishlistCount,
  totalItems,
}: NavbarProps) {
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-white border-b border-gray-200 text-[11px] sm:text-xs py-2 px-4 sm:px-8 text-gray-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[#7C3AED] font-bold">🚚</span>
            <span>Free Delivery on Orders Above AED 150</span>
          </div>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#EC4899] font-bold">🏷️</span>
            <span>Up to 70% OFF on Selected Items</span>
          </div>
          <span className="text-gray-300 hidden md:inline">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#7C3AED] font-bold">🎧</span>
            <span>24/7 Customer Support</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={onResetHome}
            className="flex items-center gap-2.5 text-left cursor-pointer shrink-0"
          >
            <div
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
              }}
              className="w-10 h-10 rounded-xl text-white font-black text-2xl flex items-center justify-center shadow-sm"
            >
              G
            </div>
            <div>
              <div className="font-black text-xl leading-none tracking-tight text-[#111827]">
                Grow<span className="text-[#7C3AED]">More</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                Smart Accessories. Better Life.
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full pl-4 pr-1 py-1 focus-within:border-[#7C3AED] transition">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Search"
                style={{ backgroundColor: "#7C3AED" }}
                className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer hover:opacity-95 transition"
              >
                🔍
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs font-semibold text-gray-800">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200">
              <span>🇦🇪</span>
              <span>UAE</span>
              <span className="text-gray-400">▾</span>
            </span>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 hover:text-[#7C3AED] transition"
            >
              <span>👤</span>
              <span className="hidden md:inline">Account</span>
              <span className="text-gray-400 hidden md:inline">▾</span>
            </Link>

            <a
              href="#products-section"
              aria-label="Wishlist"
              className="relative inline-flex items-center text-gray-700 hover:text-[#7C3AED] transition"
            >
              <span className="text-base">♡</span>
              <span
                style={{ backgroundColor: "#EF4444" }}
                className="ml-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {wishlistCount}
              </span>
            </a>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Open Cart"
              className="relative inline-flex items-center text-gray-800 hover:text-[#7C3AED] cursor-pointer transition"
            >
              <span className="text-base">🛒</span>
              <span
                style={{ backgroundColor: "#EF4444" }}
                className="ml-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}