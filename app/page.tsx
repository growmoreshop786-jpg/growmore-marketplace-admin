"use client";

import { useEffect, useState } from "react";
import { PRODUCTS, COLLECTIONS, Product, CollectionItem } from "@/data/storeData";
import { fetchStoreDataFromSupabase } from "@/data/storeConfig";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import CollectionsRow from "@/components/CollectionsRow";
import ProductGrid from "@/components/ProductGrid";
import CartAndCheckout, { CartItem } from "@/components/CartAndCheckout";

export default function GrowMoreHome() {
  const [bannerImage, setBannerImage] = useState("/banner.png");
  const [collections, setCollections] = useState<CollectionItem[]>(COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  const [selectedCollection, setSelectedCollection] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchStoreDataFromSupabase().then((data) => {
      setBannerImage(data.banner.bannerImage);
      setCollections(data.collections);
      setProducts(data.products);
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCol =
      selectedCollection === "All" || p.category === selectedCollection;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCol && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalItems={totalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onResetCollection={() => setSelectedCollection("All")}
      />

      <HeroBanner bannerImage={bannerImage} />

      <CollectionsRow
        collections={collections}
        selectedCollection={selectedCollection}
        onSelectCollection={setSelectedCollection}
      />

      <ProductGrid
        products={filteredProducts}
        selectedCollection={selectedCollection}
        onClearFilter={() => setSelectedCollection("All")}
        onAddToCart={addToCart}
      />

      <section id="why-us" className="bg-[#F6F5F2] border-y border-neutral-200 py-12 px-4 sm:px-8 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-2xl">🚚</p>
            <h4 className="font-bold text-sm uppercase tracking-wide">Free Delivery Over Rs 2000</h4>
            <p className="text-xs text-neutral-500">Fast nationwide delivery across Pakistan</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl">🔄</p>
            <h4 className="font-bold text-sm uppercase tracking-wide">7 Days Replacement</h4>
            <p className="text-xs text-neutral-500">Hassle-free replacement policy on eligible items</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl">🛡️</p>
            <h4 className="font-bold text-sm uppercase tracking-wide">1 Year Brand Warranty</h4>
            <p className="text-xs text-neutral-500">Official Grow More warranty support</p>
          </div>
        </div>
      </section>

      <footer className="bg-black text-neutral-400 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-white font-black text-xl tracking-tighter">
            GROW<span className="text-emerald-500">MORE</span>
          </span>
          <p>© 2026 Grow More Store. All Rights Reserved.</p>
        </div>
      </footer>

      <CartAndCheckout
        cart={cart}
        isCartOpen={isCartOpen}
        onCloseCart={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}