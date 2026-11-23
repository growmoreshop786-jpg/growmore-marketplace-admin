"use client";

import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  COLLECTIONS,
  PRODUCTS,
  Product,
  CollectionItem,
} from "@/data/storeData";
import { fetchStoreDataFromSupabase } from "@/data/storeConfig";
import Navbar from "@/components/Navbar";
import CollectionSubNav from "@/components/CollectionSubNav";
import HeroBanner from "@/components/HeroBanner";
import CollectionsRow from "@/components/CollectionsRow";
import ProductGrid from "@/components/ProductGrid";
import StoreFooter from "@/components/StoreFooter";
import CartAndCheckout, { CartItem } from "@/components/CartAndCheckout";

export default function GrowMoreHomePage() {
  const [bannerImage, setBannerImage] = useState("/banner.png");
  const [bannerTitle, setBannerTitle] = useState("Premium Mobile Accessories");
  const [bannerSubtitle, setBannerSubtitle] = useState(
    "Stylish. Durable. Always with You."
  );

  const [collections, setCollections] = useState<CollectionItem[]>(COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCollection, setSelectedCollection] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const remote = await fetchStoreDataFromSupabase();
        if (!active || !remote) return;
        if (remote.banner?.bannerImage) {
          setBannerImage(remote.banner.bannerImage);
        }
        if (remote.banner?.bannerTitle) {
          setBannerTitle(remote.banner.bannerTitle);
        }
        if (remote.banner?.bannerSubtitle) {
          setBannerSubtitle(remote.banner.bannerSubtitle);
        }
        if (Array.isArray(remote.collections) && remote.collections.length > 0) {
          setCollections(remote.collections);
        }
        if (Array.isArray(remote.products) && remote.products.length > 0) {
          setProducts(remote.products);
        }
      } catch (err) {
        console.warn("Supabase store data sync fallback:", err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCollection === "All" ||
        selectedCollection === "" ||
        p.category.toLowerCase() === selectedCollection.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCollection, searchQuery]);

  const toggleWishlist = (id: number) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-[#F5F5F8] text-[#111827] flex flex-col">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetHome={() => {
          setSelectedCollection("All");
          setSearchQuery("");
        }}
        onOpenCart={() => setCartOpen(true)}
        wishlistCount={wishlistIds.length}
        totalItems={totalItems}
      />

      <CollectionSubNav
        selectedCollection={selectedCollection}
        onSelectCollection={setSelectedCollection}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-5 space-y-8 flex-1">
        <HeroBanner
          bannerImage={bannerImage}
          bannerTitle={bannerTitle}
          bannerSubtitle={bannerSubtitle}
          isSupabaseConfigured={isSupabaseConfigured}
        />

        <CollectionsRow
          collections={collections}
          selectedCollection={selectedCollection}
          onSelectCollection={setSelectedCollection}
        />

        <ProductGrid
          products={filteredProducts}
          selectedCollection={selectedCollection}
          onSelectCollection={setSelectedCollection}
          onResetFilters={() => {
            setSelectedCollection("All");
            setSearchQuery("");
          }}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
        />
      </main>

      <StoreFooter />

      <CartAndCheckout
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}