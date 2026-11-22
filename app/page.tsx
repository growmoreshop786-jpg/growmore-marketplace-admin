"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  DEFAULT_STORE_DATA,
  fetchStoreDataFromSupabase,
  OrderItem,
  Product,
} from "@/data/storeConfig";

const SIDEBAR_CATEGORIES = [
  "Phone Cases",
  "Earbuds & Headphones",
  "Chargers & Cables",
  "Power Banks",
  "Screen Protectors",
  "Phone Holders",
  "Smart Watches",
  "Gaming Accessories",
  "Others Accessories",
];

const QUICK_CATEGORIES = [
  { label: "Cases", filter: "Phone Cases", fallbackImg: "/collections/cases.png" },
  { label: "Earbuds", filter: "Earbuds & Headphones", fallbackImg: "/collections/earbuds.png" },
  { label: "Chargers", filter: "Chargers & Cables", fallbackImg: "/collections/chargers.png" },
  { label: "Power Banks", filter: "Power Banks", fallbackImg: "/collections/powerbanks.png" },
  { label: "Screen Protectors", filter: "Screen Protectors", fallbackImg: "/collections/protectors.png" },
  { label: "Holders", filter: "Phone Holders", fallbackImg: "/collections/holders.png" },
  { label: "Smart Watches", filter: "Smart Watches", fallbackImg: "/collections/watches.png" },
  { label: "Gaming", filter: "Gaming Accessories", fallbackImg: "/collections/gaming.png" },
];

interface CartEntry {
  product: Product;
  qty: number;
}

