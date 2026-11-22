"use client";

import { useState } from "react";
import { NAV_COLLECTIONS } from "@/data/storeData";

type NavbarProps = {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalItems: number;
  onOpenCart: () => void;
  onResetCollection: () => void;
  selectedCollection?: string;
  onSelectCollection?: (col: string) => void;
};

export default function Navbar({
  searchQuery,
  onSearchChange,
  totalItems,
  onOpenCart,
  onResetCollection,
  selectedCollection = "All",
  onSelectCollection = () => {},
}: NavbarProps) {
  const [categoryDropdown, setCategoryDropdown] = useState("All");
  const [showAllCatsMenu, setShowAllCatsMenu] = useState(false);

  const handleSelectCat = (col: string) => {
    setCategoryDropdown(col);
    onSelectCollection(col);
    setShowAllCatsMenu(false);
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 shadow-2xs">
      {/* 1. Top Dark Utility Bar */}
      <div className="bg-[#0B1120] text-neutral-200 text-[11px] sm:text-xs py-2 px-4 sm:px-8">
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <span>📍 Grow More Official Store</span>
            <span className="hidden md:inline">🚚 Free Delivery Over Rs. 2,000</span>
            <span className="hidden lg:inline">🛡️ 7 Days Replacement &amp; 1 Year Warranty</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-300">
            <a href="#why-us" className="hover:text-white transition">
              Warranty
            </a>
            <span>|</span>
            <a href="#contact" className="hover:text-white transition">
              Help Center
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row (GROW MORE Left Corner + Search + Compare/Wishlist/Cart/Sign In) */}
      <div className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* GROW MORE Logo — Left Corner */}
        <a
          href="#"
          onClick={onResetCollection}
          className="shrink-0 flex flex-col leading-none"
        >
          <span className="text-2xl sm:text-[28px] font-black tracking-tight text-neutral-950">
            GROW<span className="text-emerald-600">MORE</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wide text-neutral-500 mt-0.5">
            Power Your Everyday
          </span>
        </a>

        {/* Search + Category Filter + Search Button */}
        <div className="hidden md:flex items-center flex-1 max-w-2xl border border-neutral-300 rounded-md overflow-hidden bg-white focus-within:border-emerald-600">
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          <select
            value={categoryDropdown}
            onChange={(e) => handleSelectCat(e.target.value)}
            aria-label="Filter by category"
            className="h-full px-3 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-50 border-l border-neutral-300 focus:outline-none cursor-pointer"
          >
            {NAV_COLLECTIONS.map((col) => (
              <option key={col} value={col}>
                {col === "All" ? "All Categories" : col}
              </option>
            ))}
          </select>
          <a
            href="#products"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-bold flex items-center justify-center transition"
            aria-label="Search"
          >
            🔍
          </a>
        </div>

        {/* Right Quick Actions: Compare, Wishlist, Cart, Sign In */}
        <div className="flex items-center gap-4 sm:gap-6 text-[11px] font-medium text-neutral-700">
          <a
            href="#products"
            className="hidden sm:flex flex-col items-center gap-1 hover:text-emerald-600 transition"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16l-4-4 4-4" />
              <path d="M3 12h14" />
              <path d="M17 8l4 4-4 4" />
              <path d="M21 12H7" />
            </svg>
            <span>Compare</span>
          </a>

          <a
            href="#products"
            className="hidden sm:flex flex-col items-center gap-1 hover:text-emerald-600 transition"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Wishlist</span>
          </a>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex flex-col items-center gap-1 hover:text-emerald-600 transition cursor-pointer"
          >
            <span className="relative">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="-top-2 -right-2.5 absolute bg-emerald-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </span>
            <span>Cart</span>
          </button>

          <a
            href="#contact"
            className="hidden sm:flex flex-col items-center gap-1 hover:text-emerald-600 transition"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Sign in</span>
          </a>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <input
          type="text"
          placeholder="Search Grow More products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-emerald-600"
        />
      </div>

      {/* 3. Lower Navigation Bar (Shop By Category + Spaced Website Links) */}
      <div className="border-t border-neutral-200 bg-white relative">
        <div className="w-full px-4 sm:px-8 h-13 flex items-center gap-8 sm:gap-12 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setShowAllCatsMenu((prev) => !prev)}
            className="shrink-0 bg-[#0B1120] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm flex items-center gap-2.5 transition cursor-pointer"
          >
            <span>☰</span>
            <span>Shop By Category</span>
          </button>

          <nav className="flex items-center gap-7 sm:gap-10 lg:gap-12 text-xs sm:text-[13px] font-bold uppercase tracking-wider whitespace-nowrap">
            <a
              href="#"
              onClick={onResetCollection}
              className="py-3.5 px-1 border-b-2 border-emerald-600 text-emerald-600 transition"
            >
              Home
            </a>
            <a
              href="#products"
              onClick={onResetCollection}
              className="py-3.5 px-1 border-b-2 border-transparent text-neutral-800 hover:text-emerald-600 transition"
            >
              Products
            </a>
            <a
              href="#products"
              className="py-3.5 px-1 border-b-2 border-transparent text-neutral-800 hover:text-emerald-600 transition"
            >
              Deals
            </a>
            <a
              href="#why-us"
              className="py-3.5 px-1 border-b-2 border-transparent text-neutral-800 hover:text-emerald-600 transition"
            >
              Warranty
            </a>
            <a
              href="#about"
              className="py-3.5 px-1 border-b-2 border-transparent text-neutral-800 hover:text-emerald-600 transition"
            >
              About Us
            </a>
            <a
              href="#contact"
              className="py-3.5 px-1 border-b-2 border-transparent text-neutral-800 hover:text-emerald-600 transition"
            >
              Contact Us
            </a>
          </nav>
        </div>

        {/* Category Dropdown Menu */}
        {showAllCatsMenu && (
          <div className="w-full px-4 sm:px-8 pb-4">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {NAV_COLLECTIONS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => handleSelectCat(col)}
                  className={`text-left px-3 py-2 rounded-md text-xs font-semibold transition cursor-pointer ${
                    selectedCollection === col
                      ? "bg-emerald-600 text-white"
                      : "hover:bg-neutral-200/70 text-neutral-800"
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}