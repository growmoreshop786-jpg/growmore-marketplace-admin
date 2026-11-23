"use client";

import { Product } from "@/data/storeData";
import { resolveMediaUrl } from "@/data/storeConfig";

interface ProductGridProps {
  products: Product[];
  selectedCollection: string;
  onSelectCollection: (col: string) => void;
  onResetFilters: () => void;
  wishlistIds: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export default function ProductGrid({
  products,
  selectedCollection,
  onSelectCollection,
  onResetFilters,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
}: ProductGridProps) {
  const isFiltered =
    selectedCollection !== "" && selectedCollection !== "All";

  return (
    <section id="products-section" className="space-y-7">
      {/* Best Sellers Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span
            style={{ backgroundColor: "#7C3AED" }}
            className="w-1.5 h-8 rounded-full mt-0.5"
          />
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] leading-tight">
              {isFiltered ? selectedCollection : "Best Sellers"}
            </h2>
            <p className="text-xs text-gray-500">Our most popular products</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectCollection("All")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[#7C3AED] text-[#7C3AED] text-xs font-bold cursor-pointer transition"
        >
          <span>View All Products</span>
          <span>→</span>
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Is category ya search ke mutabiq koi product nahi mila.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            style={{ backgroundColor: "#7C3AED" }}
            className="text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))",
            gap: "16px",
          }}
        >
          {products.map((p) => {
            const discountPct =
              p.originalPrice > p.salePrice
                ? `-${Math.round(
                    ((p.originalPrice - p.salePrice) / p.originalPrice) * 100
                  )}%`
                : p.badge;
            const liked = wishlistIds.includes(p.id);
            const mediaSrc = p.imagePath
              ? resolveMediaUrl(p.imagePath, "")
              : "";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 p-3.5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  {/* Image Box */}
                  <div className="relative h-40 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-3 p-2">
                    {discountPct && (
                      <span
                        style={{ backgroundColor: "#7C3AED" }}
                        className="absolute top-2.5 left-2.5 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full z-10"
                      >
                        {discountPct}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(p.id)}
                      aria-label="Save item"
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white border border-gray-200 text-xs flex items-center justify-center shadow-2xs cursor-pointer z-10 hover:border-[#7C3AED]"
                    >
                      {liked ? "❤️" : "♡"}
                    </button>

                    {mediaSrc ? (
                      isVideoUrl(mediaSrc) ? (
                        <video
                          src={mediaSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={mediaSrc}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      )
                    ) : (
                      <span className="text-4xl">{p.emoji}</span>
                    )}
                  </div>

                  {/* Title & Rating */}
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="text-[11px] text-[#F59E0B] font-semibold mt-1">
                    ★★★★★{" "}
                    <span className="text-gray-500 font-normal">
                      4.8 ({p.reviews || 120})
                    </span>
                  </div>

                  {/* Price in AED */}
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-black text-[#7C3AED]">
                      AED {p.salePrice.toLocaleString()}
                    </span>
                    {p.originalPrice > p.salePrice && (
                      <span className="text-[11px] text-gray-400 line-through">
                        AED {p.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Pill Button */}
                <button
                  type="button"
                  onClick={() => onAddToCart(p)}
                  style={{ backgroundColor: "#7C3AED" }}
                  className="mt-3 w-full text-white text-xs font-bold py-2.5 rounded-full cursor-pointer hover:opacity-95 transition flex items-center justify-center gap-1.5"
                >
                  <span>🛒</span>
                  <span>Add to Cart</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 3 Promo Cards Row */}
      <div
        id="deals-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(120deg, #1E1B4B 0%, #3B0764 100%)",
          }}
          className="rounded-2xl text-white p-5 flex items-center justify-between min-h-[135px] shadow-xs"
        >
          <div className="space-y-2">
            <div className="text-xs font-bold text-purple-200">
              Up to <span className="text-xl font-black text-white">70%</span>{" "}
              OFF
            </div>
            <div className="text-xs font-semibold text-purple-200">
              on Top Brands
            </div>
            <button
              type="button"
              onClick={() => onSelectCollection("Smart Watches")}
              style={{ backgroundColor: "#7C3AED" }}
              className="mt-1 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full cursor-pointer hover:opacity-95"
            >
              Shop Deals →
            </button>
          </div>
          <div className="text-4xl">⌚</div>
        </div>

        <div
          style={{
            background: "linear-gradient(120deg, #EDE9FE 0%, #DDD6FE 100%)",
          }}
          className="rounded-2xl text-[#111827] p-5 flex items-center justify-between min-h-[135px] border border-purple-200"
        >
          <div className="space-y-2">
            <h3 className="text-base font-black text-[#1E1B4B]">
              Exclusive Deals
            </h3>
            <p className="text-xs font-semibold text-gray-700">
              on Mobile Accessories
            </p>
            <button
              type="button"
              onClick={() => onSelectCollection("All")}
              className="mt-1 bg-white text-[#111827] border border-gray-200 text-[11px] font-bold px-3.5 py-1.5 rounded-full cursor-pointer hover:border-[#7C3AED]"
            >
              Shop Now →
            </button>
          </div>
          <div className="text-4xl">📱</div>
        </div>

        <div
          style={{
            background: "linear-gradient(120deg, #09071A 0%, #312E81 100%)",
          }}
          className="rounded-2xl text-white p-5 flex items-center justify-between min-h-[135px] shadow-xs"
        >
          <div className="space-y-2">
            <h3 className="text-base font-black">Gaming Accessories</h3>
            <p className="text-xs text-purple-200">Level Up Your Game</p>
            <button
              type="button"
              onClick={() => onSelectCollection("Gaming Accessories")}
              style={{ backgroundColor: "#7C3AED" }}
              className="mt-1 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full cursor-pointer hover:opacity-95"
            >
              Shop Gaming →
            </button>
          </div>
          <div className="text-4xl">🎮</div>
        </div>
      </div>

      {/* 5 Trust Strip */}
      <div
        id="trust-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "12px",
        }}
        className="bg-white rounded-2xl border border-gray-100 p-4 text-center"
      >
        <div className="space-y-0.5">
          <div className="text-base text-[#7C3AED]">🛡️</div>
          <div className="text-xs font-bold text-gray-900">
            Secure Payments
          </div>
          <div className="text-[11px] text-gray-500">
            100% Secure &amp; Encrypted
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-base text-[#7C3AED]">🚚</div>
          <div className="text-xs font-bold text-gray-900">Free Shipping</div>
          <div className="text-[11px] text-gray-500">
            On Orders Above AED 150
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-base text-[#7C3AED]">🎧</div>
          <div className="text-xs font-bold text-gray-900">24/7 Support</div>
          <div className="text-[11px] text-gray-500">
            We&apos;re Always Here
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-base text-[#7C3AED]">🔄</div>
          <div className="text-xs font-bold text-gray-900">Easy Returns</div>
          <div className="text-[11px] text-gray-500">Within 7 Days</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-base text-[#7C3AED]">🎁</div>
          <div className="text-xs font-bold text-gray-900">Gift Wrap</div>
          <div className="text-[11px] text-gray-500">Make It Special</div>
        </div>
      </div>
    </section>
  );
}