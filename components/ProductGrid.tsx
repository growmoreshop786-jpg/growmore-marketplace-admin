"use client";

import { useState } from "react";
import { Product } from "@/data/storeData";

type ProductGridProps = {
  products: Product[];
  selectedCollection: string;
  onClearFilter: () => void;
  onAddToCart: (product: Product) => void;
};

export default function ProductGrid({
  products,
  selectedCollection,
  onClearFilter,
  onAddToCart,
}: ProductGridProps) {
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            {selectedCollection === "All" ? "Grow More Collections" : selectedCollection}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Showing {products.length} products
          </p>
        </div>
        {selectedCollection !== "All" && (
          <button
            onClick={onClearFilter}
            className="text-xs font-bold underline text-neutral-600 hover:text-black cursor-pointer"
          >
            Show All Collections
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {products.map((product) => {
          const discountPercent =
            product.originalPrice > 0
              ? Math.round(
                  ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
                )
              : 0;
          const showImg = Boolean(product.imagePath && !brokenImages[product.id]);

          return (
            <div
              key={product.id}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-lg transition"
            >
              <div>
                <div
                  className={`relative aspect-[4/4] ${product.bgTone} flex items-center justify-center overflow-hidden`}
                >
                  {discountPercent > 0 && (
                    <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full">
                      SAVE {discountPercent}%
                    </span>
                  )}
                  {product.badge && (
                    <span className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}

                  {showImg ? (
                    <img
                      src={product.imagePath}
                      alt={product.name}
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [product.id]: true }))
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <span className="text-6xl sm:text-7xl group-hover:scale-110 transition duration-300">
                      {product.emoji}
                    </span>
                  )}
                </div>

                <div className="p-4 sm:p-5 space-y-1.5">
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <span>★★★★★</span>
                    <span className="text-neutral-500 font-normal">
                      ({product.reviews})
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-lg text-neutral-950 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {product.subtitle}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-neutral-950">
                      Rs. {product.salePrice.toLocaleString()}
                    </span>
                    {product.originalPrice > product.salePrice && (
                      <span className="text-xs sm:text-sm text-neutral-400 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0">
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-neutral-950 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  + Quick Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}