export default function GrowMoreStorefrontPage() {
  const [bannerImage, setBannerImage] = useState(DEFAULT_STORE_DATA.banner.bannerImage);
  const [bannerTitle, setBannerTitle] = useState(
    DEFAULT_STORE_DATA.banner.bannerTitle || "Premium Mobile Accessories"
  );
  const [bannerSubtitle, setBannerSubtitle] = useState(
    DEFAULT_STORE_DATA.banner.bannerSubtitle || "Stylish. Durable. Always with You."
  );

  const [products, setProducts] = useState<Product[]>(DEFAULT_STORE_DATA.products);
  const [collections, setCollections] = useState(DEFAULT_STORE_DATA.collections);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Checkout state
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  useEffect(() => {
    (async () => {
      const data = await fetchStoreDataFromSupabase();
      if (data.banner.bannerImage) setBannerImage(data.banner.bannerImage);
      if (data.banner.bannerTitle) setBannerTitle(data.banner.bannerTitle);
      if (data.banner.bannerSubtitle) setBannerSubtitle(data.banner.bannerSubtitle);
      if (data.products.length > 0) setProducts(data.products);
      if (data.collections.length > 0) setCollections(data.collections);
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === "All" ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(p.category.toLowerCase());

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchesCat && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.product.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.salePrice * item.qty, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmittingOrder(true);
    setOrderMessage("");

    const first = cart[0];
    const orderId = `GM-${Date.now().toString().slice(-6)}`;
    const newOrder: OrderItem = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      productName:
        cart.length > 1 ? `${first.product.name} (+${cart.length - 1} more)` : first.product.name,
      category: first.product.category,
      unitPrice: cartTotal,
      qty: 1,
      status: "Processing",
      date: new Date().toLocaleDateString(),
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("orders").insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          phone: newOrder.phone,
          city: newOrder.city,
          product_name: newOrder.productName,
          category: newOrder.category,
          unit_price: newOrder.unitPrice,
          qty: newOrder.qty,
          status: newOrder.status,
          date_label: newOrder.date,
        });
        if (error) throw error;
      }
      setCart([]);
      setCustomerName("");
      setPhone("");
      setCity("");
      setOrderMessage(`Order ${orderId} confirm ho gaya! Admin panel ke Orders tab mein dikh jayega.`);
    } catch (err: unknown) {
      setOrderMessage(err instanceof Error ? err.message : "Order save karne mein masla aaya.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const isVideoBanner = /\.(mp4|webm|mov)(\?|$)/i.test(bannerImage);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      {/* Top Announcement Bar */}
      <div className="bg-[#140B29] text-white text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <span>Free Delivery on Orders Above AED 150</span>
            <span>Up to 70% OFF on Selected Items</span>
            <span>Secure &amp; Easy Payments</span>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <span>UAE</span>
            <span>|</span>
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-violet-600 to-fuchsia-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
              G
            </div>
            <div>
              <div className="font-black text-xl leading-none tracking-tight text-[#1A1033]">
                Grow<span className="text-purple-600">More</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                Smart Accessories. Better Life.
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:flex items-center border border-purple-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-purple-500/30">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-2 text-sm focus:outline-none"
            />
            <button
              type="button"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-bold cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Right Utility Icons */}
          <div className="flex items-center gap-4 text-xs font-medium text-neutral-700">
            <div className="hidden sm:block text-right leading-tight">
              <div className="font-bold text-neutral-900">Support</div>
              <div className="text-[11px] text-neutral-500">24/7</div>
            </div>

            <Link
              href="/admin"
              className="hover:text-purple-700 font-semibold transition"
              title="Admin Panel"
            >
              Account
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative px-2 py-1 rounded-lg hover:bg-purple-50 text-purple-700 font-bold cursor-pointer"
            >
              Wishlist ({wishlist.length})
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-lg font-bold cursor-pointer"
            >
              Cart ({cartCount})
            </button>
          </div>
        </div>

        {/* Navigation Strip */}
        <div className="border-t border-neutral-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-6 overflow-x-auto text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shrink-0 cursor-pointer"
            >
              All Categories
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`shrink-0 cursor-pointer ${
                selectedCategory === "All" ? "text-purple-700 font-bold" : "hover:text-purple-700"
              }`}
            >
              Home
            </button>
            <a href="#best-sellers" className="hover:text-purple-700 shrink-0">
              Shop
            </a>
            <a href="#collections-row" className="hover:text-purple-700 shrink-0">
              Collections
            </a>
            <a href="#best-sellers" className="hover:text-purple-700 shrink-0">
              New Arrivals
            </a>
            <a href="#best-sellers" className="hover:text-purple-700 shrink-0">
              Best Sellers
            </a>
            <a href="#promo-grid" className="hover:text-purple-700 shrink-0 inline-flex items-center gap-1.5">
              Deals
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Hot
              </span>
            </a>
            <a href="#trust-strip" className="hover:text-purple-700 shrink-0">
              About
            </a>
            <a href="#footer-section" className="hover:text-purple-700 shrink-0">
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* Hero + Left Sidebar */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Category Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-neutral-200 rounded-xl p-2 h-fit">
            <ul className="divide-y divide-neutral-100 text-xs font-medium">
              {SIDEBAR_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(active ? "All" : cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition cursor-pointer ${
                        active
                          ? "bg-purple-50 text-purple-700 font-bold"
                          : "text-neutral-700 hover:bg-neutral-50 hover:text-purple-700"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-neutral-400">›</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Hero Banner */}
          <div className="lg:col-span-9 relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1A0D36] via-[#2B125E] to-[#4A1D96] text-white min-h-[300px] sm:min-h-[360px] flex items-center">
            {isVideoBanner ? (
              <video
                src={bannerImage}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
            ) : (
              <img
                src={bannerImage}
                alt={bannerTitle}
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#14092B]/90 via-[#23104C]/70 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 max-w-xl space-y-3">
              <div className="text-[11px] font-bold tracking-widest uppercase text-purple-300">
                UPGRADE YOUR TECH
              </div>
              <h1 className="text-3xl sm:text-5xl font-black leading-tight">{bannerTitle}</h1>
              <p className="text-sm sm:text-base text-purple-100/90">{bannerSubtitle}</p>
              <div className="pt-2">
                <a
                  href="#best-sellers"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-lg transition"
                >
                  Shop Now →
                </a>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end justify-between p-6 ml-auto relative z-10 self-stretch">
              <span className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow">
                Up to 70% OFF
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Cards */}
      <section id="collections-row" className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {QUICK_CATEGORIES.map((item) => {
            const matchedCol = collections.find(
              (c) => c.label.toLowerCase() === item.label.toLowerCase()
            );
            const imgSrc = matchedCol?.imagePath || item.fallbackImg;
            const active = selectedCategory === item.filter;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setSelectedCategory(active ? "All" : item.filter)}
                className={`group bg-white rounded-xl border p-2.5 text-center transition cursor-pointer ${
                  active
                    ? "border-purple-600 ring-2 ring-purple-500/20"
                    : "border-neutral-200 hover:border-purple-400"
                }`}
              >
                <div className="h-16 w-full rounded-lg bg-neutral-50 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={imgSrc}
                    alt={item.label}
                    className="h-full w-full object-contain group-hover:scale-105 transition"
                  />
                </div>
                <div className="text-xs font-semibold text-neutral-800 truncate">{item.label}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Best Sellers */}
      <section id="best-sellers" className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-9">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-purple-600 inline-block" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1033]">
                {selectedCategory === "All" ? "Best Sellers" : selectedCategory}
              </h2>
              <p className="text-xs text-neutral-500">Our most popular products</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer"
          >
            View All Products →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const discountPct =
              product.originalPrice > product.salePrice && product.originalPrice > 0
                ? Math.round(
                    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
                  )
                : null;
            const liked = wishlist.includes(product.id);
            const isVideo = product.imagePath ? /\.(mp4|webm|mov)(\?|$)/i.test(product.imagePath) : false;

            return (
              <div
                key={product.id}
                className="bg-white border border-neutral-200 rounded-xl p-3.5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {discountPct ? `-${discountPct}%` : product.badge || "HOT"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`text-sm font-bold cursor-pointer ${
                        liked ? "text-rose-500" : "text-neutral-400 hover:text-rose-500"
                      }`}
                      aria-label="Wishlist"
                    >
                      {liked ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="h-36 rounded-lg bg-neutral-50 flex items-center justify-center overflow-hidden mb-3">
                    {product.imagePath ? (
                      isVideo ? (
                        <video
                          src={product.imagePath}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <img
                          src={product.imagePath}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      )
                    ) : (
                      <span className="text-4xl">{product.emoji}</span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-neutral-900 line-clamp-1">{product.name}</h3>
                  <div className="text-xs text-amber-500 mt-1">
                    ★★★★★{" "}
                    <span className="text-neutral-500">4.8 ({product.reviews || 120})</span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-sm font-black text-purple-700">
                      AED {product.salePrice.toLocaleString()}
                    </span>
                    {product.originalPrice > product.salePrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        AED {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer transition"
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Promo Banners */}
      <section id="promo-grid" className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-9">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-gradient-to-r from-[#1A0D36] to-[#3B1878] text-white p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <h3 className="text-xl font-black">Smart Watches</h3>
              <p className="text-xs text-purple-200 mt-1">Up to 50% OFF</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory("Smart Watches")}
              className="mt-4 w-fit bg-purple-600 hover:bg-purple-500 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
            >
              Shop Now →
            </button>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-purple-100 via-violet-100 to-fuchsia-100 text-[#1A1033] border border-purple-200 p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <h3 className="text-xl font-black">Exclusive Deals</h3>
              <p className="text-xs text-neutral-600 mt-1">On Top Brands</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="mt-4 w-fit bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
            >
              Shop Deals →
            </button>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-[#140B29] to-[#4C1D95] text-white p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <h3 className="text-xl font-black">Gaming Accessories</h3>
              <p className="text-xs text-purple-200 mt-1">Level Up Your Game</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory("Gaming Accessories")}
              className="mt-4 w-fit bg-purple-600 hover:bg-purple-500 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
            >
              Shop Gaming →
            </button>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section id="trust-strip" className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-9 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-purple-50/60 border border-purple-100 rounded-2xl p-5 text-center">
          <div>
            <div className="text-xs font-extrabold text-purple-700">Free Shipping</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">On Orders Above AED 150</div>
          </div>
          <div>
            <div className="text-xs font-extrabold text-purple-700">Secure Payments</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">100% Secure &amp; Encrypted</div>
          </div>
          <div>
            <div className="text-xs font-extrabold text-purple-700">24/7 Support</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">We&apos;re Always Here</div>
          </div>
          <div>
            <div className="text-xs font-extrabold text-purple-700">Easy Returns</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Within 7 Days</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-xs font-extrabold text-purple-700">Gift Wrap</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Make It Special</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer-section" className="mt-auto bg-[#120926] text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-purple-600 font-black text-lg flex items-center justify-center">
                G
              </div>
              <span className="font-black text-xl">
                Grow<span className="text-purple-400">More</span>
              </span>
            </div>
            <p className="text-xs text-purple-200/80">Smart Accessories. Better Life.</p>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-1.5 text-xs text-purple-200/80">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#best-sellers" className="hover:text-white">Shop</a></li>
              <li><a href="#collections-row" className="hover:text-white">Collections</a></li>
              <li><a href="#best-sellers" className="hover:text-white">Best Sellers</a></li>
              <li><Link href="/admin" className="hover:text-purple-300">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3">Customer Service</h4>
            <ul className="space-y-1.5 text-xs text-purple-200/80">
              <li><a href="#trust-strip" className="hover:text-white">FAQs</a></li>
              <li><a href="#trust-strip" className="hover:text-white">Shipping Policy</a></li>
              <li><a href="#trust-strip" className="hover:text-white">Return Policy</a></li>
              <li><a href="#trust-strip" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#trust-strip" className="hover:text-white">Terms &amp; Conditions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-xs text-purple-200/80 mb-3">
              Get the latest updates and exclusive offers!
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNewsletterMsg("Subscribed! Latest offers aapko mil jayengi.");
                setNewsletterEmail("");
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white text-neutral-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer"
              >
                Subscribe
              </button>
            </form>
            {newsletterMsg && (
              <p className="text-xs text-emerald-400 mt-2">{newsletterMsg}</p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-200/70">
          <div>© 2026 GrowMore. All rights reserved.</div>
          <div>Made with ♥ for Tech Lovers</div>
        </div>
      </footer>

      {/* Cart & Checkout Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="font-black text-base text-[#1A1033]">Your Cart ({cartCount})</h3>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-neutral-500 py-8 text-center">
                  Cart khali hai. Kisi product par &ldquo;Add to Cart&rdquo; dabayein.
                </p>
              ) : (
                <div className="space-y-3">
                  {cart.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="border border-neutral-200 rounded-xl p-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-xs">{product.name}</div>
                        <div className="text-xs text-purple-700 font-bold mt-0.5">
                          AED {(product.salePrice * qty).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-neutral-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-neutral-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {orderMessage && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {orderMessage}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t pt-4 mt-6 space-y-3">
                <div className="flex items-center justify-between font-black text-sm">
                  <span>Total</span>
                  <span className="text-purple-700">AED {cartTotal.toLocaleString()}</span>
                </div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City / Address"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer"
                >
                  {submittingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}